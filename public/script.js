document.getElementById('feedbackForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    fetch('http://localhost:3000/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseMsg').innerText = data.message;
        document.getElementById('feedbackForm').reset();
    })
    .catch(error => {
        document.getElementById('responseMsg').innerText = 'Error submitting feedback!';
        console.error('Error:', error);
    });
});
