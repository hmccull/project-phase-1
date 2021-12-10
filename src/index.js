// * GLOBAL VARIABLES

const breweryURL = 'https://api.openbrewerydb.org/breweries';

const brewList = document.querySelector('#brew-list');

const stateSelector = document.querySelector('#states');
const typeSelector = document.querySelector('#types');
const cityForm = document.querySelector('#city-form');
const cityInput = document.querySelector('#city-input');

const modal = document.querySelector('#modal');
const span = document.querySelector('.close');
const modalContent = document.querySelector('.modal-content');
const modalText = document.querySelector('.modal-text');

const newBreweryForm = document.querySelector('#new-brewery-form');
const newName = document.querySelector('#new-name');
const newBreweryType = document.querySelector('#new-brewery-type');
const newStreet = document.querySelector('#new-street');
const newCity = document.querySelector('#new-city');
const newState = document.querySelector('#new-state');
const newPostal = document.querySelector('#new-postal-code');
const newCountry = document.querySelector('#new-country');
const newPhone = document.querySelector('#new-phone');
const newWebsite = document.querySelector('#new-website-url');

// * EVENT LISTENERS

document.addEventListener('DOMContentLoaded', (e) => {
    getBrewData();
})

stateSelector.addEventListener('change', handleStateSelect);
typeSelector.addEventListener('change', handleTypeSelect);
cityForm.addEventListener('submit', handleCitySubmit);
cityInput.addEventListener('click', (e) => {
    cityInput.value = ''
})

span.addEventListener('click', handleSpan);

// * FETCH DATA

function getBrewData() {
    fetch(breweryURL)
    .then(res => res.json())
    .then(brewArray => {
        brewArray.forEach(brewObj => {
            renderBrews(brewObj)
        });
    })
}

// * RENDER

function renderBrews(brewObj) {
    const li = document.createElement('li');
    li.addEventListener('click', handleModal);
    li.innerText = brewObj.name;
    li.street = brewObj.street;
    li.city = brewObj.city;
    li.state = brewObj.state;
    li.phone = brewObj.phone;
    brewList.append(li);
}

function renderNothing() {
    const li = document.createElement('li');
    li.innerText = "There's nothing here :(";
    brewList.append(li);
}

// * EVENT HANDLERS

function clearBrewList() {
    while (brewList.firstChild) {
        brewList.removeChild(brewList.firstChild);
    }
}

function handleStateSelect(e) {
    // set var equal to value of state selected
    let stateSelected = e.target.value;
    clearBrewList();
    // reset other forms
    typeSelector.value = 'default-option';
    cityForm.reset();
    // -----------------
    fetch(breweryURL)
    .then(res => res.json())
    .then(brewArray => {
        // iterate and find matching state values 
        brewArray.find(brewObj => {
            if (stateSelected === brewObj.state) {
                renderBrews(brewObj);
            }
        });
    })
}

function handleTypeSelect(e) {
    let typeSelected = e.target.value;
    clearBrewList();
    // reset other forms
    stateSelector.value = 'default-option';
    cityForm.reset();
    // -----------------
    fetch(breweryURL)
    .then(res => res.json())
    .then(brewArray => { 
        filterData(brewArray, typeSelected) 
    });
}

function handleCitySubmit(e) {
    e.preventDefault();
    clearBrewList();
    // reset other forms
    stateSelector.value = 'default-option';
    typeSelector.value = 'default-option';
    // -----------------
    fetch(breweryURL)
    .then(res => res.json())
    .then(brewArray => { filterCity(brewArray) })
}

function handleSpan(e) {
    modal.style.display = 'none';
    while (modalText.firstChild) {
        modalText.removeChild(modalText.firstChild);
    }
}

function handleModal(e) {
    modal.style.display = 'block';
    const clickedLi = e.target;
    const h = document.createElement('h3');
    h.className = 'header';
    h.innerText = `${clickedLi.innerText}`;
    const p = document.createElement('p');
    p.className = 'text';
    p.innerText = `${clickedLi.street} \n${clickedLi.city}, ${clickedLi.state} \n${clickedLi.phone}`;
    modalText.append(h);
    modalText.append(p);
}

// * HELPER FUNCTIONS

function filterData(brewArray, typeSelected) {
    // looks for a brewery object that matches selected brewery type
    let found = brewArray.find(brewObj => {
        return typeSelected === brewObj.brewery_type;
    })
    if (typeof found === 'object') {
        // if matching object is found, carry on!
        brewArray.map(brewObj => {
            if (typeSelected === brewObj.brewery_type) {
                renderBrews(brewObj);
            }
        })
    } else {
        // otherwise, display nothing found
        renderNothing();
    }
}

function filterCity(brewArray) {
    const lowerCaseCityInput = cityInput.value.toLowerCase();
    let found = brewArray.find(brewObj => {
        return lowerCaseCityInput === brewObj.city.toLowerCase();
    })
    if (typeof found === 'object') {
        brewArray.map(brewObj => {
            if (lowerCaseCityInput === brewObj.city.toLowerCase()) {
                renderBrews(brewObj);
            }
        })
    } else {
        renderNothing();
    }
}