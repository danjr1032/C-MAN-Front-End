document.getElementById('add-news-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const form = document.getElementById('add-news-form');
    const formData = new FormData(form);
    const headline = document.getElementById('headline').value;
    const image = document.getElementById('image').files[0];
    const content = document.getElementById('content').value;

    formData.append('headline', headline);
    formData.append('image', image);
    formData.append('content', content);

    fetch('http://localhost:7000/admini/addNews', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('News added successfully!');
            form.reset(); // Reset the form
        } else {
            alert('Failed to add news.');
            console.error('Failed to add news:', data.message);
        }
    })
    .catch(error => {
        console.error('Error adding news:', error);
        alert('An error occurred while adding news.');
    });
});