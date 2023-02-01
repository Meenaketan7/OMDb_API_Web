
// Titles: https://omdbapi.com/?s=thor&page=1&apikey=6dfaca8b
//details: http://www.omdbapi.com/?i=tt3896198&apikey=6dfaca8b

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// fetch the name of the movie with given url
async function loadMovie(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=6dfaca8b`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data);
    if(data.Response == 'True') displayMovieList(data.Search);
}

// use to find the movie in the database
function findMovies(){
    let searchTerm = (movieSearchBox.value.trim());
    //console.log(searchTerm);
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovie(searchTerm);
    }else{
        searchList.classList.add('hide-search-list');
    }
}
// Display the movie list

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let i = 0; i < movies.length; i++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[i].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[i].Poster != "N/A")
            moviePoster = movies[i].Poster;
        else
            moviePoster = "image_not_available.png";
        
        movieListItem.innerHTML =  `
        <div class="search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class="search-item-info">
            <h3>${movies[i].Title}</h3>
            <p>${movies[i].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

// Show the movie details

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie =>{
        // console.log(movie);
        movie.addEventListener('click', async() =>{
            // console.log(movie.dataset.id);

            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&&apikey=6dfaca8b`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });

    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${(details.Poster !="N/A")? details.Poster : "image_not_found"}">
    </div>
    <div class="movie-info">
        <h3 class="movie-title">${details.Title}</h3>
        <ul class="movie-misc-info">
            <li class="year">Year: ${details.Year}</li>
            <li class="rated">Rating: ⭐ ${details.imdbRating}</li>
            <li class="released">released: ${details.Released}</li>
        </ul>
    <p class="genre"><b>Genre: </b>${details.Genre}</p>
    <p class="writer"><b>Writers: </b>${details.Writer}</p>
    <p class="actors"><b>Actors: </b>${details.Actors}</p>
    <p class="plot"><b>Plot: </b> ${details.Plot}</p>
    <p class="language"><b>language: </b>${details.Language}</p>
    <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
})