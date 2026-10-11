
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");

// Validate Name
function validateName() {
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Name is required.";
        return false;
    }

    nameError.textContent = "";
    return true;
}

// Validate Email
function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
        emailError.textContent = "Enter a valid email address.";
        return false;
    }

    emailError.textContent = "";
    return true;
}

// Validate Password
function validatePassword() {
    if (passwordInput.value.length < 6) {
        passwordError.textContent =
            "Password must be at least 6 characters.";
        return false;
    }

    passwordError.textContent = "";
    return true;
}

// Check all fields
function validateForm() {
    const nameValid = validateName();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();

    submitBtn.disabled = !(
        nameValid && emailValid && passwordValid
    );
}

// Real-time validation
nameInput.addEventListener("input", validateForm);
emailInput.addEventListener("input", validateForm);
passwordInput.addEventListener("input", validateForm);

// Submit the form
form.addEventListener("submit", function(event) {
    event.preventDefault();

    validateForm();

    if (!submitBtn.disabled) {
        successMessage.textContent =
            "Registration successful!";

        form.reset();
        submitBtn.disabled = true;
    }
});
