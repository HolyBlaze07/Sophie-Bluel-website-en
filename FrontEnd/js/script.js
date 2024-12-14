let jobCache; // Cache for jobs
const galleryDiv = document.querySelector(".gallery");
const filterDiv = document.querySelector(".category-menu");
// TODO: check if user is logged in, if logged in then show the edit bar by adding and removing the class using css 
// Fetch and display jobs

checkUserLoggedIn();
//TODO:

function checkUserLoggedIn() {
  const userToken = localStorage.getItem("userToken");
  const editBar = document.querySelector(".edit-header"); // Make sure you have this element in your HTML

  if (userToken) {
    // User is logged in, show the edit bar
    //TODO: Add the class to show the edit button
    //TODO: Show to logout navigation link
    //TODO: hide the filter buttons
    editBar.classList.remove("hidden");
  } else {
    // User not logged in, keep the edit bar hidden
    editBar.classList.add("hidden");
    //TODO: Hide the edit bar and edit button, hiding the logout  and hide the login but not at the same time. Show the filter buttons.
  }
}
fetch("http://localhost:5678/api/works")
  .then((data) => data.json())
  .then((jobs) => {
    jobCache = jobs; // Cache jobs
    insertJobs(jobs); // Display jobs in the gallery
  });

// Fetch and display categories
fetch("http://localhost:5678/api/categories")
  .then((data) => data.json())
  .then((categories) => {
    insertCategories(categories); // Render category buttons
  });

/**
 * Insert jobs into the gallery
 */
function insertJobs(jobs) {
  galleryDiv.innerHTML = ""; // Clear the gallery
  jobs.forEach(({ imageUrl, title }) => {
    galleryDiv.innerHTML += `
      <figure>
        <img src="${imageUrl}" alt="${title}">
        <figcaption>${title}</figcaption>
      </figure>
    `;
  });
}

/**
 * Insert categories into the filter menu
 */
function insertCategories(categories) {
  filterDiv.innerHTML = `<button data-category="all">All</button>`; // Add "All" button

  categories.forEach(({ id, name }) => {
    filterDiv.innerHTML += `<button data-category="${id}">${name}</button>`;
  });

  const buttons = filterDiv.querySelectorAll("button");

  // Add event listeners to filter buttons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = button.getAttribute("data-category");
      console.log(`Filtering category: ${categoryId}`);
      filterJobs(categoryId);
    });
  });
}

/**
 * Filter jobs by category and update the gallery
 */
function filterJobs(categoryId) {
  if (categoryId === "all") {
    insertJobs(jobCache); // Show all jobs
  } else {
    const filteredJobs = jobCache.filter((job) => job.categoryId == categoryId);
    insertJobs(filteredJobs);
  }
}

/**
 * Modal Logic
 */

// Get modal elements
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const toAddPhotoBtn = document.getElementById("to-add-photo");
const photoGallery = document.getElementById("photo-gallery");
const addPhoto = document.getElementById("add-photo");

// Open modal
document.getElementById("edit-btn").addEventListener("click", () => {
  insertModalGallery(jobCache); // Insert jobs into modal gallery

  modal.style.display = "block"; // Show modal
});

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none"; // Hide modal
});

// Close modal by clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Toggle to "Add Photo" view
toAddPhotoBtn.addEventListener("click", () => {
  photoGallery.classList.add("hidden");
  addPhoto.classList.remove("hidden");
});

function insertModalGallery(jobs) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Clear previous entries

  jobs.forEach(job => {
    const jobDiv = document.createElement("div");
    jobDiv.className = "modal-job";
    jobDiv.innerHTML = `
      <img src="${job.imageUrl}" alt="${job.title}">
    
    <button class="delete-btn" data-job-id="${job.id}">
          <img src="../assets/images/Group 10@2x.png" alt="Delete icon" />
        </button>`;
    modalGallery.appendChild(jobDiv);
  });

  // Add event listeners to all delete buttons
  modalGallery.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const jobId = button.getAttribute("data-job-id");
      deleteJob(jobId);
    });
  });
}

