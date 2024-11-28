import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_kSB9wubXBVw5IcU8RoKtLRw1bnXtphQ",
    authDomain: "insyncweb.firebaseapp.com",
    projectId: "insyncweb",
    storageBucket: "insyncweb.firebasestorage.app",
    messagingSenderId: "456516830521",
    appId: "1:456516830521:web:0c2ff065077ccfe92a14e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();

// Google Sign-In Icon
const googleSignInIcon = document.querySelector('.fa-google-plus-g');

// Toggle form display
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => container.classList.add("active"));
loginBtn.addEventListener('click', () => container.classList.remove("active"));

// Form elements
const signUpForm = document.querySelector('.sign-up form');
const signInForm = document.querySelector('.sign-in form');
const emailInputSignUp = signUpForm.querySelector('input[type="email"]');
const passwordInputSignUp = signUpForm.querySelector('input[type="password"]');
const emailInputSignIn = signInForm.querySelector('input[type="email"]');
const passwordInputSignIn = signInForm.querySelector('input[type="password"]');

// Loading Spinner
const loadingSpinner = document.createElement('div');
loadingSpinner.classList.add('spinner');
loadingSpinner.innerHTML = '<div class="loader"></div>';  // Add your loader styles
document.body.appendChild(loadingSpinner);  // Append to the body or container

// Show and hide loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Helper function to handle errors
function handleError(error, context = "") {
    console.error(`${context} Error:`, error);
    alert(`${context} Error: ${error.message}`);
}

// Email Validation
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

// Form Validation for Sign-Up
function validateSignUp(email, password) {
    if (!email || !password) {
        alert("Email and Password cannot be empty.");
        return false;
    }
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}

// Form Validation for Sign-In
function validateSignIn(email, password) {
    if (!email || !password) {
        alert("Email and Password cannot be empty.");
        return false;
    }
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return false;
    }
    return true;
}

// Google Sign-In
googleSignInIcon.addEventListener('click', async (event) => {
    event.preventDefault();
    showLoading();
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Google sign-in successful:", user);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            alert("You are already registered. Redirecting to home...");
            window.location.href = "../landing page/home.html";
             
            
        } else {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                signUpDate: new Date(),
                provider: "Google"
            });
            
            // Store user data in Realtime Database
            await set(ref(realtimeDb, 'users/' + user.uid), {
                email: user.email,
                signUpDate: new Date().toISOString(),
                provider: "Google"
            });

            alert("Google account successfully registered! Please sign in to continue.");
            loginBtn.click();
        }
    } catch (error) {
        handleError(error, "Google sign-in");
    } finally {
        hideLoading();
    }
});

// Sign-Up event listener
signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInputSignUp.value;
    const password = passwordInputSignUp.value;

    if (!validateSignUp(email, password)) {
        return; // Prevent submitting if validation fails
    }

    showLoading();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed up:", user);

        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            signUpDate: new Date(),
        });

        // Store user data in Realtime Database
        await set(ref(realtimeDb, 'users/' + user.uid), {
            email: user.email,
            signUpDate: new Date().toISOString()
        });

        alert('Sign up successful! Automatically logged in.');

        // Log in the user automatically after sign-up
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "../landing page/home.html"; // Redirect after sign-in
        window.location.reload(); // Reload the page to reset the state
    } catch (error) {
        handleError(error, "Sign-up");
    } finally {
        hideLoading();
    }
});

// Sign-In event listener
signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInputSignIn.value;
    const password = passwordInputSignIn.value;

    if (!validateSignIn(email, password)) {
        return; // Prevent submitting if validation fails
    }

    showLoading();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Retrieve user data from Realtime Database
        const userRef = ref(realtimeDb, 'users/' + user.uid);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
            console.log('Realtime Database User data:', userSnapshot.val());
        } else {
            console.warn("No user data found in Realtime Database");
        }

        alert('Sign-in successful!');
        window.location.href = "../landing page/home.html"; // Redirect after sign-in
    } catch (error) {
        handleError(error, "Sign-in");
    } finally {
        hideLoading();
    }
});
