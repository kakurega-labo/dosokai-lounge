//js/firebase-config.js

const firebaseConfig = {
  apiKey: "__FIREBASE_API_KEY__",
  authDomain: "dosokai-kissa.firebaseapp.com",
  databaseURL: "https://dosokai-kissa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dosokai-kissa",
  storageBucket: "dosokai-kissa.firebasestorage.app",
  messagingSenderId: "165188890725",
  appId: "1:165188890725:web:b39e15c9798dc9fcef168c"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const db = firebase.firestore();
