console.log("Hello World!");
// TODO: fetch the jobs from the backend using fetch API

fetch("http://localhost:5678/api/works")
  .then((data) => {
    return data.json();
  })
  .then((jobs) => { 
    // TODO: call the function that will insert the job cards into the page passing in the jobs array
    console.log(jobs);
  });
// TODO: Create a function that will insert the job cards into the page 
