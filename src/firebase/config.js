// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase config - Replace with your actual config
// Get this from Firebase Console -> Project Settings -> General -> Your apps -> Firebase SDK snippet
const firebaseConfig = {
  // Replace these with your actual Firebase config values
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
