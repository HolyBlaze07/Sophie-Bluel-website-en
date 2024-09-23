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
//   {
//     src: "assets/images/abajour-tahina.png",
//     alt: "Tahina Lampshade",
//     caption: "Tahina Lampshade",
//   },
//   {
//     src: "assets/images/appartement-paris-v.png",
//     alt: "Paris V Appartment",
//     caption: "Paris V Appartment",
//   },
//   {
//     src: "assets/images/restaurant-sushisen-londres.png",
//     alt: "Sushisen Restaurant - London",
//     caption: "Sushisen Restaurant - London",
//   },
//   {
//     src: "assets/images/la-balisiere.png",
//     alt: '"La Balisière" Villa – Port-Louis',
//     caption: "“La Balisière” Villa – Port-Louis",
//   },
//   {
//     src: "assets/images/structures-thermopolis.png",
//     alt: "Thermopolis Structures",
//     caption: "Thermopolis Structures",
//   },
//   {
//     src: "assets/images/appartement-paris-x.png",
//     alt: "Paris X Appartment",
//     caption: "Paris X Appartment",
//   },
//   {
//     src: "assets/images/le-coteau-cassis.png",
//     alt: '"Le Coteau" Pavillion-Cassis',
//     caption: '"Le Coteau" Pavillion',
//   },
//   {
//     src: "assets/images/villa-ferneze.png",
//     alt: "Ferneze Villa - Elba",
//     caption: "Ferneze Villa - Elba",
//   },
//   {
//     src: "assets/images/appartement-paris-xviii.png",
//     alt: "Paris XVIII Appartment",
//     caption: "Paris XVIII Appartment",
//   },
//   {
//     src: "assets/images/bar-lullaby-paris.png",
//     alt: "Lullaby” Bar - Paris",
//     caption: "Lullaby Bar - Paris",
//   },
//   {
//     src: "assets/images/hotel-first-arte-new-delhi.png",
//     alt: "Hotel First Arte - New Delhi",
//     caption: "First Arte Hotel - New Delhi",
//   },
// ];
// TODO : Get the job categories from the backend and use that info to create filter buttons that can filter the job cards on the page
