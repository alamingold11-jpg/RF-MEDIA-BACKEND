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
  const gatewayUrl = "https://sandbox.okexpay.dev/v1/Collect"; // সঠিক স্যান্ডবক্স হোস্ট এবং পাথ

  const amount = req.body?.money || req.query?.money || "100";
  const out_trade_no = "ORD_" + Date.now();
  const pay_type = req.body?.pay_type || req.query?.pay_type || "BKASH";
  const currency = "BDT";
  const notify_url = "https://rf-media-backend.vercel.app/api/callback";
  const returnUrl = "https://www.google.com";
  const attach = "";

  const params = {
    currency: currency,
    money: amount,
    mchId: mchId,
    notify_url: notify_url,
    out_trade_no: out_trade_no,
    pay_type: pay_type,
    returnUrl: returnUrl
  };

  const sortedKeys = Object.keys(params).sort();
  let stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');

  const stringSignTemp = stringA + "&key=" + apiKey;
  const sign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toLowerCase();

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
      message: "Request sent to OKExPay Collect API successfully",
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
