import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // Para autenticação
import { getDatabase } from "firebase/database"; // Para banco de dados, se necessário

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzetmE4i_GfGXsCZp8bIlyXHbHhvp0H2Y",
  authDomain: "projeto-final-44901.firebaseapp.com",
  databaseURL: "https://projeto-final-44901-default-rtdb.firebaseio.com/",
  projectId: "projeto-final-44901",
  storageBucket: "projeto-final-44901.appspot.com",
  messagingSenderId: "686987806337",
  appId: "1:686987806337:web:790dc26f02124a22ac2f80",
  measurementId: "G-L3DHKK7G8Q"
};

// Verificar se o Firebase já foi inicializado, se não, inicialize-o
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };



