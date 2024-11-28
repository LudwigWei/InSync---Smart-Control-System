// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Your Firebase Configuration
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
const db = getFirestore(app);

// Fetch Firestore Data
async function fetchChartData() {
    const docRef = doc(db, "charts", "chartData");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        renderChart(data.labels, data.values);
    } else {
        console.error("No such document!");
    }
}

function renderChart(labels, values) {
  const ctx = document.getElementById("chartCanvas").getContext("2d");

  // Destroy existing chart if it exists
  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Monthly Electric Consumption",
          data: values,
          backgroundColor: "rgba(0, 0, 0, 1)",
          borderColor: "rgba(0, 0, 0, 1)",
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: 'white', // Set legend text color to white
          },
        },
        title: {
          display: true,
          text: 'Monthly Electric Consumption',
          color: 'white', // Set title text color to white
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'white', // Set x-axis text color to white
          },
          grid: {
            color: 'white', // Set x-axis grid color to white
          },
        },
        y: {
          ticks: {
            color: 'white', // Set y-axis text color to white
          },
          grid: {
            color: 'white', // Set y-axis grid color to white
          },
          beginAtZero: true,
        },
      },
    },
  });
}

// Call the function to fetch and render data
fetchChartData();
