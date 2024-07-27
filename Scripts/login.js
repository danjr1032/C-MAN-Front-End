

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission


    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }


    // Get user input
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Construct the request body
    const data = {
        email: email,
        password: password
    };

    // Make the API request
    fetch('https://c-man-api.onrender.com/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // Add any other headers as needed
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            // If the response status is 404, user does not exist
            if (response.status === 404) {
                throw new Error('User does not exist');
            }
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle successful login response
        alert("Login successful!");

        setCookie('uid', data.user._id, 60)
        setCookie('fullname', data.user.fullname, 60)
        setCookie('email', data.user.email, 60)

        window.location.href = "userDashboard.html";
        console.log('Login successful:', data);
        // Optionally, redirect to another page or show a success message
    })
    .catch(error => {
        // Handle errors
        console.error('Error logging in:', error);
        // Display an error message to the user
    });
});
