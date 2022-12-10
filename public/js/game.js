function createUserPrompt(map){
  function promptClose(m){console.log("close prompt",m);}
  const div = document.createElement("div");
  div.classList = "content";
  // div.innerHTML = `
  //   <!-- <span class="randomBar"></span> -->
  //   <div class="question"><span class="qsymbol">Q: </span><span class="qcontent">asdhfk jhdsakljfh asdkjfh akdshf askldjhf lakjsdhf lakdhfalkh ajksh klads kljah kahs<span></div>
  //   <div class="optionsWrapper">
  //     <span class='ques_options noSelect' abcd='a'>aaaaaaaaaaa</span>
  //     <span class='ques_options noSelect' abcd='b'>aaaaaaaaaaa</span>
  //     <span class='ques_options noSelect' abcd='c'>aaaaaaaaaaa</span>
  //     <span class='ques_options noSelect' abcd='d'>aaaaaaaaaaa</span>
  //   </div>
  // `;
  div.innerHTML = `
    hey
    <br>
    sup
    <br>
    i wanna die
    <br>
    lol
  `
  return div;
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
        const DISTANCE_THRESHOLD = 300;
        userPrompt.classList.add("active");
        
        window.navigator.geolocation.getCurrentPosition(async (pos1)=>{
          const dist = measureDistance( pos1.coords.latitude, pos1.coords.longitude, pos2.lat, pos2.lng )
          const ACCURACY = pos1.coords.accuracy;
          
          if( dist < DISTANCE_THRESHOLD && pos1.coords.accuracy < DISTANCE_THRESHOLD){
            map.setCenter(allMarkers[id]);
            toggleBounce();
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
                              abcd='${ ["a","b","c","d"][id] }'>
                              ${item}
                            </span>`
                          })
                          .join("");

          console.log("ask question");
          userPrompt.querySelector(".content").innerHTML = `
            <div id="quiz">
              <span class="qsymbol">Q:</span><span class="qcontent">${QUESTION}<span>
            </div>
            <div id="options">
              ${OPTIONS}
            </div>
          `;
          
        });
      });
  });
  
  
  
  const loop = () => {
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition( (position)=>{
      const pos = {lat: position.coords.latitude,lng: position.coords.longitude,};
      const latlng = new google.maps.LatLng(pos.lat, pos.lng);currPosMarker.setPosition(latlng);
      let promptOpen = document.querySelector("#userPrompt").classList.contains("active");
      if ( !promptOpen )  map.setCenter(pos);
  });}}
  
  const currPosMarker = new google.maps.Marker({
    position: { lat: 10.900016808568687, lng: 76.9028589289025 },map,
    icon: "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/currPosMarker.png?v=1661892594255",
    // position: google.maps.ControlPosition.TOP_CENTER,
  });
 
  setInterval(loop,1000);
}

window.initMap = initMap;

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