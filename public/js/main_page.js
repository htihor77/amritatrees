function set_map_x(e){$("#map").style.left = "-" + e + "px";}
function set_map_y(e){$("#map").style.top = "-" + e + "px";}



function bellClicked(e){
  e.classList.toggle("active");
  $("#quest").classList.remove("active");
  toggleDropdownContainer()
}

function questsClicked(e){
  e.classList.toggle("active");
  $("#bell").classList.remove("active");
  toggleDropdownContainer()
}

function toggleDropdownContainer(){
  if( $("#bell").classList.contains("active") || $("#quest").classList.contains("active")){
    $("#dropdown-container").style.display = "block";
  }else{
    $("#dropdown-container").style.display = "none";
  }
}

function devDisplayCoords(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition( (pos)=>{
       $("#development").innerHTML = pos.coords.latitude + "," + pos.coords.longitude + "()";
    });
  }
}