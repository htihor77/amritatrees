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
  
  

  // resize markers to fit zoom level
//   google.maps.event.addListener(map, 'zoom_changed', function() {
      
//       const pixelSizeAtZoom0 = 1;
//       const zoom = map.getZoom();
//       let izoom = 20 - zoom;
    
    
    
//       setTimeout( ()=>{
//         console.clear();
//         console.log(zoom,izoom);
//         console.log(mapSize)
//       }, 50)
    
    
    
//       // mapMarker.setIcon(
//       //     new google.maps.MarkerImage(
//       //         mapMarker.getIcon().url, //marker's same icon graphic
//       //         null,//size
//       //         new google.maps.Point(0, 0),
//       //         new google.maps.Point(mapSize/(izoom + 1), mapSize/(izoom + 1) ),
//       //         new google.maps.Size(mapSize, mapSize) //changes the scale
//       //     )
//       // );   
    
//   });
  
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
  
  
//   const mapImage = new google.maps.MarkerImage(
//     mapIcon,
//     new google.maps.Size(4320,4320), //size
//     new google.maps.Point(0, 0), // origin
//     new google.maps.Point(0, 2160 ), // anchor
//     new google.maps.Size(8,8) //scale
//   );
    
//   const mapMarker = new google.maps.Marker({
//     position: new google.maps.LatLng(10.90370935780691, 76.89921211104604),
//     map: map,
//     icon: mapImage //set the markers icon to the MarkerImage
//   });
  
  // setInterval(loop,1000);
}
  
  
const tree_icon_url = "https://amritatrees.sirv.com/treeicon32.png";
// const tree_icon_url = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/treeicon.32png.png?v=1662405399801";
// const transparent = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/transparentlayer.png?v=1664718701490";
const mapIcon = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/amritamap.png?v=1664725171814"
window.initMap = initMap;