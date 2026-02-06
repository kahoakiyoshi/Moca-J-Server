import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Helper to verify admin session
async function verifyAdmin(request: NextRequest) {
  const idToken = request.cookies.get('id_token')?.value;
  if (!idToken) return null;
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

// GET /api/patients - List patients with pagination and search
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const id = searchParams.get('id') || ''; // This is the sequential ID
  const searchName = searchParams.get('searchName') || '';

  try {
    let query: any = adminDb.collection('patients');

    if (id) {
      // If searching by specific ID, we likely don't need orderBy
      // This also avoids the requirement for a composite index (id, createdAt)
      query = query.where('id', '==', id);
    } else {
      query = query.orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();
    let patients = snapshot.docs.map((doc: any) => ({ uid: doc.id, ...doc.data() }));

    // Local filtering for name
    if (searchName) {
      const lowSearchName = searchName.toLowerCase();
      patients = patients.filter((p: any) => {
        const fullName = ((p.lastName || '') + (p.firstName || '')).toLowerCase();
        const fullKana = ((p.lastNameKana || '') + (p.firstNameKana || '')).toLowerCase();
        return fullName.includes(lowSearchName) || fullKana.includes(lowSearchName);
      });
    }

    const totalCount = patients.length;
    const startIndex = (page - 1) * limit;
    const paginatedPatients = patients.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      patients: paginatedPatients,
      totalCount,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/patients - Create a new patient with sequential ID and random UID
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id: manualId, ...patientData } = body;

    const counterRef = adminDb.collection('counters').doc('patients');
    const newDocRef = adminDb.collection('patients').doc(); // Auto-generate random UID

    const finalId = await adminDb.runTransaction(async (transaction) => {
      let nextIdValue = 1;
      
      // If manual ID is provided, we still need to manage the counter or just use it
      // But usually we want auto-increment.
      if (!manualId) {
        const counterDoc = await transaction.get(counterRef);
        if (counterDoc.exists) {
          nextIdValue = (counterDoc.data()?.current || 0) + 1;
        }
        transaction.set(counterRef, { current: nextIdValue }, { merge: true });
      }

      const sequentialId = manualId || nextIdValue.toString().padStart(6, '0');
      
      transaction.set(newDocRef, {
        ...patientData,
        uid: newDocRef.id,
        id: sequentialId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return sequentialId;
    });

    return NextResponse.json({ success: true, uid: newDocRef.id, id: finalId });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
