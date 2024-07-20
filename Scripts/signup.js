// scripts/signup.js

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        const data = {
            fullname: fullname,
            email: email,
            phone: phone,
            password: password
        };

        // Replace with your API endpoint
        const apiUrl = 'http://localhost:7000/user/signup';

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
            alert('Signup successful!');
            window.location.href="login.html";
            // Clear the form
            signupForm.reset();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('There was a problem with your signup.');
        });
    });
});
