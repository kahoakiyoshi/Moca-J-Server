import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { adminStorage } from '@/lib/firebase-admin';
import { put } from '@vercel/blob';

/**
 * CONFIGURATION: CHANGE THIS TO SWITCH BETWEEN UPLOAD MODES
 * 'local'        -> Save to public/uploads/audios on the server (Local development only)
 * 'firebase'     -> Save to Firebase Storage (Requires Firebase setup)
 * 'vercel-blob'  -> Save to Vercel Blob (Requires BLOB_READ_WRITE_TOKEN env var on Vercel)
 */
const UPLOAD_MODE: 'local' | 'firebase' | 'vercel-blob' = 'vercel-blob'; 

/**
 * POST /api/public/upload-audio
 * Public API to upload audio files. Supports Local, Firebase, and Vercel Blob.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${crypto.randomUUID()}_${file.name}`;

    if (UPLOAD_MODE === 'vercel-blob') {
      // --- MODE 3: VERCEL BLOB ---
      const blob = await put(`audios/${fileName}`, buffer, {
        access: 'public',
        contentType: file.type || 'audio/m4a',
      });
      
      return createResponse({ 
        success: true, 
        url: blob.url, 
        path: blob.url, 
        mode: 'vercel-blob' 
      });

    } else if (UPLOAD_MODE === 'firebase') {
      // --- MODE 1: FIREBASE STORAGE ---
      const bucket = adminStorage.bucket();
      const storageFile = bucket.file(`audios/${fileName}`);

      await storageFile.save(buffer, {
        metadata: { contentType: file.type || 'audio/m4a' },
      });

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(`audios/${fileName}`)}?alt=media`;
      
      return createResponse({ 
        success: true, 
        url: publicUrl, 
        path: `audios/${fileName}`, 
        mode: 'firebase' 
      });

    } else {
      // --- MODE 2: LOCAL FILESYSTEM ---
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audios');
      const filePath = path.join(uploadDir, fileName);

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err: any) {
        if (err.code !== 'EEXIST') throw err;
      }

      await writeFile(filePath, buffer);
      const relativePath = `/uploads/audios/${fileName}`;

      return createResponse({ 
        success: true, 
        url: relativePath, 
        path: relativePath, 
        mode: 'local' 
      });
    }

  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}

// Helper to create response with CORS headers
function createResponse(data: any) {
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
