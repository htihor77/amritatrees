function devDisplayCoords(){
  $("#dev").innerHTML = "loading...";
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition( (pos)=>{
      $("#dev").innerHTML = pos.coords.latitude + "," + pos.coords.longitude + "<br>" + Math.round(pos.coords.accuracy) + "meters inacurracy";
    });
  }
  // checklocation();
}

setInterval( ()=>{
  devDisplayCoords();
},1000);

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
      // heading:
      // tilt:
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

  const treePoints = [
    ["Center", 10.900016808568687, 76.9028589289025, 80],
    ["Banyan Tree",10.899701,76.903252, 80],
    ["Ficus Elastica",10.899759,76.903345, 80],
    ["Weeping Fig",10.899498,76.903237,80],
    // ["Scared Fig",10.899663,76.907571,80] INCORRECT COORDS
    ["Ficus Microcarpa",10.900323,76.902236,80],
    ["Neem Tree",10.901405,76.902026,80],
    ["Rubber Fig",10.902403,76.901394,80],
    ["Cannon-ball tree",10.902318,76.901079,80]
  ];
  
  fetch("https://amritatrees.glitch.me/rohithtrees")
  .then( data => data.json() )
  .then( data => {
    console.log("Rohith's count:", data.length)
    data.forEach( tree => {
    // ###########################################################################
      const lat = Number(tree.coords.split(",")[0]);
      const lng = Number(tree.coords.split(",")[1]);
      const iconSize = 80
      const marker = new google.maps.Marker({
        title: tree.title,
        position: {lat: lat, lng: lng },
        map,
        icon: {
          url: tree_icon_url,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(iconSize/2, iconSize/2),
        },
      })
      
      const infowindow = new google.maps.InfoWindow({content: tree.title});
      marker.addListener("click", () => {
        if (infowindow) {infowindow.close();}
        infowindow.open({anchor: marker,map,shouldFocus: false,});
      });
      
      marker.setMap(map);
      
    // ########################################################################### 
    })
  });
  
  fetch("https://amritatrees.glitch.me/nandhutrees")
  .then( data => data.json() )
  .then( data => {
    console.log("Nandhu's count:", data.length)
    data.forEach( tree => {
    // ###########################################################################
      const lat = Number(tree.coords.split(",")[0]);
      const lng = Number(tree.coords.split(",")[1]);
      const iconSize = 80
      const marker = new google.maps.Marker({
        title: tree.title,
        position: {lat: lat, lng: lng },
        map,
        icon: {
          url: tree_icon_url,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(iconSize/2, iconSize/2),
        },
      })
      
      const infowindow = new google.maps.InfoWindow({content: tree.title});
      marker.addListener("click", () => {
        if (infowindow) {infowindow.close();}
        infowindow.open({anchor: marker,map,shouldFocus: false,});
      });
      
      marker.setMap(map);
      
    // ########################################################################### 
    })
  });
  
  
  fetch("https://amritatrees.glitch.me/rishitrees")
  .then( data => data.json() )
  .then( data => {
    console.log("Rishi's count:", data.length)
    data.forEach( tree => {
    // ###########################################################################
      const lat = Number(tree.coords.split(",")[0]);
      const lng = Number(tree.coords.split(",")[1]);
      const iconSize = 80
      const marker = new google.maps.Marker({
        title: tree.title,
        position: {lat: lat, lng: lng },
        map,
        icon: {
          url: tree_icon_url,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(iconSize/2, iconSize/2),
        },
      })
      
      const infowindow = new google.maps.InfoWindow({content: tree.title});
      marker.addListener("click", () => {
        if (infowindow) {infowindow.close();}
        infowindow.open({anchor: marker,map,shouldFocus: false,});
      });
      
      marker.setMap(map);
      
    // ########################################################################### 
    })
  });
  
//   for(let i=0; i<treePoints.length ;i++){
//     const tree =  treePoints[i]; 
//     const marker = new google.maps.Marker({
//       title: tree[0],position: { lat: tree[1], lng: tree[2] },map,
//       icon: {
//         url: tree_icon_url,
//         scaledSize: new google.maps.Size(tree[3], tree[3]),
//         origin: new google.maps.Point(0, 0),
//         anchor: new google.maps.Point(tree[3]/2, tree[3]/2),
//       },
//       animation:google.maps.Animation.DROP
//     });
    
//     const infowindow = new google.maps.InfoWindow({
//       content: tree[0],
//     });
    
//     marker.addListener("click", () => {
//       if (infowindow) {infowindow.close();}
//       infowindow.open({
//         anchor: marker,
//         map,
//         shouldFocus: false,
//       });
//     });
    
//     marker.setMap(map);

//   }
  
  const loop = () => {
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition( (position)=>{
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(pos);
      const latlng = new google.maps.LatLng(pos.lat, pos.lng);
      currPosMarker.setPosition(latlng);
    });
    }
  }
  
  const currPosMarker = new google.maps.Marker({
    position: { lat: 10.900016808568687, lng: 76.9028589289025 },map,
    icon:"https://amritatrees.sirv.com/user_marker.png"
  });

  const currPosMarker = new google.maps.Marker({
    position: { lat: 10.900016808568687, lng: 76.9028589289025 },map,
    icon: transparent
  });
  
  // setInterval(loop,1000);
}
  
  
// const tree_icon_url = "https://amritatrees.sirv.com/treeicon32.png";
const tree_icon_url = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/treeicon.32png.png?v=1662405399801";
const transparent = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/transparentlayer.png?v=1664718701490";
window.initMap = initMap;