localStorage.clear(); // Clear any old session data
const loginForm = document.getElementById("loginForm");

// Listen for the form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();  // Stop the form from reloading the page

  const email = document.getElementById("email").value; // Get the email
  const password = document.getElementById("password").value; // Get the password

  try {
    const response = await fetch(
      "https://sophie-bluel-ea7w.onrender.com/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const auth = await response.json(); // Get the response from the server

    if (response.ok) {
      console.log("Login successful:");
      localStorage.setItem("userToken", auth.token); // Store the token in the local storage
      // You can also store other user data if needed
      localStorage.setItem("userEmail", email);  // Save the token for later use

      location.assign("./");// Redirect to the homepage
    } else {
      console.error("Login failed:");
      alert("Login failed. Please check your email and/or password.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
