function toggleInventorybar(){
  $("#invbar").classList.toggle('active');
  
  if ( $("#invbar").classList.contains("active") ) fetchInventoryItems();
}




async function fetchInventoryItems(){
  console.log("page loaded");
  const response = await fetch("./inventory?raw=json");
  const jsondata = await response.json();
  console.log(jsondata);

  if(response.ok != true){return;}
  
  const old_data = JSON.parse(localStorage.getItem("inventoryData"));
  
  console.log(old_data.unlocked)
  console.log(jsondata.unlocked)
  const unique_items = getDifference(old_data.unlocked, jsondata.unlocked)
  console.log(unique_items)
  
  localStorage.setItem("inventoryData", JSON.stringify(jsondata) );
  const data = JSON.parse(localStorage.getItem("inventoryData"));
  
  
  $(".cards-container").innerHTML = "";
  data.unlocked.forEach(e=>{
    // console.log(e);
    const card = document.createElement("div");
    card.classList = "card";
    card.innerHTML = `
              <div class="img"><img src="${e.url}"></div>
              <div class="label">${e.tree_name}</div>`
    
    $(".cards-container").appendChild(card);
  })
  
  data.locked.forEach(e=>{
    // console.log(e);
    const card = document.createElement("div");
    card.classList = "card";
    card.style.setProperty("--theme-color","white");
    card.innerHTML = `
              <div class="img"><img src="${e.url}" style="filter: grayscale(100%);"></div>
              <div class="label">???</div>`
    
    $(".cards-container").appendChild(card);
  })
}




function getDifference(array1, array2) {
  return array1.filter(object1 => {
    return !array2.some(object2 => {
      return object1.id === object2.id;
    });
  });
}







// window.addEventListener("DOMContentLoaded", async ()=>{
//   console.log("page loaded");
//   const response = await fetch("./inventory?raw=json");
//   const jsondata = await response.json();
//   console.log(jsondata);

//   if(response.ok != true){return;}
  
//   localStorage.setItem("inventoryData", JSON.stringify(jsondata) );
//   const data = JSON.parse(localStorage.getItem("inventoryData"));
  
  
//   $(".cards-container").innerHTML = "";
//   data.unlocked.forEach(e=>{
//     console.log(e);
//     const card = document.createElement("div");
//     card.classList = "card";
//     card.innerHTML = `
//               <div class="img"><img src="${e.url}"></div>
//               <div class="label">${e.tree_name}</div>`
    
//     $(".cards-container").appendChild(card);
//   })
  
//   data.locked.forEach(e=>{
//     console.log(e);
//     const card = document.createElement("div");
//     card.classList = "card";
//     card.style.setProperty("--theme-color","white");
//     card.innerHTML = `
//               <div class="img"><img src="${e.url}" style="filter: grayscale(100%);"></div>
//               <div class="label">???</div>`
    
//     $(".cards-container").appendChild(card);
//   })
// })