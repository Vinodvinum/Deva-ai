import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, getAdminEmail } from "./firebaseClient";

export async function ensureUserProfile(firebaseUser) {
  if (!db) {
    return {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || "User",
      email: firebaseUser.email || "",
      plan: "free",
      isAdmin: (firebaseUser.email || "").toLowerCase() === getAdminEmail(),
      status: "active",
      totalQuestions: 0,
    };
  }

  const userRef = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(userRef);
  const isAdminByEmail =
    (firebaseUser.email || "").toLowerCase() === getAdminEmail();

  if (!snap.exists()) {
    const profile = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || "User",
      email: firebaseUser.email || "",
      plan: "free",
      isAdmin: isAdminByEmail,
      status: "active",
      totalQuestions: 0,
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, profile, { merge: true });
    return profile;
  }

  const profile = snap.data();
  if (isAdminByEmail && !profile.isAdmin) {
    await setDoc(userRef, { isAdmin: true }, { merge: true });
    return { ...profile, isAdmin: true };
  }
  return profile;
}
