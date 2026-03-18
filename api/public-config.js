module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
  };

  const missing = [];
  if (!firebaseConfig.apiKey) missing.push('FIREBASE_API_KEY');
  if (!firebaseConfig.authDomain) missing.push('FIREBASE_AUTH_DOMAIN');
  if (!firebaseConfig.projectId) missing.push('FIREBASE_PROJECT_ID');
  if (!firebaseConfig.appId) missing.push('FIREBASE_APP_ID');

  if (missing.length) {
    return res.status(500).json({
      error: `Missing required Firebase env vars: ${missing.join(', ')}`
    });
  }

  return res.status(200).json({
    firebaseConfig,
    adminEmail: process.env.DEVA_ADMIN_EMAIL || process.env.NEXT_PUBLIC_DEVA_ADMIN_EMAIL || 'admin@devaai.com',
    razorpayKey: process.env.RAZORPAY_KEY_ID || ''
  });
};
