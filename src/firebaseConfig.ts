import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64!, 'base64').toString());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
