    function validateForm() {
        var name = document.getElementById("name").value;
        var housename = document.getElementById("housename").value;
        var street = document.getElementById("street").value;
        var city = document.getElementById("city").value;
        var state = document.getElementById("state").value;
        var pincode = document.getElementById("pincode").value;

        if (name.trim() === "") {
            alert("Name must not be empty");
            return false;
        }

        if (housename.trim() === "") {
            alert("House Name must not be empty");
            return false;
        }

        if (street.trim() === "") {
            alert("Street must not be empty");
            return false;
        }

        if (city.trim() === "") {
            alert("City must not be empty");
            return false;
        }

        if (state.trim() === "") {
            alert("State must not be empty");
            return false;
        }

        // Validate pincode as 6 digits
        if (!/^\d{6}$/.test(pincode)) {
            alert("Pin Code must be a 6-digit number");
            return false;
        }
        return true;
    }
    const form = document.querySelector("#addForm");
    form.addEventListener("submit", function (event) {
        if (!validateForm()) {
            event.preventDefault(); // Prevent form submission if validation fails
        } 
    });





