
function toggleSidebar(){
  $('#sidebar').classList.toggle('active');
  if( $('#sidebar').classList.contains("active") ){
    $("#overlay").style.display = "block";  
  } else {
    $("#overlay").style.display = "none";
  }
}

function clickedOverlay(e){
  $("#overlay").style.display = "none";
  $('#sidebar').classList.remove('active');
}