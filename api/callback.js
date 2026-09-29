export default function handler(req, res) {
  // CORS Header allow করা
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Wpay থেকে যখন পেমেন্ট সাকসেস বা ফেইল হওয়ার নোটিফিকেশন (Callback) পাঠাবে
  if (req.method === 'POST' || req.method === 'GET') {
    const callbackData = req.method === 'POST' ? req.body : req.query;

    console.log("Wpay Callback Received:", callbackData);

    // গেটওয়ের নিয়ম অনুযায়ী সফলভাবে রিসিভ করার পর অবশ্যই "success" রিটার্ন করতে হবে
    return res.status(200).send("success");
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
