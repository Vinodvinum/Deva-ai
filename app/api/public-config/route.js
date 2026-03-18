import { NextResponse } from "next/server";

export async function GET() {
  const firebaseConfig = {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      process.env.FIREBASE_AUTH_DOMAIN ||
      "",
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.FIREBASE_PROJECT_ID ||
      "",
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.FIREBASE_STORAGE_BUCKET ||
      "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.FIREBASE_MESSAGING_SENDER_ID ||
      "",
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "",
  };

  const missing = [];
  if (!firebaseConfig.apiKey) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!firebaseConfig.authDomain)
    missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  if (!firebaseConfig.projectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  if (!firebaseConfig.appId) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");

  if (missing.length) {
    return NextResponse.json(
      { error: `Missing Firebase env vars: ${missing.join(", ")}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    firebaseConfig,
    adminEmail:
      process.env.NEXT_PUBLIC_DEVA_ADMIN_EMAIL ||
      process.env.DEVA_ADMIN_EMAIL ||
      "admin@devaai.com",
    razorpayKey: process.env.RAZORPAY_KEY_ID || "",
  });
}
