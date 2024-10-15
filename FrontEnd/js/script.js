let jobCache;
// TODO: call render menu function to conditionally render login or logout menu items based on if the user is logged in or not

fetch("http://localhost:5678/api/works")
  .then((data) => {
    return data.json();
  })
  .then((jobs) => {
    jobCache = jobs;

    insertJobs(jobs);
  });

function renderMenu() {
  // TODO: render login or logout menu items based on if the user is logged in or not
}

function insertJobs(jobs) {
  console.log(jobs);
  galleryDiv.innerHTML = "";
  jobs.forEach(({ imageUrl, title }) => {
    galleryDiv.innerHTML += `
      <figure>
        <img src="${imageUrl}" alt="${title}">
        <figcaption>${title}</figcaption>
      </figure>
    `;
  });
}
console.log("I am after the fetch call");

const galleryDiv = document.querySelector(".gallery");
// this is the function that will insert the job cards into the page
// const images = [

fetch("http://localhost:5678/api/categories")
  .then((data) => {
    return data.json();
  })
  .then((categories) => {
    insertCategories(categories);
  });
function insertCategories(categories) {
  console.log(categories);

  const filterDiv = document.querySelector(".category-menu");
  filterDiv.innerHTML += `<button data-category="all">All</button>`;

  categories.forEach(({ id, name }) => {
    filterDiv.innerHTML += `<button data-category="${id}">${name}</button>`;
  });

  const buttons = filterDiv.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = button.getAttribute("data-category");
      console.log(categoryId);
      filterJobs(categoryId);
    });
  });
}

function filterJobs(categoryId) {
  fetch("http://localhost:5678/api/works")
    .then((data) => data.json())
    .then((jobs) => {
      if (categoryId === "all") {
        insertJobs(jobs); // Show all jobs
      } else {
        const filteredJobs = jobs.filter((job) => job.categoryId == categoryId);
        insertJobs(filteredJobs);
      }
    });
}
