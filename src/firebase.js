// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa para Authentication
import { getFirestore } from "firebase/firestore"; // Importa para Firestore (si lo usas)
// import { getAnalytics } from "firebase/analytics"; // Importa para Analytics (si lo usas)

// Tu configuración de la app web de Firebase (¡tuya real!)
const firebaseConfig = {
  apiKey: "AIzaSyDonv2Y9KTpa95zlFhTL7qiR7yPGPyIfqw",
  authDomain: "charai-ce85b.firebaseapp.com",
  projectId: "charai-ce85b",
  storageBucket: "charai-ce85b.firebasestorage.app",
  messagingSenderId: "56105974281",
  appId: "1:56105974281:web:a524b01ebb4dd1d38056d8",
  measurementId: "G-9B56HDCGX0" // Solo si tienes Analytics
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias de los servicios de Firebase para que puedas importarlos en tus componentes
export const auth = getAuth(app);
export const db = getFirestore(app); // Solo si usas Firestore
// export const analytics = getAnalytics(app); // Solo si usas Analytics
