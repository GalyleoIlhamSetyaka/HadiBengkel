// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

// Get DOM elements
const addItemBtn = document.getElementById("addItemBtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const addItemForm = document.getElementById("addItemForm");
const itemContainer = document.getElementById("itemContainer");
const logoutButton=document.getElementById('logout');



onAuthStateChanged(auth, user => {
  if (user) {
    console.log("User is logged in:", user);
    // Anda bisa meletakkan logika pengunggahan file di sini
  } else {
    console.log("No user is logged in.");
  }
});

// Show modal for adding item
addItemBtn.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Close modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fetch and display items from Firestore
async function loadItems() {
    const querySnapshot = await getDocs(collection(db, "items"));
    querySnapshot.forEach((doc) => {
        displayItem(doc.id, doc.data());
    });
}

// Display item on the dashboard
function displayItem(id, itemData) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.setAttribute("data-id", id); // Add data-id attribute

    const img = document.createElement("img");
    img.src = itemData.imageUrl;

    const description = document.createElement("p");
    description.innerText = itemData.description;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerText = "HAPUS";
    deleteBtn.addEventListener("click", () => deleteItem(id));

    itemDiv.appendChild(img);
    itemDiv.appendChild(description);
    itemDiv.appendChild(deleteBtn);

    itemContainer.appendChild(itemDiv);
}


addItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form elements
    const addItemBtn = document.getElementById("addItemBtn");

    // Disable the button to prevent spam clicks
    addItemBtn.disabled = true;
    
    // Show loading indicator
    document.getElementById("loading").style.display = "block";

    try {
        const imageFile = document.getElementById("image").files[0];
        const description = document.getElementById("description").value;

        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);

        // Add item to Firestore
        const newItem = {
            imageUrl: imageUrl,
            description: description
        };

        const docRef = await addDoc(collection(db, "items"), newItem);

        // Display new item on the dashboard
        displayItem(docRef.id, newItem);

        // Close modal and reset form
        modal.style.display = "none"; // Close the modal after item is added
        addItemForm.reset();
    } catch (error) {
        console.error('Error adding item: ', error);
    } finally {
        // Hide loading indicator and re-enable button
        document.getElementById("loading").style.display = "none";
        addItemBtn.disabled = false;
    }
});



// Delete item from Firestore and UI
async function deleteItem(id) {
    try {
        // Delete from Firestore
        await deleteDoc(doc(db, "items", id));
        
        // Remove item from the UI
        const itemDiv = document.querySelector(`.item[data-id="${id}"]`);
        if (itemDiv) {
            itemDiv.remove();
        }
    } catch (error) {
        console.error('Error deleting item: ', error);
    }
}

logoutButton?.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='../index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })
 
  auth.onAuthStateChanged(user => {
     if (user) {
       console.log(user.email + " is logged in!");
     } else {
       console.log('User is logged out!');
       if (window.location.pathname.includes("admin/admin.html")) {
         window.location.href = "../login.html";
     }
     }
   });
 
// Load all items on page load
window.onload = loadItems;
