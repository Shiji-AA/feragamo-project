
  // Function to validate the form when submitted
  function validateForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mno").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

  // validation for Name
  if (!isValidName(name)) {
    alert("Name can only contain letters.");
    return false;
}

// validation for Email

if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return false;
}
// validation for mobile
if (!isValidMobile(mobile)) {
    alert("Mobile number must be 10 digits");
    return false;
}
// Validate Password (should not be empty and have a minimum length)
    // if (password.trim() === "" || password.length < 6) {
    //   alert("Password must be at least 6 characters long");
    //   return false;
    // }
    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters long");
      return false;
  }
// Validate confirmPassword (password and confirm password should match)
  
if (!validatePasswordMatch(password,confirmPassword)) {
  alert("Passwords do not match.");
  return false;
}

return true;
  }

  
function isValidName(name) {
    // Regular expression to check if the name contains only letters
    var nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
}

function isValidEmail(email) {
    // Simple email validation regex (you can use a more robust one)
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidMobile(mobile) {
    // Regular expression to check if the mobile number contains only numeric characters and has 10 digits
    var mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}

function validatePassword(password) {
  if (
    password.trim().length < 6 ||
    !/[A-Z]/.test(password) || // Check for uppercase letters
    !/[a-z]/.test(password) || // Check for lowercase letters
    !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) // Check for special characters
  ) {
    alert("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one special character.");
    return false;
  }
  return true;
}

function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }
  return true
  
}
const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  if (!validateForm()) {
    event.preventDefault();
  } else {
   setTimeout(function () {
      // Submit the form after the delay
      form.submit();
    }, 100);
  }
});

