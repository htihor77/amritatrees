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


