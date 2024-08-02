document.addEventListener("DOMContentLoaded", function() {
    const profileLink = document.getElementById("profile");
    const reportCrimeLink = document.getElementById("report-crime");
    const viewMissingPersonsLink = document.getElementById("view-missing-persons");
    const logoutLink = document.getElementById("logout");

    const defaultSection = document.querySelector(".default");
    const profileSection = document.getElementById("profile-section");
    const reportCrimeSection = document.getElementById("report-crime-section");
    const viewMissingPersonsSection = document.getElementById("view-missing-persons-section");

    profileLink.addEventListener("click", function() {
        showSection(profileSection);
        // loadUserProfile();
    });

    reportCrimeLink.addEventListener("click", function() {
        showSection(reportCrimeSection);
    });

    viewMissingPersonsLink.addEventListener("click", function() {
        showSection(viewMissingPersonsSection);
        loadMissingPersons();
    });

    logoutLink.addEventListener("click", function() {
        // Add logout functionality here
        alert("Logged out successfully!");
        window.location.href ='login.html';
    });

    function showSection(section) {
        defaultSection.style.display = "none";
        profileSection.style.display = "none";
        reportCrimeSection.style.display = "none";
        viewMissingPersonsSection.style.display = "none";

        section.style.display = "block";
    }

    
    function getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    function greetUser() {
        const fullnameContainer = document.getElementById("active-user");
        const emailContainer = document.getElementById("email");

        const fullnameCookie = getCookie("fullname");
        const emailCookie = getCookie("email");

        if (fullnameContainer) fullnameContainer.textContent = fullnameCookie;
        if (emailContainer) emailContainer.textContent = emailCookie;
    }

    window.onload = greetUser;



document.getElementById('profile-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const fullname = document.getElementById('name').value;
        const phone = document.querySelector('#profile-form input[placeholder="Phone"]').value;
        const email = document.querySelector('#profile-form input[placeholder="Email"]').value;
        const address = document.querySelector('#profile-form input[placeholder="Address"]').value;
        const street = document.querySelector('#profile-form input[placeholder="Street"]').value;
        const state = document.querySelector('#profile-form input[placeholder="State"]').value;

        const data = {
            fullname,
            phone,
            email,
            address,
            street,
            state
        };

        const uidCookie = getCookie("uid");
        fetch(`https://c-man-api.onrender.com/user/profileUpdate/${uidCookie}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Profile updated successfully!');
            document.getElementById('profile-form').reset();

        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });
    });



    document.getElementById('report-crime-form').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Form submission event triggered');
    
        const crime = document.getElementById('crime').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const evidence = document.getElementById('evidence').files[0];
    
        console.log('Crime:', crime);
        console.log('Location:', location);
        console.log('Description:', description);
        console.log('Evidence:', evidence);
    
        const formData = new FormData();
        formData.append('crime', crime);
        formData.append('location', location);
        formData.append('description', description);
        if (evidence) {
            formData.append('evidence', evidence);
        }
    
        const uidCookie = getCookie("uid");
        console.log('UID Cookie:', uidCookie);
    
        fetch(`https://c-man-api.onrender.com/user/complaint/${uidCookie}`, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { // Retrieve response body as text
                    throw new Error(`Network response was not ok. Status: ${response.status}, Response: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Complaint sent successfully!');
            document.getElementById('report-crime-form').reset();
        })
        .catch(error => {
            console.error('Error sending complaint:', error);
            alert(`Failed to send complaint: ${error.message}`);
        });
    });
    
    
   
    
    
    

    function loadMissingPersons() {
        fetch('https://c-man-api.onrender.com/user/missing', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const missingPersonsTable = document.getElementById("missing-persons-table");
            missingPersonsTable.innerHTML = ''; // Clear existing rows

            data.forEach(person => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    
                    <td><img src="${person.image}" alt="Image" style="width:150px; height:150px;"></td>
                    <td>${person.fullname}</td>
                    <td>${person.gender}</td>
                    <td>${person.age}</td>
                    <td>${person.description}</td>
                `;

                missingPersonsTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading missing persons:', error);
        });
    }



    fetchComplaints();
   
   // Fetch complaints data
   function fetchComplaints() {
    const uidCookie = getCookie("uid");
    console.log('UID Cookie:', uidCookie);

    fetch(`https://c-man-api.onrender.com/user/reports/${uidCookie}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log("Fetch response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetch complaints data:", data);
        if (Array.isArray(data)) {
            displayComplaints(data);
        } else {
            alert('Failed to fetch complaints');
            console.error("Failed to fetch complaints:", data.message);
        }
    })
    .catch(error => {
        console.error("Error fetching complaints:", error);
    });
}

// Display complaints in table
function displayComplaints(complaints) {
    const complaintsTable = document.getElementById("reports-table");
    complaintsTable.innerHTML = ""; 

    complaints.forEach(complaint => {
        const row = createComplaintRow(complaint);
        complaintsTable.appendChild(row);
    });
}

// Create HTML row for complaint
function createComplaintRow(complaint) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${complaint.crime}</td>
        <td>${complaint.location}</td>
        <td>${complaint.description}</td>
        <td><img src="${complaint.evidence}" alt="Evidence" width="200" height="150"/></td>
        <td>${complaint.reportDate}</td>
        <td>${complaint.status}</td>
        <td>${complaint.progressReport}</td>
    `;
    return row;
}







 // Fetch complaints count when the document is loaded
 const uidCookie = getCookie("uid");
 fetchComplaintCount(uidCookie);

 // Function to fetch complaint count
 async function fetchComplaintCount(userId) {
     try {
         const response = await fetch(`https://c-man-api.onrender.com/user/complaints/count/${userId}`, {
             method: "GET",
             headers: {
                 "Content-Type": "application/json"
             }
         });
         
         if (!response.ok) {
             throw new Error('Network response was not ok ' + response.statusText);
         }
         
         const data = await response.json();
         document.getElementById('number-of-reports').textContent = data.count;
     } catch (error) {
         console.error('There was a problem with the fetch operation:', error);
     }
 }


});




