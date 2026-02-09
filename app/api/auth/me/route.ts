import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { ROLES } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const idToken = request.cookies.get("id_token")?.value;

  if (!idToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      // Return basic info from token if Firestore doc doesn't exist
      return NextResponse.json({
        user: {
          uid: uid,
          email: decodedToken.email || "",
          role: ROLES.USER,
          name: decodedToken.name || "User",
          id: "",
          lastName: "",
          firstName: "",
        },
      });
    }

    const userData = userDoc.data();
    return NextResponse.json({
      user: {
        uid: uid,
        email: decodedToken.email || "",
        ...userData,
      },
    });
  } catch (error: any) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
