import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const mchId = "1000";
  const apiKey = "4035fcd2720e1b06ea455bdde411012";
  const gatewayUrl = "https://sandbox.wpay.life/pay"; // Athoba Wpay-er thik je endpoint document-e deya ache

  const amount = req.body?.amount || req.query?.amount || "100.00";
  const orderId = "ORD_" + Date.now();

  // Wpay sign generate korar rules (example format)
  const rawString = `mchId=${mchId}&orderId=${orderId}&amount=${amount}&key=${apiKey}`;
  const sign = crypto.createHash('md5').update(rawString).digest('hex').toUpperCase();

  const payload = {
    mchId: mchId,
    orderId: orderId,
    amount: amount,
    sign: sign,
    callbackUrl: "https://rf-media-backend.vercel.app/api/callback"
  };

  try {
    // Wpay sandbox gateway-te fetch request pathano
    const gatewayResponse = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await gatewayResponse.json();

    return res.status(200).json({
      success: true,
      message: "Gateway request executed successfully",
      gatewayResult: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to connect with Wpay gateway",
      error: error.message,
      sentPayload: payload
    });
  }
}
