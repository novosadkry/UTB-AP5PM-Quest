import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBXbUTVobj-R_48WbnI3OoGzP_S7PuLs8c",
  authDomain: "utb-ap5pm-quest.firebaseapp.com",
  projectId: "utb-ap5pm-quest",
  storageBucket: "utb-ap5pm-quest.firebasestorage.app",
  messagingSenderId: "672556110870",
  appId: "1:672556110870:web:838194c6a9490237891137"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const initializeFirebase = () => {};
