function toggleInventorybar(){
  $('#invbar').classList.toggle('active');
  if( $('#invbar').classList.contains("active") ){
    $("#overlay").style.display = "block";  
  } else {
    $("#overlay").style.display = "none";
  }
}