const API_KEY = "a7d7d755ff22445ab6f87facb98ff453";
const URL = "https://newsapi.org/v2/everything?q=";

let currQuery = null;
let bookmarks = [];
let counter = 0;
let validArticles = [];

window.addEventListener('load', () => fetchNews('Egypt', ""));

async function fetchNews(query, filterQuery) {
    currQuery = query;
    let res;
    if (query === "bookmarks") {
        bindDataBookmarks(bookmarks)
        const filter = document.getElementById('filter-div');
        filter.style.display = 'none';
    }
    else {

        const filter = document.getElementById('filter-div');
        filter.style.display = 'block';

        if (filter === "" || filter === null) {
            res = await fetch(`${URL}${query}&apikey=${API_KEY}`);
        }
        else {
            res = await fetch(`${URL}${query}&apikey=${API_KEY}&sortBy=${filterQuery}`);
        }

        const data = await res.json();

        bindData(data.articles)
    }

    counter = 0;
}


function bindDataBookmarks(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const templateNewsCard = document.getElementById('template-news-card');

    cardsContainer.innerHTML = "";


    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = templateNewsCard.content.cloneNode(true)
        if ((bookmarks.find((element) => article.url === element.url))) {
            let bookmarkIcon = cardClone.querySelector('.bookmark-icon')
            bookmarkIcon.setAttribute('src', "assets/bookmark1.png");
        }
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone)
    });
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const templateNewsCard = document.getElementById('template-news-card');

    cardsContainer.innerHTML = "";
    validArticles = [];

    articles.forEach(article => {
        if (!article.urlToImage) return;
        validArticles.push(article);
        const cardClone = templateNewsCard.content.cloneNode(true)
        if ((bookmarks.find((element) => article.url === element.url))) {
            let bookmarkIcon = cardClone.querySelector('.bookmark-icon')
            bookmarkIcon.setAttribute('src', "assets/bookmark1.png");
        }
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone)
    });
}


function fillDataInCard(cardClone, article) {
    const card = cardClone.querySelector('.card')
    const newsImg = cardClone.querySelector('#news-img')
    const newsSource = cardClone.querySelector('#news-source')
    const newsDesc = cardClone.querySelector('#news-desc')
    const newsTitle = cardClone.querySelector('#news-title')
    const bookmarkIcon = cardClone.querySelector('.bookmark-icon')

    card.setAttribute('id', `${counter}`);
    bookmarkIcon.setAttribute('id', `${counter}`);
    counter = counter + 1
    newsDesc.innerHTML = article.description;
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;

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
    fetchNews(id, ``);
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

function handelBookmark(event) {
    event.stopPropagation()
    let id;
    if (currQuery === "bookmarks") {
        if (event.target.attributes[0].nodeValue === "assets/bookmark1.png") {
            id = event.target.attributes['id'].nodeValue
            const newBookmarks = bookmarks.filter(element => element.url !== bookmarks[id].url);
            bookmarks = newBookmarks;
            fetchNews(currQuery)
        }
    }
    else {
        id = event.target.attributes['id'].nodeValue

        if (event.target.attributes[0].nodeValue === "assets/bookmark1.png") {
            event.target.attributes[0].nodeValue = "assets/bookmark.png"
            bookmarks = bookmarks.filter(element => element.url !== validArticles[id].url);
        }
        else if (event.target.attributes[0].nodeValue = "assets/bookmark.png") {
            event.target.attributes[0].nodeValue = "assets/bookmark1.png"
            bookmarks.push(validArticles[id])
        }
    }
    console.log(bookmarks)
}
