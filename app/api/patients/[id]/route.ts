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

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/patients/[id] - Get a single patient by UID
export async function GET(request: NextRequest, { params }: Params) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: uid } = await params;

  try {
    const doc = await adminDb.collection('patients').doc(uid).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json({ uid: doc.id, ...doc.data() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/patients/[id] - Update a patient by UID
export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: uid } = await params;

  try {
    const body = await request.json();
    const { id: sequentialId, ...updateData } = body;
    
    await adminDb.collection('patients').doc(uid).update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/patients/[id] - Delete a patient by UID
export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: uid } = await params;

  try {
    await adminDb.collection('patients').doc(uid).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
