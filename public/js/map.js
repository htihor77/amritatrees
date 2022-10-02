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
      zoom: 0,
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
  google.maps.event.addListener(map, 'zoom_changed', function() {
      var pixelSizeAtZoom0 = 8; //the size of the icon at zoom level 0
      var maxPixelSize = 350; //restricts the maximum size of the icon, otherwise the browser will choke at higher zoom levels trying to scale an image to millions of pixels

      var zoom = map.getZoom();
      var relativePixelSize = Math.round(pixelSizeAtZoom0*Math.pow(2,zoom)); // use 2 to the power of current zoom to calculate relative pixel size.  Base of exponent is 2 because relative size should double every time you zoom in

      if(relativePixelSize > maxPixelSize) //restrict the maximum size of the icon
          relativePixelSize = maxPixelSize;

      //change the size of the icon
      mapMarker.setIcon(
          new google.maps.MarkerImage(
              mapMarker.getIcon().url, //marker's same icon graphic
              null,//size
              null,//origin
              null, //anchor
              new google.maps.Size(relativePixelSize, relativePixelSize) //changes the scale
          )
      );        
  });
  
  const currPosMarker = new google.maps.Marker({
    position: { lat: 10.900016808568687, lng: 76.9028589289025 },map,
    icon: tree_icon_url,
    // position: google.maps.ControlPosition.TOP_CENTER,
  });
 
  const mapMarker = new google.maps.Marker({
    position: { lat: 10.90370935780691, lng: 76.89921211104604 },map,
        icon: {
          url: mapIcon,
          // scaledSize: new google.maps.Size(iconSize, iconSize),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 2160),
        },
    // position: google.maps.ControlPosition.TOP_CENTER,
  });
  
  
  // setInterval(loop,1000);
}
  
  
// const tree_icon_url = "https://amritatrees.sirv.com/treeicon32.png";
const tree_icon_url = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/treeicon.32png.png?v=1662405399801";
// const transparent = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/transparentlayer.png?v=1664718701490";
const mapIcon = "https://cdn.glitch.global/9d67ff5c-524b-467b-aa2f-2cb422728542/amritamap.png?v=1664719284202"
window.initMap = initMap;