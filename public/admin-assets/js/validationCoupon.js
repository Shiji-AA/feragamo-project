       function validateCouponForm() {
        const couponCode = document.getElementById("couponCode").value;
        const couponDescription = document.getElementById("couponDescription").value;
        const couponDiscount = document.getElementById("couponDiscount").value;
        const couponExpiry = document.getElementById("couponExpiry").value;
        const maximumAmount = document.getElementById("maximumAmount").value;
        const minimumAmount = document.getElementById("minimumAmount").value;

        // Validation for Coupon Code
        if (!isValidCouponCode(couponCode)) {
            alert("Coupon Code can only contain letters and numbers.");
            return false;
        }

        // Validation for Coupon Description
        if (couponDescription.trim() === "") {
            alert("Coupon Description cannot be empty.");
            return false;
        }

        // Validation for Coupon Discount
        if (isNaN(couponDiscount) || couponDiscount.trim() === "") {
            alert("Discount must be a numeric value.");
            return false;
        }

        // Validation for Coupon Expiry
        if (couponExpiry.trim() === "") {
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

    function isValidCouponCode(couponCode) {
        // Regular expression to check if the coupon code contains only letters and numbers
        var couponCodeRegex = /^[A-Za-z0-9]+$/;
        return couponCodeRegex.test(couponCode);
    }

    const couponForm = document.querySelector("form");
    couponForm.addEventListener("submit", function (event) {
        if (!validateCouponForm()) {
            event.preventDefault();
        } else {
            setTimeout(function () {
                // Submit the form after the delay
                couponForm.submit();
            }, 100);
        }
    });
