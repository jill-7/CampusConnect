import { initializeApp } from 'firebase/app';
    import { getAuth, GoogleAuthProvider } from 'firebase/auth';
    import { getFirestore} from 'firebase/firestore';

// Got these details from Firebase after creating my project

    const firebaseConfig = {
      apiKey: "AIzaSyDexNV9zSdBTUb5E7nkOkUbX8BiMaSnLF4",
      authDomain: "campusconnect-db85a.firebaseapp.com",
      projectId: "campusconnect-db85a",
      storageBucket: "campusconnect-db85a.firebasestorage.app",
      messagingSenderId: "89223338347",
      appId: "1:89223338347:web:482da2ccef32124e0ed42e",
      measurementId: "G-DJ8PXD3SXN"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);