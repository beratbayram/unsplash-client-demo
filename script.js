'use strict';

var accessKey = "?client_id=qeQaN2KGdxje3FEzIbsH11uJ70cJNybNgbjiwCH6YnY";
var API = "https://api.unsplash.com/";
var collectionList = [];
var loadMoreStack = 0;

function switchNoResultPanel(mode) {
  let panel = document.getElementById("no-result-panel");
  if (mode) {
    panel.style.display = "block";
  } else
    panel.style.display = "none";
};

function displayLoadMorePanel(mode) {
  let panel = document.getElementById("load-more");
  if (mode) {
    if (document.getElementById("no-result-panel").style.display == "none" &&
      document.getElementById("error-panel").style.display == "none")
      panel.style.display = "block";
  } else
    panel.style.display = "none";
};

function switchErrorPanel(mode) {
  let panel = document.getElementById("error-panel");
  if (mode) {
    panel.style.display = "block";
  } else
    panel.style.display = "none";
};

axios.get(API + "/collections/featured" + accessKey + "&per_page=4")
  .then(response => {
    let ul = document.getElementById("collections-list");
    let i = 0;
    collectionList = response.data;
    for (const iterator of collectionList) {
      ul.innerHTML += `<li onclick="setCollectionsBar(${i})">${iterator.title}</li>`;
      i++;
    }
  }).catch(e => {
    switchErrorPanel(true);
    console.log(e);
  })

//collections menu dropdown event
function setCollectionsBar(i) {
  let collectionsValue = document.getElementById("search-collections-value");

  if (i != -1) collectionsValue.innerHTML = collectionList[i].title;
  else collectionsValue.innerHTML = "Collections";
  collectionsValue.style.color = "#050417";
}

//search button and load more button event
function searchButton(beCleaned) {

  switchNoResultPanel(false);
  switchErrorPanel(false);

  if (beCleaned) {
    loadMoreStack = 0;
    displayLoadMorePanel(false);
    for (let index = 0; index < 3; index++)
      document.getElementsByClassName("row")[index].innerHTML = "";
  } else {
    loadMoreStack += 3;
  }

  let busyIndicator = document.getElementById("busy-indicator");
  busyIndicator.style.display = "flex";

  let query = document.getElementById("search-box").value;
  let collection = document.getElementById("search-collections-value").innerText;
  let busyCheck = 0; //busy-indicator control variable

  //Turn collection names to ids
  for (const iterator of collectionList)
    if (collection == iterator.title) {
      collection = iterator.id
      break;
    }

  //to allow search without collections
  collection = (collection == "Collections") ? "" : "&collections=" + collection;

  for (let index = 1; index <= 3; index++) {
    let response = axios.get(API + "/search/photos" + accessKey + "&query=" + query + collection + "&per_page=5&page=" + (index + loadMoreStack))
    response.then(response => {
      let row = document.getElementsByClassName("row")[index - 1];

      //If no result is found
      if (response.data.total == 0)
        switchNoResultPanel(true);

      for (const iterator of response.data.results) {
        row.innerHTML += `<a href="${iterator.links.html}"><img src="${iterator.urls.regular}"></a>`
      }

      busyCheck++;
    }).catch(e => {
      switchErrorPanel(true);
      console.log(e);
      busyCheck++;
    })
  }

  //if all three row are done, remove indicator.
  let handler = setInterval(() => {
    if (busyCheck >= 3) {
      busyIndicator.style.display = "none";
      displayLoadMorePanel();
      clearInterval(handler);
    }
  }, 500);


}

searchButton(true);