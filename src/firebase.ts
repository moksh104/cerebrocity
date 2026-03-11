import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBiF4BdTYSvZCYA3D9YdThfy6rvCRFYto",
  authDomain: "cerebrocity-58f72.firebaseapp.com",
  projectId: "cerebrocity-58f72",
  storageBucket: "cerebrocity-58f72.appspot.com",
  messagingSenderId: "824220460943",
  appId: "1:824220460943:web:fbd4ceb42fc68ab5c3cdfa"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
