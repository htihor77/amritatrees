const zipperOpenSnd0 = new Audio("https://cdn.discordapp.com/attachments/1055426492659675167/1055434142420054016/zipper_open.mp3")
const zipperCloseSnd0 = new Audio("https://cdn.discordapp.com/attachments/1055426492659675167/1055434191090761798/zipper_close.mp3")

function addMarkerTag(){
  console.log("add new marker")
  $("#marker_prompt").classList.add('active');
  if ($("#soundCB").checked) zipperOpenSnd0.play();

}

function closeMarkerPrompt(){
  $("#marker_prompt").classList.remove('active');
  if ($("#soundCB").checked) zipperCloseSnd0.play();
}
