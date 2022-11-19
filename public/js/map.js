function createUserPrompt(map){
  
  function promptClose(m){console.log(m);}

  const div = document.createElement("div");
  div.classList = "content";
  // div.onscroll = (e)=>{
    // const ele = e.path[0]
    // console.log("scrolling",ele.scrollTop)
    // document.getElementById("userPropmt").style.height = "calc( 25% + " + ele.scrollTop + "px )";
  // }
  div.innerHTML = `
    <!-- <span class="randomBar"></span> -->
    <div class="question"><span class="qsymbol">Q: </span><span class="qcontent">asdhfk jhdsakljfh asdkjfh akdshf askldjhf lakjsdhf lakdhfalkh ajksh klads kljah kahs<span></div>
    
    <div class="optionsWrapper">
      <span class='ques_options noSelect' abcd='a'>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbb</span>
      <span class='ques_options noSelect' abcd='b'>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaccccccccccc</span>
      <span class='ques_options noSelect' abcd='c'>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaddddddddddddd</span>
      <span class='ques_options noSelect' abcd='d'>aaaaaaaaaaaaaaaaaaaaaaaeeeeeeeeeeeeeeeeeeee</span>
    </div>
    
  `;  
  
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
  
  
async function submitAnswer(q,ans){
    $("#userPrompt").classList.remove("active");
    document.getElementById("loader").style.display = "block";
    let res = await fetch("./checkinganswer",
      {
        method: 'POST',
        headers: {accept: 'application.json','Content-Type': 'application/json'},
        body: JSON.stringify({q:q, ans:ans})
      });
  
    let data = await res.json();
    console.log(data)
    if(data.correct){
      document.getElementById("loader").style.backgroundImage = "url('https://image.similarpng.com/very-thumbnail/2021/12/Green-check-mark-on-transparent-background-PNG.png')";
    } else {
      document.getElementById("loader").style.backgroundImage = "url('https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png')";
    } 
  
    setTimeout(()=>{
      document.getElementById("loader").style.display = "none";
    },1500);
  
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
  
  const userPrompt = document.createElement("div");
  userPrompt.id = "userPrompt";
  // userPrompt.style.opacity = 1;
  const promptDiv = createUserPrompt(map);
  
  userPrompt.addEventListener("pointerdown",(e)=>{
    if(e.path[0].id == "userPrompt"){
      // userPrompt.style.opacity = 0;
      userPrompt.classList.remove("active");
    }
  });
  
  // const loader = document.createElement("div");
  // loader.id = "loader";
  // loader.style.display = "none";
  // userPrompt.appendChild(loader);
  
  
  
  userPrompt.appendChild(promptDiv);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(userPrompt);
  
  
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
        // userPrompt.style.opacity = 1;
        userPrompt.classList.add("active");
        console.log("clicked", id);
        toggleBounce();
        
        map.setCenter(allMarkers[id])
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
            userPrompt.querySelector(".content").innerHTML = `<!-- <span class="randomBar"></span> -->`;
            
            if(data.distance < 300 && data.accuracy < 100 || true){
              
              const quiz = document.createElement("div");
              quiz.innerHTML = `<span class="qsymbol">Q:</span><span class="qcontent">${data.quiz}<span>`;
              quiz.classList = "question noSelect"
              const q_id = data.quiz_id;
              
              const options = document.createElement("div");
              options.classList = "optionsWrapper noSelect";
              const q_opts = data.options.split(",");
              let optsContent = ""
              
              const prefix = ["a","b","c","d"];
              q_opts.forEach((item,id)=>{
                optsContent += `<span class='ques_options noSelect' onclick='submitAnswer(${q_id},"${item}")' abcd='${prefix[id]}'>${item}</span>`;
              })
              
              options.innerHTML = `${optsContent}`; 
                            
              userPrompt.querySelector(".content").appendChild(quiz)
              userPrompt.querySelector(".content").appendChild(options)
              
            }else{
              userPrompt.querySelector(".content").innerHTML = `<p> distance: ${data.distance} <br> accuracy: ${data.accuracy}</p>`;
            }
            
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