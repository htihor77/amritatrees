function devDisplayCoords(){
  $("#development").innerHTML = "loading...";
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition( (pos)=>{
      $("#development").innerHTML = pos.coords.latitude + "," + pos.coords.longitude;
      $("#accuracy").innerHTML = Math.round(pos.coords.accuracy) + "m inacurracy";
    });
  }
}

// setInterval( ()=>{
//   devDisplayCoords();
// },1000);