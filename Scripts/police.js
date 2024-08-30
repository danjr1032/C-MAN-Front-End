document.addEventListener('DOMContentLoaded', function() {
    const policeForm = document.getElementById('police-form');

    policeForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const badgeNumber = document.getElementById('police-badge').value;
        const password = document.getElementById('police-password').value;

        const loginData = {
            badgeNumber: badgeNumber,
            password: password
        };

        fetch('https://c-man-api.onrender.com/police/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                // If the response status is 404, Police does not exist
                if (response.status === 404) {
                    alert('Police does not exist!');
                    throw new Error('User does not exist');
    
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                window.location.href = 'policeDashboard.html'; 
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again later.');
        });
    });
});
