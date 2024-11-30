import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_kSB9wubXBVw5IcU8RoKtLRw1bnXtphQ",
    authDomain: "insyncweb.firebaseapp.com",
    projectId: "insyncweb",
    storageBucket: "insyncweb.firebasestorage.app",
    databaseURL: "https://insyncweb-default-rtdb.firebaseio.com",
    messagingSenderId: "456516830521",
    appId: "1:456516830521:web:0c2ff065077ccfe92a14e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app);
const auth = getAuth(app);

// Check authentication status
function checkAuthentication() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.replace('../login page/index.html');
        return false;
    }
    return true;
}

// Prevent back button and enforce authentication
function setupSecurityMeasures() {
    // Handle back button with confirmation dialog
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        if (confirm('Are you sure you want to go back to login page?')) {
            window.location.replace('../login page/index.html');
        } else {
            history.pushState(null, null, location.href);
        }
    };

    // Check authentication on page load
    if (!checkAuthentication()) return;

    // Continuously check authentication
    setInterval(checkAuthentication, 5000);
}

// Prevent going back to login page
// window.location.hash="no-back-button";
// window.onhashchange=function(){window.location.hash="no-back-button";}

const next = document.querySelector("#next");
const infoSliders = document.querySelectorAll('.info-slider');
const imgSliders = document.querySelectorAll('.img-slider');
const items = document.querySelectorAll('.item');
const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close");
const dashboardButton = document.getElementById("dashboard");
const modal1 = document.getElementById("modal1");
const close1Button = document.querySelector(".close1");
const userButton = document.getElementById("user information");
const menuButtons = document.querySelectorAll('.menu li');

const fanSwitch = document.querySelector('.fan-switch input');    // Fan toggle button
const speakerSwitch = document.querySelector('.speaker-switch input'); // Speaker toggle button
const thermometerSwitch = document.querySelector('.thermometer-switch input');  // Thermometer toggle button

let index = 0;
let lastHighlightedButton = null; // Variable to track the last highlighted button

// Function to highlight the clicked button and set its color to match the circle background
function highlightButton(button) {
    const circleBg = items[index].querySelector('.circle-bg');
    const computedStyle = getComputedStyle(circleBg);

    // Reset all buttons to default
    menuButtons.forEach((li) => {
        li.classList.remove('highlight');
        li.style.backgroundColor = ""; // Reset to default color
        li.style.color = ""; // Reset text color to default
    });

    // Highlight the clicked button and set its background color
    button.classList.add('highlight');
    button.style.backgroundColor = computedStyle.backgroundColor; // Set the highlight color
    button.style.color = "#fff"; // Change text color if needed

    // Store the last highlighted button
    lastHighlightedButton = button;

    // Set the next button color to match the circle background
    next.style.backgroundColor = computedStyle.backgroundColor; // Match next button color to circle background
}

// Function to reset the next button color
function resetNextButtonColor() {
    next.style.backgroundColor = "transparent"; // Reset to transparent
}

// Next button click event
if (next) {
    next.addEventListener("click", () => {
        index++;
        if (index >= infoSliders.length) {
            index = 0; // Loop back to the first item
        }
        updateCarousel();

        // Remove highlights from all menu buttons when next is clicked
        menuButtons.forEach((li) => {
            li.classList.remove('highlight');
            li.style.backgroundColor = ""; // Reset background color
            li.style.color = ""; // Reset text color
        });

        // Set the next button color to match the circle background
        const circleBg = items[index].querySelector('.circle-bg');
        const computedStyle = getComputedStyle(circleBg);
        next.style.backgroundColor = computedStyle.backgroundColor; // Match next button color to circle background
    });
}

// Dashboard button click event
if (dashboardButton) {
    dashboardButton.addEventListener("click", () => {
        if (modal.style.display === "block") {
            modal.style.display = "none"; // Hide modal
            dashboardButton.classList.remove("highlight"); // Remove highlight
            dashboardButton.style.backgroundColor = ""; // Reset background color
            dashboardButton.style.color = ""; // Reset text color
        } else {
            modal.style.display = "block"; // Show modal
            modal1.style.display = "none"; // Hide other modal
            highlightButton(dashboardButton);
            resetNextButtonColor();
        }
    });
}

// User information button click event
if (userButton) {
    userButton.addEventListener("click", () => {
        if (modal1.style.display === "block") {
            modal1.style.display = "none";
            userButton.classList.remove('highlight');
            userButton.style.backgroundColor = "";
            userButton.style.color = "";
        } else {
            modal1.style.display = "block";
            modal.style.display = "none";
            highlightButton(userButton);
            resetNextButtonColor();
        }
    });
}

// Close buttons for modals
if (closeButton) {
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
        // Remove highlight from the last highlighted button
        if (lastHighlightedButton) {
            lastHighlightedButton.classList.remove('highlight');
            lastHighlightedButton.style.backgroundColor = ""; // Reset background color
            lastHighlightedButton.style.color = ""; // Reset text color
            lastHighlightedButton = null; // Clear the highlighted button
        }

        // Set the next button color to match the circle background of the currently active item
        const circleBg = items[index].querySelector('.circle-bg');
        const computedStyle = getComputedStyle(circleBg);
        next.style.backgroundColor = computedStyle.backgroundColor; // Set next button color
    });
}

if (close1Button) {
    close1Button.addEventListener("click", () => {
        modal1.style.display = "none";
        // Remove highlight from the last highlighted button
        if (lastHighlightedButton) {
            lastHighlightedButton.classList.remove('highlight');
            lastHighlightedButton.style.backgroundColor = ""; // Reset background color
            lastHighlightedButton.style.color = ""; // Reset text color
            lastHighlightedButton = null; // Clear the highlighted button
        }

        // Set the next button color to match the circle background of the currently active item
        const circleBg = items[index].querySelector('.circle-bg');
        const computedStyle = getComputedStyle(circleBg);
        next.style.backgroundColor = computedStyle.backgroundColor; // Set next button color
    });
}

// Update carousel function
function updateCarousel() {
    infoSliders.forEach((slide) => {
        slide.style.transform = `translateY(${index * -100}%)`;
    });
    imgSliders.forEach((slide) => {
        slide.style.transform = `translateX(${index * -100}%)`;
    });
    
    // Update active class
    document.querySelector('.item.active').classList.remove('active');
    items[index].classList.add('active');

    // Change the color of the "next" button based on the active circle background
    const circleBg = items[index].querySelector('.circle-bg');
    const computedStyle = getComputedStyle(circleBg);
    const activeColor = computedStyle.backgroundColor; // This is the color of the active circle background
    
    // Update the color of the "next" button
    next.style.backgroundColor = activeColor;

    // Update the color of all the dashboard containers
    document.querySelectorAll('.small-box, .large-box, .large-box-1, .large-box-2').forEach(box => {
        box.style.backgroundColor = activeColor; // Apply the color of the circleBg to each box
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Setup security first
    setupSecurityMeasures();

    // Function to update the date and time
    function updateDateTime() {
        console.log('Attempting to update dateTime element...');
        const dateTimeElement = document.getElementById('dateTime');
        if (dateTimeElement) {
            console.log('dateTime element found:', dateTimeElement);
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString('en-US', options);
            const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            const dateTime = `${formattedDate}  |  ${formattedTime}`;
            dateTimeElement.textContent = dateTime;
            console.log('Date and Time Updated:', dateTime);
        } else {
            console.error('dateTime element not found!');
        }
    }

    // Ensure the page is fully loaded before starting the time update
    updateDateTime(); // Initialize date and time immediately on page load
    setInterval(updateDateTime, 1000); // Update every second

    // Ensure the modal is hidden on page load
    if (modal) {
        console.log("Modal element:", modal); // Log the modal element
        console.log("Modal computed style:", getComputedStyle(modal).display); // Log computed display style
        modal.style.display = "none";
    }
    if (modal1) {
        modal1.style.display = "none";
    }

    // Add event listeners to all menu buttons
    menuButtons.forEach((button) => {
        if (button) {
            button.addEventListener("click", () => {
                if (button !== next) { // Check if the clicked button is not "next"
                    highlightButton(button); // Highlight the clicked button
                    resetNextButtonColor(); // Ensure next button is reset when another button is clicked
                }
            });
        }
    });

    // Get the lamp switch element
    const lampSwitch = document.querySelector('.lamp-switch input');
    console.log('Lamp switch element:', lampSwitch);  // Debug log

    if (lampSwitch) {
        console.log('Adding event listener to lamp switch');  // Debug log
        lampSwitch.addEventListener("change", function(e) {
            console.log("Switch clicked");
            const isOn = e.target.checked;
            console.log("Switch state:", isOn);
            
            const dbRef = ref(realtimeDb, 'devices/lamp');
            set(dbRef, isOn ? 1 : 0)
                .then(() => {
                    console.log("Firebase updated successfully with value:", isOn ? 1 : 0);
                    const lampLabel = lampSwitch.closest('.lamp-switch').querySelector('.label');
                    if (lampLabel) {
                        lampLabel.textContent = isOn ? "ON" : "OFF";
                    }
                })
                .catch((error) => {
                    console.error("Firebase update failed:", error);
                    e.target.checked = !isOn;
                });
        });
    } else {
        console.error("Lamp switch element not found in DOM!");
    }

    if (fanSwitch) {
        console.log('Adding event listener to fan switch');
        fanSwitch.addEventListener("change", function(e) {
            console.log("Fan switch clicked");
            const isOn = e.target.checked;
            console.log("Fan switch state:", isOn);
            
            const dbRef = ref(realtimeDb, 'devices/fan');
            set(dbRef, isOn ? 1 : 0)
                .then(() => {
                    console.log("Firebase updated successfully with value:", isOn ? 1 : 0);
                    const fanLabel = fanSwitch.closest('.fan-switch').querySelector('.label');
                    if (fanLabel) {
                        fanLabel.textContent = isOn ? "ON" : "OFF";
                    }
                })
                .catch((error) => {
                    console.error("Firebase update failed:", error);
                    e.target.checked = !isOn;
                });
        });
    } else {
        console.error("Fan switch element not found in DOM!");
    }

    if (speakerSwitch) {
        console.log('Adding event listener to speaker switch');
        speakerSwitch.addEventListener("change", function(e) {
            console.log("Speaker switch clicked");
            const isOn = e.target.checked;
            console.log("Speaker switch state:", isOn);
            
            const dbRef = ref(realtimeDb, 'devices/speaker');
            set(dbRef, isOn ? 1 : 0)
                .then(() => {
                    console.log("Firebase updated successfully with value:", isOn ? 1 : 0);
                    const speakerLabel = speakerSwitch.closest('.speaker-switch').querySelector('.label');
                    if (speakerLabel) {
                        speakerLabel.textContent = isOn ? "ON" : "OFF";
                    }
                })
                .catch((error) => {
                    console.error("Firebase update failed:", error);
                    e.target.checked = !isOn;
                });
        });
    } else {
        console.error("Speaker switch element not found in DOM!");
    }

    if (thermometerSwitch) {
        console.log('Adding event listener to thermometer switch');
        thermometerSwitch.addEventListener("change", function(e) {
            console.log("Thermometer switch clicked");
            const isOn = e.target.checked;
            console.log("Thermometer switch state:", isOn);
            
            const dbRef = ref(realtimeDb, 'devices/thermometer');
            set(dbRef, isOn ? 1 : 0)
                .then(() => {
                    console.log("Firebase updated successfully with value:", isOn ? 1 : 0);
                    const thermometerLabel = thermometerSwitch.closest('.thermometer-switch').querySelector('.label');
                    if (thermometerLabel) {
                        thermometerLabel.textContent = isOn ? "ON" : "OFF";
                    }
                })
                .catch((error) => {
                    console.error("Firebase update failed:", error);
                    e.target.checked = !isOn;
                });
        });
    } else {
        console.error("Thermometer switch element not found in DOM!");
    }

    // Show the modal when dashboard button is clicked
    if (dashboardButton) {
        dashboardButton.addEventListener("click", () => {
            modal.style.display = "block"; // Show modal
        });
    }

    // Close the modal when the close button is clicked
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            modal.style.display = "none"; // Hide modal
        });
    }

    // Check authentication state on page load and when it changes
    function checkAuth() {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                // No user is signed in, redirect to login page
                window.location.href = '../login page/index.html';
            }
        });
    }

    // Prevent going back to this page after logout
    window.onpopstate = function() {
        window.history.pushState(null, null, window.location.href);
        checkAuth();
    };

    // Initialize auth check
    checkAuth();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                // Clear any stored credentials
                sessionStorage.clear();
                localStorage.clear();
                
                // Disable back button functionality
                window.history.forward();
                window.onpopstate = function(event) {
                    window.history.forward();
                };
                
                // Redirect to login page
                window.location.replace('../login page/index.html');
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    }
});
