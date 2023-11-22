function validateProductForm() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const gender = document.getElementById("gender").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;

    // Validation for Product Name
    if (name.length === 0 || name.length > 12) {
        alert("Product name should be between 1 and 12 characters.");
        return false;
    }

    // Validation for Product Description
    if (description.trim() === "") {
        alert("Product description cannot be empty.");
        return false;
    }

    // Validation for Gender
    if (gender.trim() === "") {
        alert("Gender cannot be empty.");
        return false;
    }

    // Validation for Price
    if (isNaN(price) || price.trim() === "") {
        alert("Price must be a numeric value.");
        return false;
    }

    // Validation for Stock
    if (isNaN(stock) || stock.trim() === "" || parseInt(stock) < 0) {
        alert("Stock must be a non-negative numeric value.");
        return false;
    }

    return true;
}

const productForm = document.getElementById("myForm");
productForm.addEventListener("submit", function (event) {
    if (!validateProductForm()) {
        event.preventDefault();
    } else {
        setTimeout(function () {
            // Submit the form after a delay of 100ms
            productForm.submit();
        }, 100);
    }
});
