// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyACl_ax4pP-L974aZaxEQUMVI69rymj8O0",
    authDomain: "ongi-83270.firebaseapp.com",
    projectId: "ongi-83270",
    storageBucket: "ongi-83270.firebasestorage.app",
    messagingSenderId: "967073688567",
    appId: "1:967073688567:web:d98b3696b4bd3fec17dcf2",
    measurementId: "G-4KKTBFCCS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };