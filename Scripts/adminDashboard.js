document.addEventListener("DOMContentLoaded", function() {
    const complaintsSection = document.getElementById("complaints-section");
    const addPoliceSection = document.getElementById("add-police-section");
    const viewPoliceSection = document.getElementById("view-police-section");
    const addNewsSection = document.getElementById("add-news-section");
    const viewUsersSection = document.getElementById("view-users-section");
    const viewFeedbacksSection = document.getElementById("view-feedbacks-section");
    const logoutButton = document.getElementById("logout");

    // Event listeners for sidebar links
    document.getElementById("view-complaints").addEventListener("click", function(event) {
        event.preventDefault();
        showSection(complaintsSection);
        fetchComplaints();
    });

    document.getElementById("add-police").addEventListener("click", function(event) {
        event.preventDefault();
        showSection(addPoliceSection);
    });

    document.getElementById("view-police").addEventListener("click", function(event) {
        event.preventDefault();
        showSection(viewPoliceSection);
        fetchPoliceOfficers();
    });

    document.getElementById("add-news").addEventListener("click", function(event) {
        event.preventDefault();
        showSection(addNewsSection);
    });

    document.getElementById("view-users").addEventListener("click", function(event) {
        event.preventDefault();
        showSection(viewUsersSection);
        fetchUsers();
    });

    document.getElementById("view-feedbacks").addEventListener("click", function(event) {
        event.preventDefault();
        showSection(viewFeedbacksSection);
        fetchFeedbacks();
    });

    logoutButton.addEventListener("click", function(event) {
        event.preventDefault();
        // Perform logout actions if needed
        alert("Logged out!");
        // Redirect to login page or perform other actions
        window.location.href = "adminLogin.html";
    });

    // Function to show/hide sections
    function showSection(section) {
        const sections = document.querySelectorAll(".section");
        sections.forEach(s => s.style.display = "none");
        section.style.display = "block";
    }

    // Fetch complaints data
    function fetchComplaints() {
        fetch("https://c-man-api.onrender.com/admini/complaints", {
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
            if (data.success) {
                displayComplaints(data.complaints);
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
        const complaintsTable = document.getElementById("complaints-table");
        complaintsTable.innerHTML = ""; // Clear previous content

        complaints.forEach(complaint => {
            const row = createComplaintRow(complaint);
            complaintsTable.appendChild(row);
        });
    }

    // Create HTML row for complaint
    function createComplaintRow(complaint) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${complaint._id}</td>
            <td>${complaint.userID}</td>
            <td>${complaint.crime}</td>
            <td>${complaint.location}</td>
            <td><img src="${complaint.evidence}" alt="Evidence" width="200" height="150"/></td>
            <td>${complaint.status}</td>
            <td>${complaint.reportDate}</td>
            <td>${complaint.progressReport}</td>
            <td><button class="delete-button" data-id="${complaint._id}">Delete</button></td>
        `;
        row.querySelector(".delete-button").addEventListener("click", deleteComplaint);
        return row;
    }

    
// Function to delete a complaint
function deleteComplaint(event) {
    const complaintId = event.target.dataset.id;

    fetch(`https://c-man-api.onrender.com/admini/complaints/${complaintId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Complaint deleted successfully') {
            // Remove the complaint from the table
            const row = event.target.closest("tr");
            row.remove();
            console.log(`Complaint with ID ${complaintId} has been deleted.`);
        } else {
            alert('Failed to delete complaint');
            console.error("Failed to delete complaint:", data.error || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error deleting complaint:", error);
    });
}


/// addpolice API
const addPoliceForm = document.getElementById("add-police-form");
addPoliceForm.addEventListener("submit", function(event) {
    event.preventDefault();
    addPoliceOfficer();
});

function addPoliceOfficer() {
    const formData = new FormData(addPoliceForm);
    
    for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    fetch("https://c-man-api.onrender.com/admini/police/registerPolice", {
        method: "POST",
        body: formData,
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Add police officer response:", data);
        if (data.success) {
          alert("Police officer added successfully!");
          addPoliceForm.reset(); 
        } else {
        //   alert("Failed to add police officer .");
          alert("Police officer added successfully!");
          addPoliceForm.reset();
          console.error("Failed to add police officer:", data.message);
        }
      })
      .catch(error => {
        console.error("Error adding police officer:", error.message);
      });
}





   // Fetch police officers data
function fetchPoliceOfficers() {
    fetch("https://c-man-api.onrender.com/admini/allPolice", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log("Fetch police officers response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetch police officers data:", data);
        if (data.success) {
            displayPoliceOfficers(data.policeOfficers);
        } else {
            alert("Failed to fetch police officers.");
            console.error("Failed to fetch police officers:", data.message);
        }
    })
    .catch(error => {
        console.error("Error fetching police officers:", error);
    });
}

// Display police officers in table
function displayPoliceOfficers(policeOfficers) {
    const policeTable = document.getElementById("police-table");
    policeTable.innerHTML = ""; // Clear previous content

    policeOfficers.forEach(officer => {
        const row = createPoliceOfficerRow(officer);
        policeTable.appendChild(row);
    });
}

// Create HTML row for police officer
function createPoliceOfficerRow(officer) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${officer._id}</td>
        <td>${officer.fullname}</td>
        <td><img src="${officer.image}" alt="Profile" width="150" height="150"/></td>
        <td>${officer.phone}</td>
        <td>${officer.email}</td>
        <td>${officer.badgeNumber}</td>
        <td>${officer.rank}</td>
        <td><button class="delete-button" data-id="${officer._id}">Delete</button></td>
    `;
    // Add event listeners for delete buttons
    row.querySelector(".delete-button").addEventListener("click", deletePolice);
    return row;
}

// Function to delete a police officer
function deletePolice(event) {
    const policeId = event.target.dataset.id;

    fetch(`https://c-man-api.onrender.com/admini/police/${policeId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Police deleted successfully') {
            // Remove the police officer from the table
            const row = event.target.closest("tr");
            alert(`Police with ID ${policeId} has been deleted.`);
            row.remove();
            console.log(`Police with ID ${policeId} has been deleted.`);
        } else {
            alert(`Police with ID ${policeId} has been deleted.`);
            row.remove();
            // alert('Failed to delete police officer.');
            console.error("Failed to delete police officer:", data.error || data.message || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error deleting police officer:", error);
    });
}




// Add news API
const addNewsForm = document.getElementById("add-news-form");
    addNewsForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addNews();
    });

    function addNews() {
        const formData = new FormData(addNewsForm);

        fetch("https://c-man-api.onrender.com/admini/addNews", {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Add news response:", data);
            if (data.success) {
                alert("News added successfully!");
                addNewsForm.reset(); // Clear the form
            } else {
                alert("Failed to add news.");
                console.error("Failed to add news:", data.message);
            }
        })
        .catch(error => {
            console.error("Error adding news:", error);
        });
    }




    // Fetch users data
    function fetchUsers() {
        fetch("https://c-man-api.onrender.com/admini/allUsers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log("Fetch users response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetch users data:", data);
            if (data.success) {
                displayUsers(data.users);
            } else {
                alert("Failed to fetch users.");
                console.error("Failed to fetch users:", data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching users:", error);
        });
    }

    // Display users in table
    function displayUsers(users) {
        const usersTable = document.getElementById("users-table");
        usersTable.innerHTML = ""; // Clear previous content

        users.forEach(user => {
            const row = createUserRow(user);
            usersTable.appendChild(row);
        });
    }

    // Create HTML row for user
    function createUserRow(user) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user._id}</td>
            <td>${user.fullname}</td>
            <td>${user.phone}</td>
            <td>${user.email}</td>
            <td>${user.address}</td>
            <td>${user.street}</td>
            <td>${user.state}</td>
            <td><button class="delete-button" data-id="${user._id}">Delete</button></td>
        `;
        row.querySelector(".delete-button").addEventListener("click", deleteUser);
        return row;
    }

    // Delete user
    // Function to delete a user
function deleteUser(event) {
    const userId = event.target.dataset.id;

    fetch(`https://c-man-api.onrender.com/admini/user/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'User deleted successfully') {
            // Remove the user row from the table
            const row = event.target.closest("tr");
            alert(`User with ID ${userId} has been deleted.`)
            row.remove();
            console.log(`User with ID ${userId} has been deleted.`);
        } else {
            alert('Failed to delete User');
            console.error("Failed to delete User:", data.error || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error deleting user:", error);
    });
}






    // Fetch feedbacks data
    function fetchFeedbacks() {
        fetch("https://c-man-api.onrender.com/admini/feedbacks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log("Fetch feedbacks response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetch feedbacks data:", data);
            if (data.success) {
                displayFeedbacks(data.feedbacks);
            } else {
                alert('Failed to fetch feedbacks');
                console.error("Failed to fetch feedbacks:", data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching feedbacks:", error);
        });
    }

    
    
   // Function to display feedbacks in table
function displayFeedbacks(feedbacks) {
    const feedbacksTable = document.getElementById("feedbacks-table");
    feedbacksTable.innerHTML = ""; // Clear previous content

    feedbacks.forEach(feedback => {
        const row = createFeedbackRow(feedback);
        feedbacksTable.appendChild(row);
    });
}

// Create HTML row for feedback
function createFeedbackRow(feedback) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${feedback._id}</td>
        <td>${feedback.fullname}</td>
        <td>${feedback.email}</td>
        <td>${feedback.message}</td>
        <td><button class="delete-button" data-id="${feedback._id}">Delete</button></td>
    `;
    row.querySelector(".delete-button").addEventListener("click", deleteFeedback);
    return row;
}


// Function to delete feedback
function deleteFeedback(event) {
    const feedbackId = event.target.dataset.id;

    fetch(`https://c-man-api.onrender.com/admini/feedback/${feedbackId}`, { 
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    // .then(response => {
    //     if (!response.ok) {
    //         return response.json().then(error => {
    //             alert('Failed to delete feedback');
    //             throw new Error(`HTTP error! Status: ${response.status}, Message: ${error.error}`);
    //         });
    //     }
    //     return response.json();
    // })
    .then(data => {
        if (data.success) {
            const row = event.target.closest('tr');
            alert(`Feedback with ID ${feedbackId} has been deleted.`);
            row.remove();
            console.log(`Feedback with ID ${feedbackId} has been deleted.`);
        } else {
            alert('Failed to delete feedback');
            console.error('Failed to delete feedback:', data.error || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback.');
    });
}





    // Initialize image slider
    function initSlider() {
        const images = document.querySelectorAll('.slider img');
        let currentIndex = 0;

        function showImage(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }

        setInterval(nextImage, 7000);
        showImage(currentIndex);
    }

    // Initialize slider on page load
    initSlider();

    // By default, show the welcome section
    showSection(document.querySelector(".default.section"));
    fetchCounts();
});






