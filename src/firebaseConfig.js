// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHnP28s-j_AMdCgKA4-r4tYZsCBdWZMD8",
  authDomain: "nuper-9dafb.firebaseapp.com",
  projectId: "nuper-9dafb",
  storageBucket: "nuper-9dafb.firebasestorage.app",
  messagingSenderId: "394837137351",
  appId: "1:394837137351:web:b0d700344f8c99d89a2be2",
  measurementId: "G-R3WJYM70W3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 

// Uygulamanın diğer yerlerinde kullanabilmek için 'app' ve 'analytics' objelerini dışa aktarın
export { app, analytics }; // <-- Hem app hem de analytics dışa aktarıldı