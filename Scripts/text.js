document.addEventListener("DOMContentLoaded", function() {
    const viewComplaintsLink = document.getElementById("view-complaints");
    const viewMissingPersonsLink = document.getElementById("view-missing-persons");
    const logoutLink = document.getElementById("logout");

    const viewComplaintsSection = document.getElementById("view-complaints-section");
    const viewMissingPersonsSection = document.getElementById("view-missing-persons-section");

    viewComplaintsLink.addEventListener("click", function() {
        showSection(viewComplaintsSection);
        loadComplaints();
    });

    viewMissingPersonsLink.addEventListener("click", function() {
        showSection(viewMissingPersonsSection);
        loadMissingPersons();
    });

    logoutLink.addEventListener("click", function() {
        // Implement logout functionality
    });

    function showSection(section) {
        const sections = document.querySelectorAll(".section");
        sections.forEach(sec => sec.style.display = "none");
        section.style.display = "block";
    }

    async function loadComplaints() {
        try {
            const response = await fetch('http://localhost:7000/police/complaints');
            const complaintsData = await response.json();

            const complaintsTable = document.getElementById("complaints-table");
            complaintsTable.innerHTML = '';

            complaintsData.forEach(complaint => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${complaint._id}</td>
                    <td>${complaint.crime}</td>
                    <td>${complaint.location}</td>
                    <td>${complaint.description}</td>
                    <td><img src="${complaint.evidenceUrl}" alt="Evidence" style="width:100px; height:100px;"></td>
                    <td>${complaint.status || 'Pending'}</td>
                    <td><button class="delete-complaint-btn" data-id="${complaint._id}">Delete</button></td>
                `;
                complaintsTable.appendChild(row);
            });

            // Attach event listener to all delete buttons using event delegation
            complaintsTable.querySelectorAll('.delete-complaint-btn').forEach(button => {
                button.addEventListener('click', async function() {
                    const complaintId = button.getAttribute('data-id');
                    await deleteComplaint(complaintId);
                });
            });

        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    }

    async function deleteComplaint(complaintId) {
        try {
            const response = await fetch(`http://localhost:7000/police/complaints/${complaintId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete complaint');
            }

            // Refresh the complaints list after deletion
            loadComplaints();
            alert('Complaint deleted successfully');
        } catch (error) {
            console.error('Error deleting complaint:', error);
        }
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
                    <td><img src="${person.image}" alt="${person.fullname}" style="width:50px; height:50px;"></td>
                    <td>${person.fullname}</td>
                    <td>${person.gender}</td>
                    <td>${person.age}</td>
                    <td>${person.description}</td>
                    <td><button class="delete-missing-person-btn" data-id="${person._id}">Delete</button></td>
                `;
                missingPersonsTable.appendChild(row);
            });

            // Attach event listener to all delete buttons using event delegation
            missingPersonsTable.querySelectorAll('.delete-missing-person-btn').forEach(button => {
                button.addEventListener('click', async function() {
                    const personId = button.getAttribute('data-id');
                    await deleteMissingPerson(personId);
                });
            });

        } catch (error) {
            console.error('Error fetching missing persons:', error);
        }
    }

    async function deleteMissingPerson(personId) {
        try {
            const response = await fetch(`http://localhost:7000/police/missingPersons/${personId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete missing person');
            }

            // Refresh the missing persons list after deletion
            loadMissingPersons();
            alert('Missing person deleted successfully');
        } catch (error) {
            console.error('Error deleting missing person:', error);
        }
    }
});
