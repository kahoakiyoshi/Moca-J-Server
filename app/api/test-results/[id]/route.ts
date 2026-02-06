import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

// Helper to verify auth
async function verifySession(request: NextRequest) {
  const idToken = request.cookies.get('id_token')?.value;
  if (!idToken) return null;
  try {
    return await adminAuth.verifyIdToken(idToken);
  } catch (error) {
    return null;
  }
}

// GET /api/test-results/[id] - Get test result details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  console.log('Fetching test result detail for ID:', id);

  try {
    const doc = await adminDb.collection('test_results').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Test result not found' }, { status: 404 });
    }

    const testResult = {
      uid: doc.id,
      ...doc.data()
    } as any;

    // Optionally fetch patient data if needed for the UI
    const patientId = testResult.patientId;
    let patientData = null;
    if (patientId) {
       const patientSnapshot = await adminDb.collection('patients')
         .where('id', '==', patientId)
         .limit(1)
         .get();
       
       if (!patientSnapshot.empty) {
         patientData = {
           uid: patientSnapshot.docs[0].id,
           ...patientSnapshot.docs[0].data()
         };
       }
    }

    return NextResponse.json({ 
      testResult,
      patient: patientData
    });
  } catch (error: any) {
    console.error('Error fetching test result detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/test-results/[id] - Update test result (e.g., approval)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await request.json();
    const { approved, score } = body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (approved !== undefined) updateData.approved = approved;
    if (score !== undefined) updateData.score = score;

    await adminDb.collection('test_results').doc(id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating test result:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
