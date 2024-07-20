// scripts/feedback.js

document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');

    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(feedbackForm);

        // Create an object to hold the form data
        const data = {
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Replace with your API endpoint
        const apiUrl = 'http://localhost:7000/user/feedback';

        // Make an asynchronous request to the API
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(responseData => {
            // Handle the response from the API
            alert('Feedback submitted successfully');
            // Clear the form
            feedbackForm.reset();
            window.location.href = 'index.html'
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('There was a problem submitting your feedback');
        });
    });
});
