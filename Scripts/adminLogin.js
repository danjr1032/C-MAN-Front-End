  
  document.addEventListener('DOMContentLoaded', function() {
  
  
  const adminForm = document.getElementById('admin-form');
  adminForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const email = document.getElementById('admin-email').value;
      const password = document.getElementById('admin-password').value;

      const loginData = {
          email: email,
          password: password
      };

      fetch('https://c-man-api.onrender.com/admini/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Admin Login successful!');
              window.location.href = 'adminDashboard.html'; 
          } else {
              alert('Admin Login failed: ' + data.message);
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred during Admin Login. Please try again later.');
      });
  });
});