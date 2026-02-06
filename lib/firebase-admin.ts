import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  if (!firebaseAdminConfig.projectId || !firebaseAdminConfig.clientEmail || !firebaseAdminConfig.privateKey) {
    console.warn(
      'Firebase Admin SDK: Missing environment variables. Firebase Admin features will not work.'
    );
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig),
        databaseURL: `https://${firebaseAdminConfig.projectId}.firebaseio.com`,
      });
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
    }
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null!;
export const adminAuth = admin.apps.length ? admin.auth() : null!;
export default admin;
