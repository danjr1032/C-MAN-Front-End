document.addEventListener("DOMContentLoaded", function() {
    const viewComplaintsLink = document.getElementById("view-complaints");
    const addMissingPersonLink = document.getElementById("add-missing-person");
    const viewMissingPersonsLink = document.getElementById("view-missing-persons");
    const addCriminalLink = document.getElementById("add-criminal");
    const viewCriminalsLink = document.getElementById("view-criminals");
    const logoutLink = document.getElementById("logout");

    const defaultSection = document.querySelector(".default");
    const viewComplaintsSection = document.getElementById("view-complaints-section");
    const addMissingPersonSection = document.getElementById("add-missing-person-section");
    const viewMissingPersonsSection = document.getElementById("view-missing-persons-section");
    const addCriminalSection = document.getElementById("add-criminal-section");
    const viewCriminalsSection = document.getElementById("view-criminals-section");

    viewComplaintsLink.addEventListener("click", function() {
        showSection(viewComplaintsSection);
        fetchComplaints();
    });

    addMissingPersonLink.addEventListener("click", function() {
        showSection(addMissingPersonSection);
    });

    viewMissingPersonsLink.addEventListener("click", function() {
        showSection(viewMissingPersonsSection);
        loadMissingPersons();
    });

    addCriminalLink.addEventListener("click", function() {
        showSection(addCriminalSection);
    });

    viewCriminalsLink.addEventListener("click", function() {
        showSection(viewCriminalsSection);
        loadCriminals();
    });

    //LOgout
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        alert("Logged out!");
        window.location.href = "adminPoliceLogin.html";
    });

    function showSection(section) {
        const sections = document.querySelectorAll(".section");
        sections.forEach(sec => sec.style.display = "none");
        section.style.display = "block";
    }

   // Fetch complaints data
   function fetchComplaints() {
    fetch("https://c-man-api.onrender.com/police/complaints", {
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
        <td>${complaint.crime}</td>
        <td>${complaint.location}</td>
        <td>${complaint.description}</td>
        <td><img src="${complaint.evidence}" alt="Evidence" style="width:200px; height:150px;"/></td>
        <td>${complaint.status}</td>
        <td>${complaint.progressReport}</td>
        <td><button class="delete-button" data-id="${complaint._id}">Delete</button></td>
        <td><button class="update-button" data-id="${complaint._id}">Update</button></td>
    `;
    row.querySelector(".delete-button").addEventListener("click", deleteComplaint);
    row.querySelector(".update-button").addEventListener("click", openUpdatePopup);
    return row;
}



// Function to delete a complaint
function deleteComplaint(event) {
    const complaintId = event.target.dataset.id;

    fetch(`https://c-man-api.onrender.com/police/complaints/${complaintId}`, {
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



// Function to open the update popup
function openUpdatePopup(event) {
    const complaintId = event.target.dataset.id;
    console.log('Fetching complaint details for ID:', complaintId);

    const popup = document.getElementById('update-popup');
    document.getElementById('complaintId').value = complaintId;

    // Fetch the current status and progress report
    fetch(`https://c-man-api.onrender.com/police/complaints/${complaintId}`)
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Log the response text for debugging
            return response.text().then(text => {
                console.log('Response text:', text);

                // Check if the response is in JSON format
                if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                    return JSON.parse(text);
                } else {
                    throw new Error(`Expected JSON but got: ${text}`);
                }
            });
        })
        .then(data => {
            if (data.success) {
                const { status, progressReport } = data.complaint;
                document.getElementById('status').value = status;
                document.getElementById('progressReport').value = progressReport || '';
                popup.style.display = 'block';
            } else {
                alert('Failed to fetch complaint details');
                console.error("Failed to fetch complaint:", data.message);
            }
        })
        .catch(error => {
            console.error("Error fetching complaint details:", error);
        });
}


// Function to close the update popup
function closeUpdatePopup() {
    document.getElementById('update-popup').style.display = 'none';
}

