import firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBXRFw42iTI4jTdePvFVTDVbtb2jzVVzx0",
  authDomain: "ecommerce-b480a.firebaseapp.com",
  projectId: "ecommerce-b480a",
  storageBucket: "ecommerce-b480a.appspot.com",
  messagingSenderId: "846618762560",
  appId: "1:846618762560:web:08d6adb89c38407cce2ea5",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
