export default function handler(req, res) {
  // CORS Header allow kora (jate je kono frontend theke call kora jay)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { userId, amount, gateway } = req.body || {};

    // Ekhane apni Supabase-er sathe connect kore data save korar logic likhte parben
    return res.status(200).json({
      success: true,
      message: "Deposit request received successfully!",
      data: { userId, amount, gateway, timestamp: new Date().toISOString() }
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
