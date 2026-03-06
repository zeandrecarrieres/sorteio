// ============================================================
// FIREBASE CONFIGURATION
// Preencha com as credenciais do seu projeto Firebase Console
// https://console.firebase.google.com → Configurações do projeto
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCq5PGMt-WHOnkTdya-3QQAxFdZMi62vY0",
  authDomain: "sorteio-7811b.firebaseapp.com",
  projectId: "sorteio-7811b",
  storageBucket: "sorteio-7811b.firebasestorage.app",
  messagingSenderId: "668448521844",
  appId: "1:668448521844:web:adbb14fdc3d505c501db21"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
