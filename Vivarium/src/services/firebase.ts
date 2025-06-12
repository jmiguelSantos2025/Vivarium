import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // Para autenticação
import { getDatabase } from "firebase/database"; // Para banco de dados, se necessário

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApFkT0Tnr2r6aj4pIrwF5-B1Y4CK7w5bk",
  authDomain: "greendrop-f9fae.firebaseapp.com",
  databaseURL: "https://greendrop-f9fae-default-rtdb.firebaseio.com",
  projectId: "greendrop-f9fae",
  storageBucket: "greendrop-f9fae.firebasestorage.app",
  messagingSenderId: "897300232879",
  appId: "1:897300232879:web:c43e905f606c08e61ff25a"
};

// Verificar se o Firebase já foi inicializado, se não, inicialize-o
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };



