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

const lampSwitch = document.querySelector('.lamp-switch input');  // Lamp toggle button
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
        console.log("Dashboard button clicked"); // Log click event
        console.log("Current modal display:", modal.style.display); // Log current modal display state
        if (modal.style.display === "block") {
            modal.style.display = "none"; // Hide modal
            console.log("Hiding modal"); // Log hiding action
            dashboardButton.classList.remove("highlight"); // Remove highlight
            dashboardButton.style.backgroundColor = ""; // Reset background color
            dashboardButton.style.color = ""; // Reset text color
        } else {
            modal.style.display = "block"; // Show modal
            console.log("Showing modal"); // Log showing action
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

    // Event listeners for the on/off toggle switches
    if (lampSwitch) {
        lampSwitch.addEventListener("change", (e) => {
            const lampLabel = lampSwitch.closest('.lamp-switch').querySelector('.label'); // Find label in lamp-switch container
            if (e.target.checked) {
                console.log("Smart Lamp ON");
                lampLabel.textContent = "Lamp: ON"; // Update label to show it's ON
                lampSwitch.closest('.lamp-switch').style.backgroundColor = "#00ff00"; // Green background for ON state
            } else {
                console.log("Smart Lamp OFF");
                lampLabel.textContent = "Lamp: OFF"; // Update label to show it's OFF
                lampSwitch.closest('.lamp-switch').style.backgroundColor = "#ff0000"; // Red background for OFF state
            }
        });
    }

    if (fanSwitch) {
        fanSwitch.addEventListener("change", (e) => {
            const fanLabel = fanSwitch.closest('.fan-switch').querySelector('.label'); // Find label in fan-switch container
            if (e.target.checked) {
                console.log("Smart Fan ON");
                fanLabel.textContent = "Fan: ON"; // Update label to show it's ON
                fanSwitch.closest('.fan-switch').style.backgroundColor = "#00ff00"; // Green background for ON state
            } else {
                console.log("Smart Fan OFF");
                fanLabel.textContent = "Fan: OFF"; // Update label to show it's OFF
                fanSwitch.closest('.fan-switch').style.backgroundColor = "#ff0000"; // Red background for OFF state
            }
        });
    }

    if (speakerSwitch) {
        speakerSwitch.addEventListener("change", (e) => {
            const speakerLabel = speakerSwitch.closest('.speaker-switch').querySelector('.label'); // Find label in speaker-switch container
            if (e.target.checked) {
                console.log("Smart Speaker ON");
                speakerLabel.textContent = "Speaker: ON"; // Update label to show it's ON
                speakerSwitch.closest('.speaker-switch').style.backgroundColor = "#00ff00"; // Green background for ON state
            } else {
                console.log("Smart Speaker OFF");
                speakerLabel.textContent = "Speaker: OFF"; // Update label to show it's OFF
                speakerSwitch.closest('.speaker-switch').style.backgroundColor = "#ff0000"; // Red background for OFF state
            }
        });
    }

    if (thermometerSwitch) {
        thermometerSwitch.addEventListener("change", (e) => {
            const thermometerLabel = thermometerSwitch.closest('.thermometer-switch').querySelector('.label'); // Find label in thermometer-switch container
            if (e.target.checked) {
                console.log("Thermometer ON");
                thermometerLabel.textContent = "Thermometer: ON"; // Update label to show it's ON
                thermometerSwitch.closest('.thermometer-switch').style.backgroundColor = "#00ff00"; // Green background for ON state
            } else {
                console.log("Thermometer OFF");
                thermometerLabel.textContent = "Thermometer: OFF"; // Update label to show it's OFF
                thermometerSwitch.closest('.thermometer-switch').style.backgroundColor = "#ff0000"; // Red background for OFF state
            }
        });
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
});
