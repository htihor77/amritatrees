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


// module.export = {
//   send_email_text
// }