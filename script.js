'use strict';
var accessKey = "?client_id=qeQaN2KGdxje3FEzIbsH11uJ70cJNybNgbjiwCH6YnY";
var API = "https://api.unsplash.com/";
var collectionList;

axios.get(this.API + "/collections/featured" + this.accessKey + "&per_page=5")
  .then(response => {
    let ul = document.getElementById("collections-list");
    let i=0;
    collectionList = response.data;    
    for (const iterator of collectionList) {
      ul.innerHTML += `<li onclick="setCollectionsBar(${i})">${iterator.title}</li>`;
      i++;            
    }
  }).catch(console.log)

function setCollectionsBar(i){
  let collectionsValue = document.getElementById("search-collections-value");
  console.log("hello");
  
  collectionsValue.innerHTML=collectionList[i].title;
  collectionsValue.style.color="#050417";
}

function searchButton(){
  
}
