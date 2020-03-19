'use strict';

var accessKey = "?client_id=qeQaN2KGdxje3FEzIbsH11uJ70cJNybNgbjiwCH6YnY";
var API = "https://api.unsplash.com/";
var collectionList = [];

axios.get(API + "/collections/featured" + accessKey + "&per_page=4")
  .then(response => {
    let ul = document.getElementById("collections-list");
    let i = 0;
    collectionList = response.data;
    for (const iterator of collectionList) {
      ul.innerHTML += `<li onclick="setCollectionsBar(${i})">${iterator.title}</li>`;
      i++;
    }
  }).catch(console.log)

function setCollectionsBar(i) {
  let collectionsValue = document.getElementById("search-collections-value");

  if (i != -1) collectionsValue.innerHTML = collectionList[i].title;
  else collectionsValue.innerHTML = "Collections";
  collectionsValue.style.color = "#050417";
}

function switchErrorPanel(mode) {
  let errorPanel = document.getElementById("error-panel");
  if (mode)
    errorPanel.style.display = "block";
  else
    errorPanel.style.display = "none";

};

function searchButton() {

  switchErrorPanel(false);
  for (let index = 0; index < 3; index++)
    document.getElementsByClassName("row")[index].innerHTML = "";

  let busyIndicator = document.getElementById("busy-indicator");
  busyIndicator.style.display = "block";


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
    let response = axios.get(API + "/search/photos" + accessKey + "&query=" + query + collection + "&per_page=5&page=" + index)
    response.then(response => {
      let row = document.getElementsByClassName("row")[index - 1];

      //If no result is found
      if (response.data.total == 0)
        switchErrorPanel(true);

      for (const iterator of response.data.results) {
        row.innerHTML += `<a href="${iterator.links.html}"><img src="${iterator.urls.regular}"></a>`
      }
      busyCheck++;
    }).catch(console.log)
  }
  //
  let handler = setInterval(() => {
    //if all three row are done, remove indicator.
    if (busyCheck >= 3) {
      busyIndicator.style.display = "none";
      clearInterval(handler);
    }
  }, 500);
}

searchButton();