// Handle form submission
document.getElementById('update-complaint-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const complaintId = document.getElementById('complaintId').value;
    const status = document.getElementById('status').value;
    const progressReport = document.getElementById('progressReport').value;
    // fetch(`http://localhost:7000/police/complaint/${complaintId}
fetch(`https://c-man-api.onrender.com/police/complaint/${complaintId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, progressReport })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Report updated successfully') {
            // Update the complaint in the table
            updateComplaintRow(complaintId, status, progressReport);
            closeUpdatePopup();
        } else {
            alert('Failed to update complaint');
            console.error("Failed to update complaint:", data.error);
        }
    })
    .catch(error => {
        console.error("Error updating complaint:", error);
    });
});

// Update the row with new data
function updateComplaintRow(complaintId, status, progressReport) {
    const rows = document.querySelectorAll('#complaints-table tr');
    rows.forEach(row => {
        if (row.querySelector('.update-button').dataset.id === complaintId) {
            row.querySelector('td:nth-child(6)').textContent = status;
            row.querySelector('td:nth-child(7)').textContent = progressReport;
        }
    });
}











    
    async function loadMissingPersons() {
        try {
            const response = await fetch('https://c-man-api.onrender.com/police/allMissing');
            const missingPersonsData = await response.json();

            const missingPersonsTable = document.getElementById("missing-persons-table");
            missingPersonsTable.innerHTML = '';

            missingPersonsData.forEach(person => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${person._id}</td>
                    <td><img src="${person.image}" alt="${person.fullname}" style="width:200px; height:150px;"></td>
                    <td>${person.fullname}</td>
                    <td>${person.gender}</td>
                    <td>${person.age}</td>
                    <td>${person.description}</td>
                `;
                missingPersonsTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching missing persons:', error);
        }
    }






    async function loadCriminals() {
        try {
            const response = await fetch('https://c-man-api.onrender.com/police/criminals');
            const criminalsData = await response.json();

            const criminalsTable = document.getElementById("criminals-table");
            criminalsTable.innerHTML = '';

            criminalsData.forEach(criminal => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${criminal._id}</td>
                    <td><img src="${criminal.image}" alt="${criminal.fullname}" style="width:200px; height:150px;"></td>
                    <td>${criminal.fullname}</td>
                    <td>${criminal.DOB}</td>
                    <td>${criminal.gender}</td>
                    <td>${criminal.localGovernment}</td>
                    <td>${criminal.state}</td>
                    <td>${criminal.crime}</td>
                    <td><button class="delete-button" data-id="${criminal._id}">Delete</button></td>
                `;
                row.querySelector(".delete-button").addEventListener("click", deleteCriminal);
    // return row;

                criminalsTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching criminals:', error);
        }
    }
});



// Function to delete a complaint
function deleteCriminal(event) {
    const criminalId = event.target.dataset.id;

    fetch(`https://c-man-api.onrender.com/police/criminal/${criminalId}`, {
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
        if (data.message === 'Criminal deleted successfully') {
            // Remove the Criminal from the table
            const row = event.target.closest("tr");
            alert('Criminal deleted successfully.');
            row.remove();
            console.log(`Criminal with ID ${criminalId} has been deleted.`);
        } else {
            alert('Failed to delete Criminal');
            console.error("Failed to delete Criminal:", data.error || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error deleting Criminal:", error);
    });
}




async function addMissingPerson(event) {
    event.preventDefault(); 

    // Collect form data
    const fullname = document.getElementById('fullname').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('image').files[0]; 

    // Create FormData object to send as multipart/form-data
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('gender', gender);
    formData.append('age', age);
    formData.append('description', description);
    formData.append('image', imageFile);

    console.log('Form Data:', formData);

    try {
        const response = await fetch('https://c-man-api.onrender.com/police/addMissing', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to add missing person: ${errorMessage}`);
        }

        const responseData = await response.json();
        alert("Missing person added successfully");
        console.log('Missing person added successfully:', responseData);
        
        document.getElementById('add-missing-person-form').reset();
    } catch (error) {
        console.error('Error adding missing person:', error);
    }
}

// Attach form submission handler
const addMissingPersonForm = document.getElementById('add-missing-person-form');
addMissingPersonForm.addEventListener('submit', addMissingPerson);





document.getElementById('add-criminal-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('https://c-man-api.onrender.com/police/addCriminal', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert('Criminal added successfully!')
        document.getElementById('add-criminal-form').reset();
        console.log('Criminal added successfully:', data);
    })
    .catch(error => {
        console.error('Failed to add criminal:', error);
    });
});





function fetchCrimeCount() {
    fetch("https://c-man-api.onrender.com/police/count", {
        method: "GET",
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
        document.getElementById("total-crime").textContent = data.count;
    })
    .catch(error => {
        console.error("Error fetching crime count:", error);
    });
}


// Call the function to fetch crime count on page load
document.addEventListener('DOMContentLoaded', fetchCrimeCount());





function fetchCriminalCount() {
    fetch("https://c-man-api.onrender.com/police/count", {
        method: "GET",
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
        document.getElementById("total-criminal").textContent = data.count;
    })
    .catch(error => {
        console.error("Error fetching criminal count:", error);
    });
}

// Call the function to fetch criminal count on page load
document.addEventListener('DOMContentLoaded', fetchCriminalCount());



function missingCount() {
    fetch("https://c-man-api.onrender.com/police/count", {
        method: "GET",
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
        document.getElementById("total-missing-persons").textContent = data.count;
    })
    .catch(error => {
        console.error("Error fetching user count:", error);
    });
}

// Call the function to fetch user count on page load
document.addEventListener('DOMContentLoaded', missingCount());