import admin from 'firebase-admin';
import serviceAccount from './config/serviceAccountKey/serviceAccountKey.json' assert { type: 'json' }; 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://airbnb-4f322-default-rtdb.firebaseio.com', 
});

const database = admin.database();

export { admin, database };
