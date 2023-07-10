const API_KEY = "2f81ce5e5dd84d06b45791647e4231bc";
const URL = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews('Egypt'));

async function fetchNews(query) {
    const res = await fetch(`${URL}${query}&apikey=${API_KEY}`);
    const data = await res.json();
    console.log(data);
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const templateNewsCard = document.getElementById('template-news-card');

    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = templateNewsCard.content.cloneNode(true)
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone)
    });
}


function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img')
    const newsSource = cardClone.querySelector('#news-source')
    const newsDesc = cardClone.querySelector('#news-desc')
    const newsTitle = cardClone.querySelector('#news-title')

    newsDesc.innerHTML = article.description;
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;

    const date = new Date(article.publishedAt).toLocaleString('en-US', {
        timeZone: 'Africa/Cairo', hour12: true
    });

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank")
    })
}

let currSelectedItem = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    currSelectedItem?.classList.remove("active");
    currSelectedItem = navItem;
    currSelectedItem.classList.add("active");
}

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById("search-button");
    const searchText = document.getElementById('search-text');

    searchButton.addEventListener('click', () => {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        onNavItemClick(query.toLowerCase())
    });
});


function reload() {
    window.location.reload()
}