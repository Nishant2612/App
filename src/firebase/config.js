// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration with fallback
let firebaseConfig;
let app = null;
let database = null;

try {
  // Try to use environment variables first, then fallback to placeholder
  firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com", 
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://demo-project-default-rtdb.firebaseio.com/",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project-id",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
  };

  // Only initialize Firebase if we have real config (not demo values)
  const hasRealConfig = !firebaseConfig.apiKey.includes('demo') && 
                       !firebaseConfig.authDomain.includes('demo');
  
  if (hasRealConfig) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase not configured, using local storage fallback');
  }
} catch (error) {
  console.warn('Firebase initialization failed, using local storage fallback:', error);
}

export { database };

export default app;
