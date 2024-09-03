document.addEventListener("DOMContentLoaded", function() {
    const adminLogin = document.getElementById("admin-login");
    const policeLogin = document.getElementById("police-login");
    const switchToPoliceBtn = document.getElementById("switch-to-police");
    const switchToAdminBtn = document.getElementById("switch-to-admin");

    console.log(adminLogin, policeLogin, switchToPoliceBtn, switchToAdminBtn);

    switchToPoliceBtn.addEventListener("click", function() {
        adminLogin.style.display = "none";
        policeLogin.style.display = "block";
    });

    switchToAdminBtn.addEventListener("click", function() {
        policeLogin.style.display = "none";
        adminLogin.style.display = "block";
    });

    // Handle admin login form submission
    const adminForm = document.getElementById("admin-form");
    adminForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("admin-email").value;
        const password = document.getElementById("admin-password").value;
        console.log("Admin credentials:", { email, password });
        login("admin", { email, password });
    });

    // Handle police login form submission
    const policeForm = document.getElementById("police-form");
    policeForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const badgeNumber = document.getElementById("police-badge").value;
        const password = document.getElementById("police-password").value;
        console.log("Police credentials:", { badgeNumber, password });
        login("police", { badgeNumber, password });
    });

    function login(userType, credentials) {
        const url = userType === "admin" ? "https://c-man-api.onrender.com/admini/login" : "https://c-man-api.onrender.com/police/login";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle successful login
                alert("Login successful!");
                if (userType === "admin") {
                    window.location.href = "adminDashboard.html";
                } else if (userType === "police") {
                    window.location.href = "policeDashboard.html";
                }
            } else {
                // Handle login failure
                alert("Login failed: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    }
});













// <script>
//     document.addEventListener("DOMContentLoaded", function() {
//         const adminLogin = document.getElementById("admin-login");
//         const policeLogin = document.getElementById("police-login");
//         const switchToPoliceBtn = document.getElementById("switch-to-police");
//         const switchToAdminBtn = document.getElementById("switch-to-admin");
    
//         switchToPoliceBtn.addEventListener("click", function() {
//             adminLogin.style.display = "none";
//             policeLogin.style.display = "block";
//         });
    
//         switchToAdminBtn.addEventListener("click", function() {
//             policeLogin.style.display = "none";
//             adminLogin.style.display = "block";
//         });
    
//         // Handle admin login form submission
//         const adminForm = document.getElementById("admin-form");
//         adminForm.addEventListener("submit", function(event) {
//             event.preventDefault();
//             const email = document.getElementById("admin-email").value;
//             const password = document.getElementById("admin-password").value;
//             login("admin", { email, password });
//         });
    
//         // Handle police login form submission
//         const policeForm = document.getElementById("police-form");
//         policeForm.addEventListener("submit", function(event) {
//             event.preventDefault();
//             const badgeNumber = document.getElementById("police-badge").value;
//             const password = document.getElementById("police-password").value;
//             login("police", { badgeNumber, password });
//         });
    
//         function login(userType, credentials) {
//             const url = userType === "admin" ? "https://c-man-api.onrender.com/admini/login" : "https://c-man-api.onrender.com/police/login";
    
//             fetch(url, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(credentials)
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     // Handle successful login
//                     alert("Login successful!");
//                     if (userType === "admin") {
//                         window.location.href = "https://c-man-front-end.vercel.app/adminDashboard.html";
//                     } else if (userType === "police") {
//                         window.location.href = "https://c-man-front-end.vercel.app/policeDashboard.html";
//                     }
//                 } else {
//                     // Handle login failure
//                     alert("Login failed: " + data.message);
//                 }
//             })
//             .catch(error => {
//                 console.error("Error:", error);
//                 alert("An error occurred. Please try again.");
//             });
//         }
//     });
//     </script>
