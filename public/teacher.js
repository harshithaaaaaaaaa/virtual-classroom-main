document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ia1');
    if (form) { // Check if the form exists
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            var formData = new FormData(form);
            var courseTitle = formData.get('title');
            var courseDesc = formData.get('descr');
            var courseCode = formData.get('cid');

            // Update elements in upload.html if they exist
            var titleElement = document.getElementById('courseTitle');
            var descElement = document.getElementById('courseDesc');
            var codeElement = document.getElementById('courseCode');

            if (titleElement && descElement && codeElement) {
                titleElement.innerText = courseTitle;
                descElement.innerText = courseDesc;
                codeElement.innerText = courseCode;
            } else {
                console.error("One or more elements not found.");
            }
        });
    }
});
