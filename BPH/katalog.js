// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to display items on index.html
async function loadItems() {
    const querySnapshot = await getDocs(collection(db, "items"));
    querySnapshot.forEach((doc) => {
        displayItem(doc.id, doc.data());
    });
}

// The same displayItem function as before
function displayItem(id, itemData) {
    // Create the parent container with the class 'project-box'
    const projectBox = document.createElement("div");
    projectBox.classList.add("project-box");

    // Create the inner card container with the class 'project-card'
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    // Create the image element
    const img = document.createElement("img");
    img.src = itemData.imageUrl;  // Assign the image URL from Firestore
    img.alt = "Project Image";     // Optional: Add an alt text for accessibility

    // Create the description paragraph
    const description = document.createElement("p");
    description.innerText = itemData.description; // Assign the description from Firestore

    // Create the "Beli Sekarang" button
    const btn = document.createElement("div");
    btn.classList.add("btn");
    btn.innerText = "Beli Sekarang";

    // WhatsApp URL (Replace '1234567890' with the seller's phone number)
    const phoneNumber = ""; // Replace this with actual phone number
    const waMessage = `Apakah Mesin ini masih ada?`;
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;

    // Add click event to open WhatsApp
    btn.addEventListener("click", () => {
        window.open(waUrl, "_blank");
    });

    // Append the image, description, and button to the 'project-card' div
    projectCard.appendChild(img);
    projectCard.appendChild(description);
    projectCard.appendChild(btn);

    // Append the 'project-card' div to the 'project-box' div
    projectBox.appendChild(projectCard);

    // Append the 'project-box' to the container in the HTML (e.g., a section or div with id 'itemContainer')
    document.getElementById("itemContainer").appendChild(projectBox);
}


// Load items on page load
window.onload = loadItems;
