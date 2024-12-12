document.getElementById('ia2').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = {
        susername: form.elements.susername.value,
        spassword: form.elements.spassword.value,
        con_password: form.elements.con_password.value,
        srole: form.elements.srole.value
    };

    // Log the formData object to inspect the selected role value
    console.log('Form data:', formData);

    try {
        const response = await fetch('http://localhost:8083/submit_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            console.log('Form submitted successfully');
            alert('Signup successful. Login again to continue');
            form.reset();
            console.log('Redirecting to next page...');
            window.location.href = 'login.html';
        } else {
            console.error('Error submitting form');
            alert('Error submitting form');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form');
    }
});
