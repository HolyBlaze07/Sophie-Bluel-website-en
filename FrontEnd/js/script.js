console.log("Hello World!");
// TODO: fetch the jobs from the backend using fetch API

fetch("http://localhost:5678/api/works")
  .then((data) => {
    return data.json();
  })
  .then((jobs) => {
    // TODO: call the function that will insert the job cards into the page passing in the jobs array
    // console.log(jobs);
    insertJobs(jobs);
  });

// TODO: Create a function that will insert the job cards into the page
function insertJobs(jobs) {
  console.log(jobs);
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

// TODO : Get the job categories from the backend and use that info to create filter buttons that can filter the job cards on the page
fetch ("http://localhost:5678/api/categories")
.then((data) => {
  return data.json();
})
.then((categories) => {
  insertCategories(categories);
  ;
 
});
function insertCategories(categories){
  console.log(categories)

  
const filterDiv = document.querySelector(".category-menu");
filterDiv.innerHTML += `<button data-category="all">All</button>`;

categories.forEach(({ id,name }) => {
  filterDiv.innerHTML += `<button data-category="${id}">${name}</button>`;
});

const buttons = filterDiv.querySelectorAll('button');
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const categoryId = button.getAttribute('data-category');
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
        const filteredJobs = jobs.filter(job => job.categoryId == categoryId); // Assuming job objects have a categoryId property
        insertJobs(filteredJobs); // Show filtered jobs
      }
    });
}
