// const nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   host: "0.0.0.0",
//   port: process.env.PORT,
//   secure: false, // true for 465, false for other ports
  
//   service: 'gmail',
//   auth: {
//     user: 'amritatrees@gmail.com',
//     pass: process.env.AMRITATREES_EMAIL_PASSWORD
//   }
// });

// function send_email_text(to, subject, text){
//   const mailOptions = {
//     from: 'cb.amritatrees@gmail.com',
//     to: to,
//     subject: subject,
//     text: text
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {console.log(error);
//     } else {console.log('Email sent: ' + info.response);}
//   }); 
  
// }


function measureDistance(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}
const num = 123132;
modules.export = {
  measureDistance,num
}