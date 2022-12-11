function toggleInventorybar(){
  $("#invbar").classList.toggle('active');
  fetchInventoryItems();
}




async function fetchInventoryItems(){
  console.log("page loaded");
  const response = await fetch("./inventory?raw=json");
  const jsondata = await response.json();
  console.log(jsondata);

  if(response.ok != true){return;}
  
  localStorage.setItem("inventoryData", JSON.stringify(jsondata) );
  const data = JSON.parse(localStorage.getItem("inventoryData"));
  
  
  $(".cards-container").innerHTML = "";
  data.unlocked.forEach(e=>{
    console.log(e);
    const card = document.createElement("div");
    card.classList = "card";
    card.innerHTML = `
              <div class="img"><img src="${e.url}"></div>
              <div class="label">${e.tree_name}</div>`
    
    $(".cards-container").appendChild(card);
  })
  
  data.locked.forEach(e=>{
    console.log(e);
    const card = document.createElement("div");
    card.classList = "card";
    card.style.setProperty("--theme-color","white");
    card.innerHTML = `
              <div class="img"><img src="${e.url}" style="filter: grayscale(100%);"></div>
              <div class="label">???</div>`
    
    $(".cards-container").appendChild(card);
  })
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