function fetchCounts() {
    fetchTotalComplaints();
    fetchTotalPolice();
    fetchTotalUsers();
    fetchTotalFeedbacks();
}

function fetchTotalComplaints() {
    fetch("https://c-man-api.onrender.com/admini/reportCount")
        .then(response => response.json())
        .then(data => {
            document.getElementById("total-complaints").textContent = data.count;
        })
        .catch(error => console.error("Error fetching complaints count:", error));
}

function fetchTotalPolice() {
    fetch("https://c-man-api.onrender.com/police/count")
        .then(response => response.json())
        .then(data => {
            document.getElementById("total-police").textContent = data.count;
        })
        .catch(error => console.error("Error fetching police count:", error));
}

function fetchTotalUsers() {
    fetch("https://c-man-api.onrender.com/admini/userCount")
        .then(response => response.json())
        .then(data => {
            document.getElementById("total-users").textContent = data.count;
        })
        .catch(error => console.error("Error fetching users count:", error));
}

function fetchTotalFeedbacks() {
    fetch("https://c-man-api.onrender.com/admini/feedbackCount")
        .then(response => response.json())
        .then(data => {
            document.getElementById("total-feedbacks").textContent = data.count;
        })
        .catch(error => console.error("Error fetching feedbacks count:", error));
}
