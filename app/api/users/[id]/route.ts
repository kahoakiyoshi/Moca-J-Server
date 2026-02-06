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

// GET /api/users/[id] - Get a single user info by UID
export async function GET(request: NextRequest, { params }: Params) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: uid } = await params;

  try {
    const doc = await adminDb.collection('users').doc(uid).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ uid: doc.id, ...doc.data() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete a user by UID
export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: uid } = await params;

  try {
    // Delete from Firestore
    await adminDb.collection('users').doc(uid).delete();
    
    // Optional: Delete from Firebase Auth if required
    // await adminAuth.deleteUser(uid);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
