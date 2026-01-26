import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
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
// Verifica se já existe uma instância para evitar erro de inicialização duplicada
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export const submitSurvey = async (data: SurveyData): Promise<void> => {
  try {
    await addDoc(collection(db, "nps_responses"), {
      ...data,
      submittedAt: serverTimestamp(),
      platform: 'web-app',
      userAgent: navigator.userAgent // Coleta qual dispositivo foi usado
    });
  } catch (error) {
    console.error("Erro ao salvar documento: ", error);
    throw error;
  }
};

export const getAllResponses = async (): Promise<SurveyResponse[]> => {
  try {
    const q = query(collection(db, "nps_responses"), orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SurveyResponse[];
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    throw error;
  }
};