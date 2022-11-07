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
  const div = document.createElement("div");
  div.innerHTML = "ADDFASDFJASLDKFJASD;LFKJASDKL;FJA;SLDF"
  
    
  
  return div;
}


// ######################################################################################################

function checklocation(){
  let pos = {};
  
  navigator.geolocation.getCurrentPosition( (position)=>{
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  
  let response = fetch('https://amritatrees.glitch.me/checkinglocation', {
    method: 'POST',
    headers: {
      accept: 'application.json',
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(pos),
  })
  .then(res=>res.json())
  .then(data=>{
    console.log(data);
    $("#button").setAttribute("data-distance-count",data.distance);
  });
  
  let result = response.json();
  console.log(result);    
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
  
  
  
  const userPropmt = document.createElement("div");
  userPropmt.id = "userPropmt";
  const promptDiv = createUserPrompt(map);
  
  userPropmt.appendChild(promptDiv);
  map.controls[google.maps.ControlPosition.CENTER].push(userPropmt);
  
  
  
  fetch("https://amritatrees.glitch.me/db?table=trees")
  .then( data => data.json() )
  .then( data => {
    data.forEach( tree => {
    // ###########################################################################
      const coords = tree.coords.split(",")
      const lat = Number(coords[0]);
      const lng = Number(coords[1]);
      
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
      })
      
      marker.addListener("click", () => {
                
      });
      
      marker.setMap(map);
      
    // ########################################################################### 
    })
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
 
  // 10.904444839645889, 76.89907299989305
  // 10.903717134576203, 76.8992274346881
  const mapSize = 7560
  // const mapMarker = new google.maps.Marker({
  //   position: { lat: 10.903717134576203, lng: 76.8992274346881 },map,
  //     icon: {
  //       url: mapIcon,
  //       origin: new google.maps.Point(0, 0),
  //       anchor: new google.maps.Point(mapSize/2, mapSize/2),
  //     },
  // });
  
  setInterval(loop,1000);
}
  
  
const tree_icon_url = "https://amritatrees.sirv.com/treeicon32.png";
// const tree_icon_url = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/treeicon.32png.png?v=1662405399801";
// const transparent = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/transparentlayer.png?v=1664718701490";
const mapIcon = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/amritamap.png?v=1664725171814"
window.initMap = initMap;