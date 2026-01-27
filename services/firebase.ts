import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, Firestore } from 'firebase/firestore';
import { SurveyData, SurveyResponse } from '../types';

// Configuração do Firebase para o projeto 'pesquisa-plur'
const firebaseConfig = {
  apiKey: "AIzaSyA2UbRB-ErydRax0rYRTdpDhCcFF-K04sc",
  authDomain: "pesquisa-plur.firebaseapp.com",
  projectId: "pesquisa-plur",
  storageBucket: "pesquisa-plur.firebasestorage.app",
  messagingSenderId: "273157751553",
  appId: "1:273157751553:web:0651691794656dc12ad100"
};

// Inicialização do Firebase e Firestore
let app: FirebaseApp;
let db: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} catch (error) {
  console.error("Erro CRÍTICO na inicialização do Firebase:", error);
}

export const submitSurvey = async (data: SurveyData): Promise<void> => {
  try {
    console.log("Tentando enviar dados via Netlify Functions:", JSON.stringify(data, null, 2));

    // Use relative path for the function
    const response = await fetch('/.netlify/functions/submit-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `Erro HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch (e) {
        // Could not parse JSON, likely an HTML 404 or 500 page
        const text = await response.text();
        console.error("Non-JSON error response:", text.slice(0, 200)); // Log first 200 chars
        if (response.status === 404) errorMessage = "Serviço de envio não encontrado (404)";
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("Enviado com sucesso via servidor!", result);

  } catch (error) {
    console.error("Erro DETALHADO ao enviar via função: ", error);
    if (error instanceof Error) {
      console.error("Mensagem: ", error.message);
      console.error("Stack: ", error.stack);
    }
    throw error;
  }
};

export const getAllResponses = async (): Promise<SurveyResponse[]> => {
  try {
    console.log("Buscando respostas via servidor...");
    const response = await fetch('/.netlify/functions/get-responses');

    if (!response.ok) {
      let errorMessage = `Erro HTTP: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMessage = errorData.error;
      } catch (e) {
        const text = await response.text();
        console.error("Non-JSON error response from get-responses:", text.slice(0, 200));
        if (response.status === 404) errorMessage = "Serviço de consulta não encontrado (404)";
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`Carregadas ${data.length} respostas.`);
    return data as SurveyResponse[];
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    throw error;
  }
};