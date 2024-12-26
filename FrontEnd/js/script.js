let jobCache; // Cache for jobs
const galleryDiv = document.querySelector(".gallery");
const filterDiv = document.querySelector(".category-menu");
const logoutButton = document.querySelector(".logout a");
checkUserLoggedIn();

function checkUserLoggedIn() {
  const userToken = localStorage.getItem("userToken");
  const editBar = document.querySelector(".edit-header");
  const editButton = document.getElementById("edit-btn");
  const logoutLink = document.querySelector(".logout");
  const loginLink = document.querySelector(".login");
  const filterButton = document.querySelector(".category-menu");
  // Make sure you have this element in your HTML
  // TODO:Add event listener to the logout link to clear out local storage and redirect to login page
  if (userToken) {
    editButton.classList.remove("hidden");
    logoutLink.classList.remove("hidden");
    //TODO: hide the filter buttons. display none.
    editBar.classList.remove("hidden");
    filterButton.classList.add("hidden");

    loginLink.classList.add("hidden");
  } else {
    editBar.classList.add("hidden");
    editButton.classList.add("hidden");

    logoutLink.classList.add("hidden");
    filterButton.classList.remove("hidden");
    loginLink.classList.remove("hidden");

    //TODO: hiding the logout  and show the login but not at the same time. Show the filter buttons.
  }
}

// Add event listener for logout button

logoutButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link behavior
  localStorage.removeItem("userToken"); // Clear the user session
  checkUserLoggedIn(); // Recheck the user login status and update UI
  window.location.href = "./"; // Redirect to the home page
});

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

  jobs.forEach((job) => {
    const jobDiv = document.createElement("div");
    jobDiv.className = "modal-job";
    jobDiv.innerHTML = `
      <img src="${job.imageUrl}" alt="${job.title}">
    
    <button class="delete-btn" data-job="${job.id}">
          <img src="../assets/images/Group 10@2x.png" alt="Delete icon" />
        </button>`;
    modalGallery.appendChild(jobDiv);
  });

  // Add event listeners to all delete buttons
  modalGallery.querySelectorAll(".delete-btn").forEach((button) => {
    console.log(button);
    button.addEventListener("click", async (event) => {
      const deleteBtn = event.target;
      const modalJob = deleteBtn.closest(`.modal-job`);

      // const jobId = deleteBtn.dataset.job;
      const jobId = 1;

      modalJob.remove();
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${jobId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              "Content-Type": "application/json",
            },
            // TODO delete the job from the backend that has the id of jobId using fetch API
            // TODO remove the job from the jobCache array
          }
        );
        if (response.ok) {
          jobCache = jobCache.filter((job) => job.id !== parseInt(jobId));

          insertJobs(jobCache);
          insertModalGallery(jobCache);
        } else {
          console.error("Failed to delete job");
          alert("There was an error deleting the job");
        }
      } catch (error) {
        console.error("Failed to delete job", error);
        alert("There was an error deleting the job");
      }
    });
  });
}
