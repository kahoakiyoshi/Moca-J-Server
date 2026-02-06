import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/public/patients/[id]
 * Public API to fetch patient information by sequential ID
 * No authentication required
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const snapshot = await adminDb.collection('patients')
      .where('id', '==', id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(null, { status: 200 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return NextResponse.json({
      uid: doc.id,
      ...data
    });
  } catch (error: any) {
    console.error('Public patient API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
