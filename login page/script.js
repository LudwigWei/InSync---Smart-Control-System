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

// Clear any existing session on login page load
sessionStorage.clear();

// Prevent back navigation
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.pushState(null, null, location.href);
};

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

// Notification System
const notification = document.getElementById('notification');
const notificationMessage = notification.querySelector('.notification-message');
const notificationClose = notification.querySelector('.notification-close');

function showNotification(message, type) {
    console.log('Showing notification:', message, type); // Debug log
    if (!notification || !notificationMessage) {
        console.error('Notification elements not found!');
        return;
    }
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(hideNotification, 3000);
}

function hideNotification() {
    if (notification) {
        notification.style.display = 'none';
    }
}

// Add event listener for close button
if (notificationClose) {
    notificationClose.addEventListener('click', hideNotification);
}

// Helper function to handle errors
function handleError(error, context = "") {
    console.error(`${context} Error:`, error);
    showNotification(`${context} Error: ${error.message}`, 'error');
}

// Email Validation
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
}

// Form Validation for Sign-Up
function validateSignUp(email, password) {
    if (!email || !password) {
        showNotification("Email and Password cannot be empty.", 'error');
        return false;
    }
    if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", 'error');
        return false;
    }
    return true;
}

// Form Validation for Sign-In
function validateSignIn(email, password) {
    if (!email || !password) {
        showNotification("Email and Password cannot be empty.", 'error');
        return false;
    }
    if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address.", 'error');
        return false;
    }
    return true;
}

// Delay function using Promise
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to handle successful login
async function handleSuccessfulLogin(user) {
    try {
        // Set session storage
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', user.email);
        
        // Show success message
        showNotification('Login successful! Redirecting...', 'success');
        await delay(1000);
        
        // Redirect to home page
        window.location.replace('../landing page/home.html');
    } catch (error) {
        handleError(error, 'Login success handler');
    }
}

// Sign in with email/password
signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showLoading();

    const email = emailInputSignIn.value;
    const password = passwordInputSignIn.value;

    try {
        if (validateSignIn(email, password)) {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleSuccessfulLogin(userCredential.user);
        }
    } catch (error) {
        handleError(error, 'Sign in');
    } finally {
        hideLoading();
    }
});

// Google Sign-In
googleSignInIcon.addEventListener('click', async (event) => {
    event.preventDefault();
    showLoading();

    try {
        const result = await signInWithPopup(auth, googleProvider);
        await handleSuccessfulLogin(result.user);
    } catch (error) {
        handleError(error, 'Google sign in');
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
            email: email,
            signUpDate: new Date().toISOString()
        });

        // Store user data in Realtime Database
        await set(ref(realtimeDb, 'users/' + user.uid), {
            email: user.email,
            signUpDate: new Date().toISOString()
        });

        hideLoading();
        await handleSuccessfulLogin('Sign up successful! Automatically logged in.');

        // Log in the user automatically after sign-up
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        hideLoading();
        handleError(error, "Sign-up");
    }
});
