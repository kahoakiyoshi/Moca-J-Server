import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { ROLES } from "@/lib/constants";

// Helper to verify admin session
async function verifyAdmin(request: NextRequest) {
  const idToken = request.cookies.get("id_token")?.value;
  if (!idToken) return null;
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

// GET /api/users - List administrative users
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  const searchName = searchParams.get("searchName") || "";
  const uid = searchParams.get("uid") || "";

  try {
    // 1. Direct fetch by UID if provided (most efficient)
    if (uid) {
      const doc = await adminDb.collection("users").doc(uid).get();
      if (!doc.exists) {
        return NextResponse.json({ users: [] });
      }
      return NextResponse.json({ users: [{ uid: doc.id, ...doc.data() }] });
    }

    // 2. Query construction for other filters
    let query: any = adminDb.collection("users");

    if (id) {
      // Filter by sequential ID in Firestore
      query = query.where("id", "==", id);
    }

    const snapshot = await query.get();
    let users = snapshot.docs.map((doc: { id: any; data: () => any }) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    // 3. Local filtering for name or email (Firestore doesn't support infix string matching)
    if (searchName) {
      const lowSearch = searchName.toLowerCase();
      users = users.filter(
        (u: any) =>
          ((u.lastName || "") + (u.firstName || "")).toLowerCase().includes(lowSearch) ||
          (u.email || "").toLowerCase().includes(lowSearch)
      );
    }

    // Sort by id for consistent display
    users.sort((a: any, b: any) => (a.id || "").localeCompare(b.id || ""));

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/users - Create/Update user in Firestore and Firebase Auth
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, email, lastName, firstName, role, isNew } = body;

    let finalUid = id;

    // 1. If it's a new user, create them in Firebase Authentication first
    if (isNew) {
      if (!email) {
        return NextResponse.json({ error: "Email is required for new users" }, { status: 400 });
      }

      try {
        const userRecord = await adminAuth.createUser({
          email: email,
          password: "password1234",
          displayName: `${lastName} ${firstName}`,
        });
        finalUid = userRecord.uid;
      } catch (authError: any) {
        console.error("Firebase Auth creation error:", authError);
        return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 400 });
      }
    }

    if (!finalUid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 2. Save/Update user data in Firestore with sequential ID
    const finalId = await adminDb.runTransaction(async (transaction) => {
      let sequentialId = body.id; // Existing sequential id if updating

      if (isNew) {
        const counterRef = adminDb.collection("counters").doc("users");
        const counterDoc = await transaction.get(counterRef);
        let nextIdValue = 1;
        if (counterDoc.exists) {
          nextIdValue = (counterDoc.data()?.current || 0) + 1;
        }
        transaction.set(counterRef, { current: nextIdValue }, { merge: true });
        sequentialId = nextIdValue.toString().padStart(6, "0");
      }

      const userData = {
        id: sequentialId, // Human readable sequential ID
        uid: finalUid, // Firebase Auth UID
        email,
        lastName,
        firstName,
        role: role || ROLES.ADMIN,
        updatedAt: new Date().toISOString(),
      };

      if (isNew) {
        (userData as any).createdAt = new Date().toISOString();
      }

      transaction.set(adminDb.collection("users").doc(finalUid), userData, { merge: true });
      return sequentialId;
    });

    return NextResponse.json({ success: true, uid: finalUid, id: finalId });
  } catch (error: any) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
