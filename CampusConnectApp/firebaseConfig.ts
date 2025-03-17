// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
    import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDexNV9zSdBTUb5E7nkOkUbX8BiMaSnLF4",
      authDomain: "campusconnect-db85a.firebaseapp.com",
      projectId: "campusconnect-db85a",
      storageBucket: "campusconnect-db85a.firebasestorage.app",
      messagingSenderId: "89223338347",
      appId: "1:89223338347:web:482da2ccef32124e0ed42e",
      measurementId: "G-DJ8PXD3SXN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();