let isSignup = false;

function toggleForm() {
    isSignup = !isSignup;
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleLinkText = document.getElementById('toggle-link');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');

    if (isSignup) {
        formTitle.textContent = 'Sign Up';
        submitBtn.textContent = 'Sign Up';
        confirmPasswordGroup.style.display = 'block';
        toggleLinkText.innerHTML = 'Already have an account? Login';
    } else {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        confirmPasswordGroup.style.display = 'none';
        toggleLinkText.innerHTML = "Don't have an account? Sign up";
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.style.display = 'none';
}

document.getElementById('submit-btn').addEventListener('click', function(e) {
    e.preventDefault();  // Prevent form submission
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    let valid = true;

    // Email validation
    if (!email || !validateEmail(email)) {
        showError(emailError, 'Please enter a valid email address');
        valid = false;
    } else {
        hideError(emailError);
    }

    // Password validation
    if (!password || password.length < 6) {
        showError(passwordError, 'Password must be at least 6 characters long');
        valid = false;
    } else {
        hideError(passwordError);
    }

    if (isSignup) {
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        // Confirm password validation
        if (password !== confirmPassword) {
            showError(confirmPasswordError, 'Passwords do not match');
            valid = false;
        } else {
            hideError(confirmPasswordError);
        }
    }

    if (valid) {
        if (isSignup) {
            alert(`Signup successful! Welcome, ${email}`);
        } else {
            alert(`Login successful! Welcome back, ${email}`);
        }
    }
});
