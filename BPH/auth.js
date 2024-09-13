 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
 import {getAuth,signOut, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
 const firebaseConfig = {
    apiKey: "AIzaSyBRbKqEeEFTU82OtGXOwsFIxX8QnkPsuJ8",
    authDomain: "hadibengkel-8abda.firebaseapp.com",
    databaseURL: "https://hadibengkel-8abda-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hadibengkel-8abda",
    storageBucket: "hadibengkel-8abda.appspot.com",
    messagingSenderId: "154359113405",
    appId: "1:154359113405:web:0b525db35acca2665fb9d4",
    measurementId: "G-BMLMM911YX"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth();
 const signIn=document.getElementById('submitSignIn');


 signIn?.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='admin/admin.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('Account does not Exist', 'signInMessage');
        }
    })
 })

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }

 auth.onAuthStateChanged(user => {
    if (user) {
      console.log(user.email + " is logged in!");
    } else {
      console.log('User is logged out!');
      if (window.location.pathname.includes("admin/admin.html")) {
        window.location.href = "login.html";
    }
    }
  });
