// discussion.js

document.getElementById('ia1').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = {
        cid: form.elements.cid.value,
        message: form.elements.message.value,
        user_id: form.elements.user_id.value
    };
    
    try {

        const response = await fetch('http://localhost:3103/submit_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            console.log('Form submitted successfully');
            alert('Message sent');
            form.reset();
            console.log('Redirecting to next page...');
            window.location.href = './disscussionT.html'; // Redirect the user
        } else {
            console.error('Error submitting form');
            alert('Error submitting form');
        }
    } catch (error) {
        console.error('Error retrieving user ID:', error);
        alert('Error retrieving user ID: ' + error.message);
    }
});

