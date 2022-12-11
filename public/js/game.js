function createUserTopbar(map){
  const div = document.createElement("div");
  div.classList = "topbar"
  div.innerHTML = `<div class="iconDiv" onclick="closePrompt()"><i class="fas fa-plus" style="transform:rotate(45deg);" title="close"></i></div>`
  return div;
}

function createUserPrompt(map){
  const div = document.createElement("div");
  div.classList = "content";
  return div;
}

function closePrompt(){
  
  document.querySelector("#userPrompt .content").classList.remove("active");
  setTimeout( ()=>{
    document.querySelector("#userPrompt").classList.remove("active");
    document.querySelector(".navbar").classList.add("active");
  },200)
}

async function initMap() {
  const tree_icon_url = "https://cdn.discordapp.com/attachments/1027927070191403189/1039163926702719086/qmark64.png";
  const shadow_url = "https://www.transparentpng.com/download/shadow/iuqEeA-shadow-png-pic-controlled-drugs-cabinets-from-pharmacy.png";
  let map = new google.maps.Map(document.getElementById("map"),{center: { lat: 10.900016808568687, lng: 76.9028589289025 },zoom: 20,mapId: "661dd2cc98d8e9e2",mapTypeId: 'satellite',});
  
  map.setOptions({zoomControl: false, disableDoubleClickZoom: true,disableDefaultUI: true,
    // draggable: false, 
    // scrollwheel: false, 
  });
  
  const allMarkers = [];
  
  const userPrompt = document.createElement("div");userPrompt.id = "userPrompt";
  
  const topbarDiv = createUserTopbar(map);userPrompt.appendChild(topbarDiv);
  const promptDiv = createUserPrompt(map);userPrompt.appendChild(promptDiv);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(userPrompt);
  
  // FETCH TREES  
  const treedata = await fetch("./treedata");
  const TREES_ARRAY = await treedata.json();
  
  // SPANW TREE SHADOWS
  TREES_ARRAY.forEach(item=>{
    const iconSize = 70;
    const coords = item.coords.split(",")
    const lat = Number(coords[0]);const lng = Number(coords[1]);                      
      const marker = new google.maps.Marker({position: {lat: lat, lng: lng },map,icon: {url: shadow_url,scaledSize: new google.maps.Size(iconSize, iconSize),origin: new google.maps.Point(0, 0),anchor: new google.maps.Point(iconSize/2, (iconSize/2) - 1.75),},});
  });
  
  // SPANW TREE (QUESTION MARKS)
  TREES_ARRAY.forEach((tree,id)=>{const coords = tree.coords.split(",")
      const lat = Number(coords[0]);const lng = Number(coords[1]);
      allMarkers.push({lat:lat, lng:lng});
      
      const iconSize = 60;
      const marker = new google.maps.Marker({title: tree.title,position: {lat: lat, lng: lng },map,icon: {url: tree_icon_url,scaledSize: new google.maps.Size(iconSize, iconSize),origin: new google.maps.Point(0, 0),anchor: new google.maps.Point(iconSize/2, iconSize/2),},});
      marker.setAnimation(null);
      function toggleBounce() {if (marker.getAnimation() !== null) {marker.setAnimation(null);} else {marker.setAnimation(google.maps.Animation.BOUNCE);setTimeout( ()=>{marker.setAnimation(null);},500);}}
      
  
      marker.addListener("click", () => {
        const pos2 = allMarkers[id]
        const DISTANCE_THRESHOLD = 10000000;
        userPrompt.classList.add("active");
        document.querySelector(".navbar").classList.remove("active");
        
        // CLICKING MARKER
        // Fetching QUESTION & Checking ANSWER
        window.navigator.geolocation.getCurrentPosition(async (pos1)=>{
          const dist = 0 || measureDistance( pos1.coords.latitude, pos1.coords.longitude, pos2.lat, pos2.lng )
          const ACCURACY = pos1.coords.accuracy;
          
          
          if( dist < DISTANCE_THRESHOLD && pos1.coords.accuracy < DISTANCE_THRESHOLD){
            map.setCenter( { lng: allMarkers[id].lng, lat: allMarkers[id].lat - 0.0001 });
            toggleBounce();
            document.querySelector("#userPrompt .content").classList.add("active");
          }else{
            console.log("cannot ask question");            
            return;
          }
          
          const locationResp = await fetch('./checkinglocation', {method: 'POST',headers: {accept: 'application.json','Content-Type': 'application/json'},body: JSON.stringify({pos1:{lat: pos1.coords.latitude, lng: pos1.coords.longitude}, pos2: pos2}),});
          const data = await locationResp.json();

          const DISTANCE = data.distance;
          const QUIZ_ID = data.quiz_id;
          const QUESTION = data.quiz;
          const OPTIONS = data.options
                          .split(",")
                          .map( (item,id) => {
                            return `<span 
                              class='option noSelect'
                              abcd='${["a","b","c","d"][id]}'
                              onclick='submitAnswer("${QUIZ_ID}","${item}")'>
                              ${item}
                            </span>`
                          })
                          .join("");

          console.log("ask question");
          userPrompt.querySelector(".content").innerHTML = `
            <div id="quiz">
              <span class="qsymbol">Q:</span><span class="qcontent">${QUESTION}<span>
            </div>
            <div id="options" class="noSelect">
              ${OPTIONS}
            </div>
          `;
          
          let max_width = 0;
          let min_height = 999;
          userPrompt.querySelector(".content").classList.add("active");
          document.querySelectorAll(".option").forEach( item => {
            if( item.offsetWidth > max_width){max_width = item.offsetWidth;}
            if( item.offsetHeight < min_height){min_height = item.offsetHeight;}
          });
          document.querySelectorAll(".option").forEach( item => { 
            item.style.width = max_width + "px";
            item.style.height = min_height + "px";
          });
          
          
          
        });
      });
  });
  
  
  
  const loop = () => {
    
    
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition( (position)=>{
      const pos = {lat: position.coords.latitude,lng: position.coords.longitude,};
      const latlng = new google.maps.LatLng(pos.lat, pos.lng);currPosMarker.setPosition(latlng);
      let promptOpen = document.querySelector("#userPrompt").classList.contains("active");
      // if ( !promptOpen )  map.setCenter(pos);
    });}
    
    const date = new Date();
    const day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()]
    let hrs = date.getHours();
    let mins = date.getMinutes();
    const suffix = hrs > 12 ? "pm" : "am";
    hrs = hrs > 12 ? hrs - 12 : "0" + hrs;
    mins = mins > 12 ? mins : "0" + mins;
    
    // document.querySelector(".navbar .textDiv").innerHTML = `
    //   <p>${day}</p>
    //   <p>${hrs}${mins}${suffix}</p>
    // `
    
    document.querySelector(".navbar .textDiv p.day").innerHTML = day
    document.querySelector(".navbar .textDiv p.time .hrs").innerHTML = hrs
    document.querySelector(".navbar .textDiv p.time .mins").innerHTML = mins + "" + suffix;
    
  }
  
  const currPosMarker = new google.maps.Marker({
    position: { lat: 10.900016808568687, lng: 76.9028589289025 },map,
    icon: "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/currPosMarker.png?v=1661892594255",
    // position: google.maps.ControlPosition.TOP_CENTER,
  });
 
  setInterval(loop,1000);
}

window.initMap = initMap;

async function submitAnswer(q,ans){
  await setTimeout( async ()=>{
    
    document.querySelector("#userPrompt .content").classList.remove("active");
    let res = await fetch("./checkinganswer",{method: 'POST',headers: {accept: 'application.json','Content-Type': 'application/json'},body: JSON.stringify({q:q, ans:ans})});
  
    let data = await res.json();
    console.log(data)
    const msg = document.createElement("p");
    if(data.correct){
      console.log("correct");
      confetti();
      confetti();
      document.querySelector("#userPrompt").classList.remove("active");
      document.querySelector(".navbar").classList.add("active");
      msg.innerText = "You unlocked a new tree!";
      
    } else {
      console.log("not correct");
      navigator.vibrate([250,50,250]);
      document.querySelector("#userPrompt").classList.remove("active");
      document.querySelector(".navbar").classList.add("active");
      msg.innerText = "Incorrect answer ☹!";
      
    }
    
    $("#actionbar").appendChild(msg)
    setTimeout( () =>{
      msg.remove();
    },5000)
    
    
  },500);
}

function measureDistance(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}



