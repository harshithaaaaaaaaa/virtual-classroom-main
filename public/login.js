document.getElementById("loginButton").addEventListener("click", async function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var selectedRole = document.getElementById("role").value;

    try {
        const response = await fetch('http://localhost:8082/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role: selectedRole })
        });
        
        if (response.ok) {
            alert('Login successful');
            // Store username in localStorage
            localStorage.setItem('username', username);
            if (selectedRole === "steacher") {
                window.location.href = "teacher.html";
            } else if (selectedRole === "sstudent") {
                window.location.href = "student.html";
            }
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in. Please try again later.');
    }
});
