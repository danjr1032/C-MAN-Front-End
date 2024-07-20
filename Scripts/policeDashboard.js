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
    fetch("http://localhost:7000/police/complaints", {
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
        <td><button class="delete-button" data-id="${complaint._id}">Delete</button></td>
    `;
    row.querySelector(".delete-button").addEventListener("click", deleteComplaint);
    return row;
}



// Function to delete a complaint
function deleteComplaint(event) {
    const complaintId = event.target.dataset.id;

    fetch(`http://localhost:7000/police/complaints/${complaintId}`, {
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



    

    
    async function loadMissingPersons() {
        try {
            const response = await fetch('http://localhost:7000/police/allMissing');
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
            const response = await fetch('http://localhost:7000/police/criminals');
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

    fetch(`http://localhost:7000/police/criminal/${criminalId}`, {
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
        const response = await fetch('http://localhost:7000/police/addMissing', {
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

    fetch('http://localhost:7000/police/addCriminal', {
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
    fetch("http://localhost:7000/police/count", {
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
    fetch("http://localhost:7000/police/count", {
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
    fetch("http://localhost:7000/police/count", {
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