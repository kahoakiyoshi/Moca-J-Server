import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebase-admin";

// Helper to verify auth
async function verifySession(request: NextRequest) {
  const idToken = request.cookies.get("id_token")?.value;
  if (!idToken) return null;
  try {
    return await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return null;
  }
}

// GET /api/test-results - List test results
export async function GET(request: NextRequest) {
  const session = await verifySession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");
  const approved = searchParams.get("approved");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    let query: any = adminDb.collection("test_results");

    // To avoid complex composite index requirements, we fetch and then sort/filter in memory
    // or we only use simple filters in Firestore and do the rest locally.

    // Simple filter by patientId in Firestore is okay
    if (patientId) {
      query = query.where("patientId", "==", patientId);
    }

    // Filter by approval status in Firestore is okay
    if (approved === "true") {
      query = query.where("approved", "==", true);
    } else if (approved === "false") {
      query = query.where("approved", "==", false);
    }

    // Fetch the results
    const snapshot = await query.get();
    let results = snapshot.docs.map((doc: any) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    // Filter by date range locally
    if (startDate || endDate) {
      results = results.filter((item: any) => {
        const itemDate = item.created_at;
        if (!itemDate) return false;

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (itemDate < start.toISOString()) return false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (itemDate > end.toISOString()) return false;
        }

        return true;
      });
    }

    // Sort by created_at desc locally
    results.sort((a: any, b: any) => {
      const dateA = a.created_at || "";
      const dateB = b.created_at || "";
      return dateB.localeCompare(dateA);
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error fetching test results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/test-results - Create new test result
export async function POST(request: NextRequest) {
  const session = await verifySession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { patientId, score, approved, duration, result } = body;

    if (!patientId) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }

    const newResult = {
      patientId,
      score: score || 0,
      approved: approved || false,
      duration: duration || "00:00:00",
      result: result || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("test_results").add(newResult);

    return NextResponse.json({
      success: true,
      uid: docRef.id,
      ...newResult,
    });
  } catch (error: any) {
    console.error("Error saving test result:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
