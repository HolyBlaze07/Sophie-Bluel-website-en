const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from submitting the traditional way

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const auth = await response.json();

    if (response.ok) {
      console.log("Login successful:");
      localStorage.setItem("userToken", auth.token); // Store the token in the local storage
      // You can also store other user data if needed
      localStorage.setItem("userEmail", email);

      location.assign("./");
    } else {
      console.error("Login failed:");
      alert("Login failed. Please check your email and/or password.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
