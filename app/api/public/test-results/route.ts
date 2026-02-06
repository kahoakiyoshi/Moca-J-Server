import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

/**
 * POST /api/public/test-results
 * Public API to save test results
 * No authentication required
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, score, duration, result, ...otherData } = body;

    if (!patientId) {
      return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const newResult = {
      patientId,
      score: score || 0,
      approved: false,
      duration: duration || "00:00:00",
      result: result || {},
      ...otherData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('test_results').add(newResult);

    return NextResponse.json({ 
      success: true, 
      uid: docRef.id,
      ...newResult
    });
  } catch (error: any) {
    console.error('Public save test result API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
