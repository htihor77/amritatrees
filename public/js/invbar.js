function toggleInventorybar(){
  $("#invbar").classList.toggle('active');
  
  if ( $("#invbar").classList.contains("active") ) fetchInventoryItems();
}




async function fetchInventoryItems(){
  console.log("page loaded");
  const response = await fetch("./inventory?raw=json");
  const respdata = await response.json();
  console.log(respdata);

  if(response.ok != true){return;}
  
  const unlocked = respdata.unlocked;
  const locked = respdata.locked;
  const old_unlocked = JSON.parse(localStorage.getItem("inventoryData")) || [];
  localStorage.setItem("inventoryData", JSON.stringify(unlocked) );
  
  console.log(old_unlocked,unlocked)
  const newly_unlocked = unlocked.filter(({ scientific_name: id1 }) => !old_unlocked.some(({ scientific_name: id2 }) => id2 === id1));
  console.log("new", newly_unlocked)
  
//   console.log(old_data.unlocked)
//   console.log(jsondata.unlocked)
//   const new_data = old_data.unlocked.filter(({ scientific_name: id1 }) => !jsondata.unlocked.some(({ scientific_name: id2 }) => id2 === id1));
//   console.log(new_data)
  
//   localStorage.setItem("inventoryData", JSON.stringify(jsondata.unlocked) );
//   const data = JSON.parse(localStorage.getItem("inventoryData"));
  
  
  
  $(".cards-container").innerHTML = "";
  
  newly_unlocked.forEach(e=>{
    // console.log(e);
    const card = document.createElement("div");
    card.classList = "card";
    card.style.setProperty("--theme-color","#f9c04d");
    card.innerHTML = `
              <div class="img"><img src="${e.url}"></div>
              <div class="label">${e.scientific_name}</div>`
    
    $(".cards-container").appendChild(card);
  })
  
  old_unlocked.forEach(e=>{
    // console.log(e);
    const card = document.createElement("div");
    card.classList = "card";
    card.innerHTML = `
              <div class="img"><img src="${e.url}"></div>
              <div class="label">${e.scientific_name}</div>`
    
    $(".cards-container").appendChild(card);
  })
  locked.forEach(e=>{
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