export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // এখন GET বা POST দুটোতেই রেসপন্স দেখাবে
  return res.status(200).json({
    success: true,
    message: "Deposit API is working fine!",
    gateway: "https://sandbox.wpay.life/pay"
  });
}
