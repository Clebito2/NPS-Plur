import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Reuse the same config
const firebaseConfig = {
    apiKey: "AIzaSyA2UbRB-ErydRax0rYRTdpDhCcFF-K04sc",
    authDomain: "pesquisa-plur.firebaseapp.com",
    projectId: "pesquisa-plur",
    storageBucket: "pesquisa-plur.firebasestorage.app",
    messagingSenderId: "273157751553",
    appId: "1:273157751553:web:0651691794656dc12ad100"
};

// Initialize Firebase (Singleton pattern for reuse in hot functions)
let app;
let db: any;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} else {
    app = getApps()[0];
    db = getFirestore(app);
}

export const handler = async (event: any) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);

        console.log("Receiving survey submission:", JSON.stringify(data, null, 2));

        // Sanitize data -> remove undefined values recursively or just rely on JSON.parse/stringify cleanup (JSON doesn't support undefined)
        // Since we parsed from JSON, undefined is already gone or null.

        // Add server-side timestamp and metadata
        const payload = {
            ...data,
            submittedAt: serverTimestamp(),
            platform: 'web-app-server-side',
            userAgent: event.headers['user-agent'] || 'unknown',
            ip: event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown'
        };

        const docRef = await addDoc(collection(db, "nps_responses"), payload);

        console.log("Document written with ID: ", docRef.id);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, id: docRef.id })
        };

    } catch (error: any) {
        console.error("Error submitting survey:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Internal Server Error' })
        };
    }
};
