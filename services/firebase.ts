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
  if (!db) {
    throw new Error("Firestore não foi inicializado corretamente.");
  }

  try {
    console.log("Tentando enviar dados para o Firestore:", JSON.stringify(data, null, 2));
    const docRef = await addDoc(collection(db, "nps_responses"), {
      ...data,
      submittedAt: serverTimestamp(),
      platform: 'web-app',
      userAgent: navigator.userAgent
    });
    console.log("Documento gravado com ID: ", docRef.id);
  } catch (error) {
    console.error("Erro DETALHADO ao salvar documento: ", error);
    if (error instanceof Error) {
      console.error("Mensagem: ", error.message);
      console.error("Stack: ", error.stack);
    }
    throw error;
  }
};

export const getAllResponses = async (): Promise<SurveyResponse[]> => {
  if (!db) return [];

  try {
    const q = query(collection(db, "nps_responses"), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Handle legacy data structure where fields were flat
      // If 'evaluations' doesn't exist but 'professor' does, migrate it on the fly for display
      let evaluations = data.evaluations || [];
      if (evaluations.length === 0 && data.professor) {
        evaluations = [{
          professor: data.professor,
          toneRespect: data.toneRespect,
          professionalPosture: data.professionalPosture,
          attention: data.attention,
          correctionQuality: data.correctionQuality,
          didactic: data.didactic,
          adaptation: data.adaptation
        }];
      }

      return {
        id: doc.id,
        ...data,
        evaluations
      };
    }) as SurveyResponse[];
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    throw error;
  }
};