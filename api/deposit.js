import crypto from 'crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // টেস্ট ক্রেডেন্সিয়াল
  const mchId = "1000";
  const apiKey = "4035fcd2720e1b06ea455bdde411012";
  const gatewayUrl = "https://sandbox.wpay.life/pay";

  // টেস্টের জন্য ডামি ডেটা (বা রিকোয়েস্ট থেকে আসা ডেটা)
  const amount = req.body?.amount || req.query?.amount || "100.00";
  const orderId = "ORD_" + Date.now();

  // Wpay সাইন বা সিগনেচার তৈরির নিয়ম (MD5 Hash)
  // ফরম্যাট: mchId + orderId + amount + key (ডকুমেন্টেশন অনুযায়ী সাজাতে হবে)
  const rawString = `mchId=${mchId}&orderId=${orderId}&amount=${amount}&key=${apiKey}`;
  const sign = crypto.createHash('md5').update(rawString).digest('hex').toUpperCase();

  const payload = {
    mchId: mchId,
    orderId: orderId,
    amount: amount,
    sign: sign,
    callbackUrl: "https://rf-media-backend.vercel.app/api/callback"
  };

  return res.status(200).json({
    success: true,
    message: "Ready to send request to Wpay Sandbox",
    gateway: gatewayUrl,
    requestData: payload
  });
}
