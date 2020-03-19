'use strict';

var accessKey = "?client_id=qeQaN2KGdxje3FEzIbsH11uJ70cJNybNgbjiwCH6YnY";
var API = "https://api.unsplash.com/";
var collectionList = [];
var loadMoreStack = 0;

function toggleNoResultPanel(mode) {
  let panel = document.getElementById("no-result-panel");
  if (mode) {
    panel.style.display = "block";
  } else
    panel.style.display = "none";
};

function toggleLoadMorePanel(mode) {
  let panel = document.getElementById("load-more");
  if (mode) {
    if (document.getElementById("no-result-panel").style.display == "none" &&
      document.getElementById("error-panel").style.display == "none")
      panel.style.display = "block";
  } else
    panel.style.display = "none";
};

function toggleErrorPanel(mode) {
  let panel = document.getElementById("error-panel");
  if (mode) {
    panel.style.display = "block";
  } else
    panel.style.display = "none";
};
function toggleBusyIndicator(mode) {
  let panel = document.getElementById("busy-indicator");
  if (mode) {
    panel.style.display = "flex";
  } else
    panel.style.display = "none";
};

//fill collections dropdown menu
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
    toggleErrorPanel(true);
    console.log(e);
  })

//collections dropdown menu event
function setCollectionsBar(i) {
  let collectionsValue = document.getElementById("search-collections-value");

  if (i != -1) collectionsValue.innerHTML = collectionList[i].title;
  else collectionsValue.innerHTML = "Collections";
  collectionsValue.style.color = "#050417";
}

//search button and load more button event
function searchButton(beCleaned) {

  toggleNoResultPanel(false);
  toggleErrorPanel(false);

  //if this func called from load more button nothing should be cleaned
  if (beCleaned) {
    loadMoreStack = 0;
    toggleLoadMorePanel(false);
    for (let index = 0; index < 3; index++)
      document.getElementsByClassName("row")[index].innerHTML = "";
  } else {
    loadMoreStack += 3;
  }

  toggleBusyIndicator(true);

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

  //list photos
  for (let index = 1; index <= 3; index++) {
    let response = axios.get(API + "/search/photos" + accessKey + "&query=" + query + collection + "&per_page=5&page=" + (index + loadMoreStack))
    response.then(response => {
      let row = document.getElementsByClassName("row")[index - 1];

      //If no result is found
      console.log(response.data.total);
      
      if (response.data.total <= 3 * loadMoreStack)
        toggleNoResultPanel(true);

      for (const iterator of response.data.results) {
        row.innerHTML += `<a href="${iterator.links.html}"><img src="${iterator.urls.regular}"></a>`
      }

    }).catch(e => {
      toggleErrorPanel(true);
      console.log(e);
    })
    busyCheck++;
  }

  //if all three row are done, remove indicator.
  let handler = setInterval(() => {
    if (busyCheck >= 3) {
      toggleBusyIndicator(false);
      toggleLoadMorePanel(true);
      clearInterval(handler);
    }
  }, 500);
}//end of function searchButton(beCleaned)

//autostart of "Istanbul" Query
searchButton(true);