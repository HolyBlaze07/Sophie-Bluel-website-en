let jobCache; // Cache for jobs
let categoryCache; // Cache for categories
const galleryDiv = document.querySelector(".gallery");
const filterDiv = document.querySelector(".category-menu");
const logoutButton = document.querySelector(".logout a");

checkUserLoggedIn();

// Check if user is logged in and update UI accordingly
function checkUserLoggedIn() {
  const userToken = localStorage.getItem("userToken");
  const editBar = document.querySelector(".edit-header");
  const editButton = document.getElementById("edit-btn");
  const logoutLink = document.querySelector(".logout");
  const loginLink = document.querySelector(".login");
  const filterButton = document.querySelector(".category-menu");

  if (userToken) {
    editButton.classList.remove("hidden");
    logoutLink.classList.remove("hidden");
    editBar.classList.remove("hidden");
    filterButton.classList.add("hidden");
    loginLink.classList.add("hidden");
  } else {
    editBar.classList.add("hidden");
    editButton.classList.add("hidden");
    logoutLink.classList.add("hidden");
    filterButton.classList.remove("hidden");
    loginLink.classList.remove("hidden");
  }
}

// Add event listener for logout button
logoutButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link behavior
  localStorage.removeItem("userToken"); // Clear the user session
  checkUserLoggedIn(); // Recheck the user login status and update UI
  window.location.href = "./"; // Redirect to the home page
});

// Fetch works and categories from API and display them
fetch("http://localhost:5678/api/works")
  .then((data) => data.json())
  .then((jobs) => {
    jobCache = jobs; // Cache jobs
    insertJobs(jobs); // Display jobs in the gallery
  });

fetch("http://localhost:5678/api/categories")
  .then((data) => data.json())
  .then((categories) => {
    categoryCache = categories; // Cache categories
    insertCategories(categories); // Render category buttons
  });

// Insert jobs into the gallery
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

// Insert categories into the filter menu
function insertCategories(categories) {
  filterDiv.innerHTML = `<button data-category="all">All</button>`; // Add "All" button
  categories.forEach(({ id, name }) => {
    filterDiv.innerHTML += `<button data-category="${id}">${name}</button>`;
  });

  const buttons = filterDiv.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = button.getAttribute("data-category");
      console.log(`Filtering category: ${categoryId}`);
      filterJobs(categoryId);
    });
  });
}

// Filter jobs by category and update the gallery
function filterJobs(categoryId) {
  if (categoryId === "all") {
    insertJobs(jobCache); // Show all jobs
  } else {
    const filteredJobs = jobCache.filter((job) => job.categoryId == categoryId);
    insertJobs(filteredJobs);
  }
}

// Modal Logic
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
const toAddPhotoBtn = document.getElementById("to-add-photo");
const photoGallery = document.getElementById("photo-gallery");
const addPhoto = document.getElementById("add-photo");
const backToGalleryBtn = document.getElementById("back-to-gallery");

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

// Handle back button click to go back to photo gallery
backToGalleryBtn.addEventListener("click", () => {
  addPhoto.classList.add("hidden");
  photoGallery.classList.remove("hidden");
});

// Insert jobs into the modal gallery
function insertModalGallery(jobs) {
  const modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = ""; // Clear previous entries

  jobs.forEach((job) => {
    const jobDiv = document.createElement("div");
    jobDiv.className = "modal-job";
    jobDiv.dataset.job = job.id;
    jobDiv.innerHTML = `
      <img src="${job.imageUrl}" alt="${job.title}">
      <button class="delete-btn">
        <img src="../assets/images/Group 10@2x.png" alt="Delete icon" />
      </button>`;
    modalGallery.appendChild(jobDiv);
  });

  // Add event listeners to all delete buttons
  modalGallery.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const deleteBtn = event.target;
      const modalJob = deleteBtn.closest(".modal-job");
      const jobId = modalJob.dataset.job;
      const userToken = localStorage.getItem("userToken");
      console.log(userToken);

      modalJob.remove(); // Remove the job from the modal

      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${jobId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Update jobCache and re-render both galleries
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

  // Fetch categories from the backend API and populate the dropdown
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((categories) => {
      // Populate the categories dropdown
      const categorySelect = document.getElementById("category"); // The select element in the form
      categorySelect.innerHTML = `<option value="" disabled selected>Select a category</option>`; // Add a default option

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id; // Set the value of each option
        option.textContent = category.name; // Set the display text of each option
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
      alert("There was an error fetching categories.");
    });

  // Add event listener to the form to submit new photo
  document
    .getElementById("add-photo-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData();
      formData.append("image", document.getElementById("file-upload").files[0]);
      formData.append("title", document.getElementById("title-input").value);
      formData.append("category", document.getElementById("category").value);

      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: formData, // Send the form data
        });
        if (response.status === 401) {
          console.error("Unauthorized. Please log in again.");
          alert(
            "Your session has expired or you're not authorized. Please log in again."
          );
          window.location.href = "./login.html"; // Redirect to login page
        }

        if (response.ok) {
          const newJob = await response.json();
          jobCache.push(newJob); // Add the new job to the cache
          insertJobs(jobCache); // Update the gallery with the new job
          modal.style.display = "none"; // Close the modal
        } else {
          alert("Failed to add the new project.");
        }
      } catch (error) {
        console.error("Error submitting new project:", error);
        alert("There was an error submitting the new project.");
      }
    });
}
document.querySelector(".custom-file-upload").addEventListener("change", () => {
  const fileUpload = document.querySelector(".file-upload");
  const image = fileUpload.files[0];
  if (!image.type.includes('image')) {
    return alert('Only images are allowed!');
  }

  // check if size (in bytes) exceeds 10 MB
  if (image.size > 4_000_000) {
    return alert('Maximum upload size is 4MB!');
  }
  const fileReader = new FileReader();
  fileReader.readAsDataURL(image);

  fileReader.onload = () => {
    const uploadPhoto = document.querySelector(".upload-photo");

    // uploadPhoto.style.backgroundImage = url(
    //   `</span><span class="p">${</span><span class="nx">fileReaderEvent</span><span class="p">.</span><span class="nx">target</span><span class="p">.</span><span class="nx">result</span><span class="p">}</span><span class="s2">`
    // );
  };
});
