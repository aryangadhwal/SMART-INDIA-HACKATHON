// Fetch stored feedback from localStorage
function loadFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';

    feedbacks.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <p><strong>Name:</strong> ${feedback.name}</p>
            <p><strong>Email:</strong> ${feedback.email}</p>
            <p><strong>Feedback:</strong> ${feedback.feedback}</p>
        `;
        feedbackList.appendChild(feedbackItem);
    });
}

// Save feedback to localStorage
function saveFeedback(name, email, feedbackText) {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push({ name, email, feedback: feedbackText });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

// Form submission event
document.getElementById('feedbackForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedbackText = document.getElementById('feedback').value;

    // Save the feedback
    saveFeedback(name, email, feedbackText);

    // Show success message
    const message = document.getElementById('message');
    message.textContent = 'Feedback submitted successfully!';

    // Clear form fields
    this.reset();

    // Reload the feedbacks list
    loadFeedbacks();
});

// Load feedbacks when the page loads
window.onload = loadFeedbacks;
