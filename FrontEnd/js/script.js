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


// Fetch works and display them in the gallery
fetch("http://localhost:5678/api/works")
  .then((data) => data.json()) // Convert the response to JSON
  .then((jobs) => {
    jobCache = jobs; // Cache jobs for later use
    insertJobs(jobs); // Call the function to display jobs in the gallery
  });

// Function to insert jobs into the gallery dynamically
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
      fetch(`http://localhost:5678/api/works/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          jobCache = jobCache.filter((job) => job.id !== parseInt(jobId));
          insertJobs(jobCache);
          insertModalGallery(jobCache);
        })
        .catch((error) => {
          console.error("Failed to delete job", error);
          alert("There was an error deleting the job");
        });
    });
  });
  const categorySelect = document.getElementById("category"); // The select element in the form
  categorySelect.innerHTML = `<option value="" disabled selected></option>`; // Add a default option

  categoryCache.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id; // Set the value of each option
    option.textContent = category.name; // Set the display text of each option
    categorySelect.appendChild(option);
  });


  // Select the form fields and button
const titleInput = document.getElementById("title-input");
const fileUpload = document.getElementById("file-upload");
const confirmButton = document.querySelector(".confirm-btn");

// Function to check if all fields are filled
function checkFormCompletion() {
  const isTitleFilled = titleInput.value.trim() !== "";
  const isCategorySelected = categorySelect.value.trim() !== "";
  const isFileUploaded = fileUpload.files.length > 0;

  // Enable/disable button based on form completion
  if (isTitleFilled && isCategorySelected && isFileUploaded) {
    confirmButton.disabled = false;
    confirmButton.classList.add("enabled");
    confirmButton.classList.remove("disabled");
  } else {
    confirmButton.disabled = true;
    confirmButton.classList.add("disabled");
    confirmButton.classList.remove("enabled");
  }
}

// Add event listeners for each form field
titleInput.addEventListener("input", checkFormCompletion);
categorySelect.addEventListener("change", checkFormCompletion);
fileUpload.addEventListener("change", checkFormCompletion);


  document.getElementById("file-upload").addEventListener("change", () => {
    
    
    const button = document.querySelector(".confirm-btn")


    // Enable the button
    button.disabled = false;
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
      console.log(formData);

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
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const fileUpload = document.querySelector(".file-upload"); // Hidden file input
  const uploadPhoto = document.querySelector(".upload-photo"); // Container for preview

  // Listen for changes to the file input
  fileUpload.addEventListener("change", () => {
    const image = fileUpload.files[0]; // Get the selected file

    if (!image) {
      console.error("No file selected.");
      return; // Exit if no file is selected
    }

    // Validate file type
    if (!image.type.includes("image")) {
      alert("Only images are allowed!");
      console.error("Invalid file type:", image.type);
      fileUpload.value = ""; // Reset file input
      return;
    }

    // Validate file size (max 4MB)
    if (image.size > 4_000_000) {
      alert("Maximum upload size is 4MB!");
      console.error("File size exceeds 4MB");
      fileUpload.value = ""; // Reset file input
      return;
    }

    const fileReader = new FileReader();

    // When the file is loaded, display the preview
    fileReader.onload = () => {
      console.log("Image Data URL:", fileReader.result); // Debugging output

      // Set the uploaded image as the background
      uploadPhoto.style.backgroundImage = `url('${fileReader.result}')`;
      uploadPhoto.style.backgroundSize = "contain";
      uploadPhoto.style.backgroundPosition = "center";
      uploadPhoto.style.backgroundRepeat = "no-repeat";
      document
        .getElementsByClassName("upload-action")[0]
        .classList.add("hidden");
    };

    // Read the image file as a Data URL
    fileReader.readAsDataURL(image);
  });
});
