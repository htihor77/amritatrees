function createUserPrompt(map){
  
  function promptClose(m){console.log(m);}

  const div = document.createElement("div");
  div.classList = "content";
  // div.style.display = "flex";
  // div.style.justifyContent = "center";
  // div.style.alignItems = "center";
  // div.style.height = "100%";
  div.innerHTML = ``;  
  
  return div;
}


// ######################################################################################################


async function checklocation(pos2){
    console.log(pos2)
    let res = await fetch("./checkinglocation",
      {method: 'POST',headers: {accept: 'application.json','Content-Type': 'application/json'},
        body: JSON.stringify({pos1:location, pos2: pos2})});
  
    let data = await res.json();
    return data
}
  
  
async function initMap() {
  const tree_icon_url = "https://cdn.discordapp.com/attachments/1027927070191403189/1039163926702719086/qmark64.png";
  const shadow_url = "https://www.transparentpng.com/download/shadow/iuqEeA-shadow-png-pic-controlled-drugs-cabinets-from-pharmacy.png";
  
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
  
  
  const treeDataResp = await fetch("./treedata");
  const treedata = await treeDataResp.json();
  
  treedata.forEach(item=>{const coords = item.coords.split(",")
      const lat = Number(coords[0]);const lng = Number(coords[1]);
                          
      const iconSize = 70;
      const marker = new google.maps.Marker({
        position: {lat: lat, lng: lng },map,
        icon: {
          url: shadow_url,
          scaledSize: new google.maps.Size(iconSize, iconSize),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(iconSize/2, (iconSize/2) - 1.75),
        },
      });

  });
  
  treedata.forEach((tree,id)=>{const coords = tree.coords.split(",")
      const lat = Number(coords[0]);const lng = Number(coords[1]);
      allMarkers.push({lat:lat, lng:lng});
      
      const iconSize = 60;
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
      });
      marker.setAnimation(null);
      
      function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout( ()=>{marker.setAnimation(null);},500);
        }
      }
      
      marker.addListener("click", () => {
        userPropmt.style.display = "block";
        console.log("clicked", id);
        toggleBounce();
        
        const pos2 = allMarkers[id];
        // console.log(pos2)

        // ###########################################
        
        window.navigator.geolocation.getCurrentPosition((pos1)=>{
          
          
          fetch('./checkinglocation', {
              method: 'POST',
              headers: {
                accept: 'application.json',
                  'Content-Type': 'application/json'
                },
              body: JSON.stringify({pos1:{lat: pos1.coords.latitude, lng: pos1.coords.longitude, accuracy: pos1.coords.accuracy}, pos2: pos2}),
          })
          .then(res=>res.json())
          .then((data)=>{
            
            console.log(data);
            // userPropmt.querySelector(".content").innerHTML = `<p> distance: ${data.distance} <br> accuracy: ${data.accuracy}</p>`;
          })
          
        }); // navigator end
        
        // ###########################################

        marker.setMap(map);
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

window.initMap = initMap;