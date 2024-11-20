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

// Dashboard button click event with toggle behavior
dashboardButton.addEventListener("click", () => {
    if (modal.style.display === "block") {
        // If modal is already visible, hide it and remove the highlight from the button
        modal.style.display = "none";
        dashboardButton.classList.remove('highlight'); // Remove highlight from the button
        dashboardButton.style.backgroundColor = ""; // Reset background color
        dashboardButton.style.color = ""; // Reset text color
    } else {
        // If modal is not visible, show it and hide modal1
        modal.style.display = "block";
        modal1.style.display = "none";
        highlightButton(dashboardButton); // Highlight dashboard button
        resetNextButtonColor(); // Reset the next button color
    }
});

// User information button click event with toggle behavior
userButton.addEventListener("click", () => {
    if (modal1.style.display === "block") {
        // If modal1 is already visible, hide it and remove the highlight from the button
        modal1.style.display = "none";
        userButton.classList.remove('highlight'); // Remove highlight from the button
        userButton.style.backgroundColor = ""; // Reset background color
        userButton.style.color = ""; // Reset text color
    } else {
        // If modal1 is not visible, show it and hide modal
        modal1.style.display = "block";
        modal.style.display = "none";
        highlightButton(userButton); // Highlight user information button
        resetNextButtonColor(); // Reset the next button color
    }
});

// Close buttons for modals
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
    // Ensure the modal is hidden on page load
    modal.style.display = "none";
    modal1.style.display = "none";

    // Add event listeners to all menu buttons
    menuButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button !== next) { // Check if the clicked button is not "next"
                highlightButton(button); // Highlight the clicked button
                resetNextButtonColor(); // Ensure next button is reset when another button is clicked
            }
        });
    });

    // Event listeners for the on/off toggle switches
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

    function updateDateTime() {
        const now = new Date();

        // Format date as "October 1, 2001"
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);

        // Format time as "4:55 PM"
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        // Combine date and time
        const dateTime = `${formattedDate}  |  ${formattedTime}`;

        // Set the text of the datetime element
        const dateTimeElement = document.getElementById('date-time');
        if (dateTimeElement) {
            dateTimeElement.textContent = dateTime; // Update datetime
        }
    }

    // Ensure the page is fully loaded before starting the time update
    updateDateTime(); // Initialize date and time immediately on page load
    setInterval(updateDateTime, 1000); // Update every second
});

// Open the modal when clicking the dashboard button


// Show the modal when dashboard button is clicked
dashboardButton.addEventListener("click", () => {
    modal.style.display = "block"; // Show modal
});

// Close the modal when the close button is clicked
closeButton.addEventListener("click", () => {
    modal.style.display = "none"; // Hide modal
});

document.addEventListener("DOMContentLoaded", function() {
    // Function to update the date and time
    function updateDateTime() {
        const dateTimeElement = document.getElementById("dateTime");
        
        if (!dateTimeElement) {
            console.error('DateTime element not found!');
            return;
        }

        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        // Set date and time content
        const formattedDateTime = now.toLocaleDateString('en-US', options);
        dateTimeElement.innerHTML = formattedDateTime;
        console.log("Date and Time Updated:", formattedDateTime); // Log to verify update
    }

    // Show the modal with date and time
    function showModal() {
        const modal = document.getElementById("modal");
        
        if (!modal) {
            console.error('Modal element not found!');
            return;
        }
        
        modal.style.display = "block"; // Make the modal visible
        updateDateTime(); // Initial date/time display
        setInterval(updateDateTime, 1000); // Update every second
    }

    // Close the modal when the close button is clicked
    const closeButton = document.querySelector(".close");
    if (closeButton) {
        closeButton.onclick = function() {
            document.getElementById("modal").style.display = "none";
        };
    } else {
        console.error('Close button not found!');
    }

    // Open the modal to test
    showModal(); // Open the modal immediately to test
});
