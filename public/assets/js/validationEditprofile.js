// Function to validate the form when submitted
function validateForm() {
const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const mobile = document.getElementById("mobile").value;  
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

const form = document.querySelector("myForm");
form.addEventListener("submit", function (event) {
if (!validateForm()) {
event.preventDefault(); // Prevent form submission if validation fails
} else {
setTimeout(function () {
  // Submit the form after the delay
  form.submit();
}, 1);
}
});