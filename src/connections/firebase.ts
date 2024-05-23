import { config } from '../config';
import * as admin from 'firebase-admin';

const firebaseConfig = {
  type: config.FIREBASE_TYPE,
  project_id: config.FIREBASE_PROJECT_ID,
  private_key_id: config.FIREBASE_PRIVATE_KEY_ID,
  private_key: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: config.FIREBASE_CLIENT_EMAIL,
  client_id: config.FIREBASE_CLIENT_ID,
  auth_uri: config.FIREBASE_AUTH_URI,
  token_uri: config.FIREBASE_TOKEN_URI,
  auth_provider_X509_cert_url: config.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: config.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
  storageBucket: `${config.FIREBASE_PROJECT_ID}.appspot.com`
});

export const firebaseAdmin = admin;
