const API_KEY = "a7d7d755ff22445ab6f87facb98ff453";
const URL = "https://newsapi.org/v2/everything?q=";

let currQuery = null;

window.addEventListener('load', () => fetchNews('Egypt', ""));

async function fetchNews(query, filter) {
    currQuery = query;
    let res;
    let url;
    if (filter === "" || filter === null) {
        res = await fetch(`${URL}${query}&apikey=${API_KEY}`);
        url = `${URL}${query}&apikey=${API_KEY}`
    }
    else {
        res = await fetch(`${URL}${query}&apikey=${API_KEY}&sortBy=${filter}`);
        url = `${URL}${query}&apikey=${API_KEY}&sortBy=${filter}`
    }

    const data = await res.json();
    console.log(data);
    console.log(url);
    bindData(data.articles, filter)
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


    // "MM/DD/YYYY, HH:MM:SS AM/PM"
    // const date = new Date(article.publishedAt).toLocaleString('en-US', {
    //     timeZone: 'Africa/Cairo', hour12: true
    // });

    // "DD/MM/YYYY, HH:MM:SS AM/PM" 
    const publishedDate = new Date(article.publishedAt);
    const day = publishedDate.getDate().toString().padStart(2, '0');
    const month = (publishedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = publishedDate.getFullYear().toString();
    let hours = publishedDate.getHours();
    const minutes = publishedDate.getMinutes().toString().padStart(2, '0');
    const seconds = publishedDate.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    const date = `${day}/${month}/${year}, ${formattedTime}`;

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank")
    })
}

let currSelectedItem = null;
function onNavItemClick(id) {
    fetchNews(id, '');
    let filter = document.getElementById("filters");
    filter.value = ""
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


function handelFilters(event) {
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
    fetchNews(currQuery, selectedOption.value)
}