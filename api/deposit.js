import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const mchId = "1000";
  const apiKey = "4035fcd2d720e1b06ea455bdde411012";
  const gatewayUrl = "https://sandbox.wpay.life/v1/Collect"; // সঠিক এন্ডপয়েন্ট

  const amount = req.body?.money || req.query?.money || "100";
  const out_trade_no = "ORD_" + Date.now();
  const pay_type = req.body?.pay_type || req.query?.pay_type || "BKASH";
  const currency = "BDT";
  const notify_url = "https://rf-media-backend.vercel.app/api/callback";
  const returnUrl = "https://www.google.com";
  const attach = "";

  // ১. প্যারামিটারগুলো অ্যাসেন্ডিং অর্ডারে সাজিয়ে স্ট্রিং তৈরি (ASCII order: currency, money, mchId, notify_url, out_trade_no, pay_type, returnUrl)
  // তবে ডকুমেন্টেশনের নিয়ম অনুযায়ী সিক্রেট কি যোগ করার আগে সমস্ত প্যারামিটার (যাদের মান আছে এবং sign নয়) key=value&key=value আকারে সাজাতে হবে।
  // সহজ করার জন্য নিচে সরাসরি সাজানো হলো:
  
  const params = {
    currency: currency,
    money: amount,
    mchId: mchId,
    notify_url: notify_url,
    out_trade_no: out_trade_no,
    pay_type: pay_type,
    returnUrl: returnUrl
  };

  // কি-গুলোকে অ্যালফাবেট অনুযায়ী সর্ট করা
  const sortedKeys = Object.keys(params).sort();
  let stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');

  // ২. কি যুক্ত করে MD5 এবং লোয়ারকেস করা (Wpay নিয়ম অনুযায়ী)
  const stringSignTemp = stringA + "&key=" + apiKey;
  const sign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toLowerCase();

  // ৩. URL Encoded ফর্ম ডাটা তৈরি
  const formData = new URLSearchParams({
    ...params,
    attach: attach,
    sign: sign
  });

  try {
    const gatewayResponse = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const result = await gatewayResponse.json();

    return res.status(200).json({
      success: true,
      message: "Request sent to Wpay Collect API successfully",
      gatewayResult: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to connect with gateway",
      error: error.message
    });
  }
}
