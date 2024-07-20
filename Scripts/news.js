document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});

function fetchNews() {
    fetch('https://c-man-api.onrender.com/user/news', { // Adjust the URL to your actual endpoint
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const newsContainer = document.getElementById('news-container');
        data.forEach(newsItem => {
            const newsCard = createNewsCard(newsItem);
            newsContainer.appendChild(newsCard);
        });
    })
    .catch(error => {
        console.error('Error fetching news:', error);
    });
}

function createNewsCard(newsItem) {
    const card = document.createElement('div');
    card.className = 'news-card';

    const headline = document.createElement('h3');
    headline.textContent = newsItem.headline;
    card.appendChild(headline);

    const image = document.createElement('img');
    image.src = newsItem.image; // Ensure your API returns the correct image path
    image.alt = newsItem.headline;
    card.appendChild(image);

    const content = document.createElement('p');
    content.textContent = newsItem.content;
    card.appendChild(content);

    return card;
}
