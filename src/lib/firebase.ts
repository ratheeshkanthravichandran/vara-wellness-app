'use client';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-8677815439-8aa94',
  appId: '1:755457562909:web:8172e5fe3d280f0d7e69f4',
  apiKey: 'AIzaSyCf5_v2Dlrwb2Z0zNRrWUwZWw-c3Pllom4',
  authDomain: 'studio-8677815439-8aa94.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '755457562909',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
