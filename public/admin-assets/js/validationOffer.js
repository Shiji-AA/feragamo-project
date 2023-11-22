function validateOfferForm() {
    const offerCode = document.getElementById("offerCode").value;
    const offerDescription = document.getElementById("offerDescription").value;
    const offerDiscount = document.getElementById("offerDiscount").value;
    const offerExpiry = document.getElementById("offerExpiry").value;
    const maximumAmount = document.getElementById("maximumAmount").value;
    const minimumAmount = document.getElementById("minimumAmount").value;

    // Validation for Offer Code
    if (!isValidOfferCode(offerCode)) {
        alert("Offer Code can only contain letters and numbers.");
        return false;
    }

    // Validation for Offer Description
    if (offerDescription.trim() === "") {
        alert("Offer Description cannot be empty.");
        return false;
    }

    // Validation for Offer Discount
    if (isNaN(offerDiscount) || offerDiscount.trim() === "") {
        alert("Discount must be a numeric value.");
        return false;
    }

    // Validation for Offer Expiry
    if (offerExpiry.trim() === "") {
        alert("Expiry Date cannot be empty.");
        return false;
    }

    // Validation for Max Discount Amount
    if (isNaN(maximumAmount) || maximumAmount.trim() === "") {
        alert("Max Discount Amount must be a numeric value.");
        return false;
    }

    // Validation for Min Purchase Amount
    if (isNaN(minimumAmount) || minimumAmount.trim() === "") {
        alert("Min Purchase Amount must be a numeric value.");
        return false;
    }

    return true;
}

function isValidOfferCode(offerCode) {
    // Regular expression to check if the offer code contains only letters and numbers
    var offerCodeRegex = /^[A-Za-z0-9]+$/;
    return offerCodeRegex.test(offerCode);
}

const offerForm = document.getElementById("offerForm");
offerForm.addEventListener("submit", function (event) {
    if (!validateOfferForm()) {
        event.preventDefault();
    } else {
        setTimeout(function () {
            // Submit the form after the delay
            offerForm.submit();
        }, 100);
    }
});
