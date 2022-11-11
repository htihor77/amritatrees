// function devDisplayCoords(){
//   $("#dev").innerHTML = "loading...";
//   if(navigator.geolocation){
//     navigator.geolocation.getCurrentPosition( (pos)=>{
//       $("#dev").innerHTML = pos.coords.latitude + "," + pos.coords.longitude + "<br>" + Math.round(pos.coords.accuracy) + "meters inacurracy";
//     });
//   }
//   // checklocation();
// }

// setInterval( ()=>{
//   devDisplayCoords();
// },1000);

function createUserPrompt(map){
  
  function promptClose(m){
    console.log(m);
  }
  
  
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.justifyContent = "center";
  div.style.alignItems = "center";
  div.style.height = "100%";
  div.innerHTML = `
    <p>ADDFASDFJASLDKFJASD;LFKJASDKL;FJA;SLDF</p>
  `;  
  
  return div;
}


// ######################################################################################################

async function checklocation(pos2){
  let pos = {};
  
  navigator.geolocation.getCurrentPosition( (position)=>{
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: Math.round(position.coords.accuracy)
    };
  
  let response = fetch('https://amritatrees.glitch.me/checkinglocation', {
    method: 'POST',
    headers: {
      accept: 'application.json',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({pos1:pos, pos2: pos2}),
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      $("#button").setAttribute("data-distance-count",data.distance);
      return {distance: data.distance, accuracy: pos.accuracy }
    });   
  });
}  
  
  
  
async function initMap() {
  
  let map = new google.maps.Map(document.getElementById("map"),
    {
      center: { lat: 10.900016808568687, lng: 76.9028589289025 },
      zoom: 20,
      mapId: "661dd2cc98d8e9e2",
      mapTypeId: 'satellite',
    }
  );
  
  map.setOptions({
    // draggable: false, 
    zoomControl: false, 
    // scrollwheel: false, 
    disableDoubleClickZoom: true,
    disableDefaultUI: true,
  });
  
  const allMarkers = [];
  
  const userPropmt = document.createElement("div");
  userPropmt.id = "userPropmt";
  userPropmt.style.display = "none";
  const promptDiv = createUserPrompt(map);
  
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "button";
  closeBtn.style.display = "block";
  closeBtn.style.padding = "15px";
  closeBtn.style.marginLeft = "50%";
  
  closeBtn.addEventListener("click",()=>{
    userPropmt.style.display = "none";
  });
  
  
  userPropmt.appendChild(closeBtn);
  userPropmt.appendChild(promptDiv);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(userPropmt);
  
  
  fetch("https://amritatrees.glitch.me/treedata")
  .then( data => data.json() )
  .then( data => {
    
    data.forEach(item=>{
      const coords = item.coords.split(",")
      const lat = Number(coords[0]);
      const lng = Number(coords[1]);
      
      const iconSize = 100;
      const marker = new google.maps.Marker({
        title: 'shadow',
        position: {lat: lat, lng: lng },
        map,
        icon: {
          url: shadow_url,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(iconSize/2, iconSize/2),
        },
      });
    });
    
    data.forEach( (tree,id) => {
    // ###########################################################################
      const coords = tree.coords.split(",")
      const lat = Number(coords[0]);
      const lng = Number(coords[1]);
      allMarkers.push({lat:lat, lng:lng});
      
      const iconSize = 80;
      let tree_icon = tree.icon || tree_icon_url;
      const marker = new google.maps.Marker({
        title: tree.title,
        position: {lat: lat, lng: lng },
        map,
        icon: {
          url: tree_icon,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(iconSize/2, iconSize/2),
        },
      });
      marker.setAnimation(null);
      
      
      function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( ()=>{
          marker.setAnimation(null);
          },500)
        }
      }
      
      
      
      marker.addListener("click", async () => {
        // userPropmt.style.display = "block";
        console.log("clicked", id);
        toggleBounce();
        let data = await checklocation(allMarkers[id]);
        console.log(data)
        
        marker.setMap(map);
      });
      
      // const shadowMarker = new google.maps.Marker({
      //   title: 'shadow',
      //   position: {lat: lat, lng: lng },
      //   map,
      //   icon: {
      //     url: shadow_url,
      //     scaledSize: new google.maps.Size(iconSize, iconSize),
      //     origin: new google.maps.Point(0, 0),
      //     anchor: new google.maps.Point(iconSize/2, iconSize/2 - 10),
      //   },
      // });
      
    // ########################################################################### 
    });  
    
  });

  
  const loop = () => {
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition( (position)=>{
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // map.setCenter(pos);
      const latlng = new google.maps.LatLng(pos.lat, pos.lng);
      currPosMarker.setPosition(latlng);
    });
    }
  }
  
  
  const currPosMarker = new google.maps.Marker({
    position: { lat: 10.900016808568687, lng: 76.9028589289025 },map,
    icon: "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/currPosMarker.png?v=1661892594255",
    // position: google.maps.ControlPosition.TOP_CENTER,
  });
 
  setInterval(loop,1000);
}
  
  
// const tree_icon_url = "https://amritatrees.sirv.com/treeicon32.png";
const tree_icon_url = "https://cdn.discordapp.com/attachments/1027927070191403189/1039163926702719086/qmark64.png";
const shadow_url = "https://www.transparentpng.com/download/shadow/iuqEeA-shadow-png-pic-controlled-drugs-cabinets-from-pharmacy.png";
// const tree_icon_url = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/treeicon.32png.png?v=1662405399801";
// const transparent = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/transparentlayer.png?v=1664718701490";
const mapIcon = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/amritamap.png?v=1664725171814"
window.initMap = initMap;