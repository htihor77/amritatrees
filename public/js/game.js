function createUserPrompt(map){
  function promptClose(m){console.log("close prompt",m);}
  const div = document.createElement("div");
  div.classList = "content";
  div.innerHTML = `
    <!-- <span class="randomBar"></span> -->
    <div class="question"><span class="qsymbol">Q: </span><span class="qcontent">asdhfk jhdsakljfh asdkjfh akdshf askldjhf lakjsdhf lakdhfalkh ajksh klads kljah kahs<span></div>
    <div class="optionsWrapper">
      <span class='ques_options noSelect' abcd='a'>aaaaaaaaaaa</span>
      <span class='ques_options noSelect' abcd='b'>aaaaaaaaaaa</span>
      <span class='ques_options noSelect' abcd='c'>aaaaaaaaaaa</span>
      <span class='ques_options noSelect' abcd='d'>aaaaaaaaaaa</span>
    </div>
  `;  
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
  
  
  
  
  
  
  
  
  
  
  
  const loop = () => {
    if(navigator.geolocation){navigator.geolocation.getCurrentPosition( (position)=>{
      const pos = {lat: position.coords.latitude,lng: position.coords.longitude,};
      // map.setCenter(pos);
      const latlng = new google.maps.LatLng(pos.lat, pos.lng);currPosMarker.setPosition(latlng);
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