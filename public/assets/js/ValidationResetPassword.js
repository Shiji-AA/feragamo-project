function validateForm() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const passwordError = document.querySelector("#form .form-group:nth-child(1) .error");
  const confirmPasswordError = document.querySelector("#form .form-group:nth-child(2) .error");

  // Reset error messages
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";

  let isValid = true;

  // Validation for Password
  if (password.trim() === "") {
    passwordError.textContent = "Password cannot be empty.";
    isValid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Password should be at least 8 characters long.";
    isValid = false;
  } else if (!/[A-Z]/.test(password)) {
    passwordError.textContent = "Password should contain at least one uppercase letter.";
    isValid = false;
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    passwordError.textContent = "Password should contain at least one special character.";
    isValid = false;
  }

  // Validation for Confirm Password
  if (confirmPassword.trim() === "") {
    confirmPasswordError.textContent = "Confirm password cannot be empty.";
    isValid = false;
  } else if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match.";
    isValid = false;
  }

  console.log("isValid:", isValid); // Check if isValid is being set correctly
  return isValid;
}

const form = document.getElementById("form");
console.log("Form:", form); // Check if form is correctly selected

form.addEventListener("submit", function(event) {
  if (!validateForm()) {
    event.preventDefault();
  }
});
