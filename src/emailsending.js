let nodemailer = require("nodemailer");
const fs = require('fs')
const path = require('path');

async function GetCredentials(){  
  const credentialsPath = path.join(__dirname,"..","/credentials.json")
  return new Promise(function(resolve, reject) {
      fs.readFile(credentialsPath, 'utf8' , (err, data) => {
          if (err) {
              console.error(err)
              return reject(err)
          }
          const credentials= [JSON.parse(data)[1].host,JSON.parse(data)[1].port,JSON.parse(data)[1].email,JSON.parse(data)[1].password,JSON.parse(data)[1].goodnotesEmail];
          return resolve(credentials);
      })
  }    
)}

function deletefile(filename){
  fs.unlink("../download/"+filename, (err) => {
      if (err) {
        console.error(err)
        return
      }
  })
}

module.exports.sendFile= async function sendFile(filenametoSent) {
  const credentials=await GetCredentials();
  var transporter = nodemailer.createTransport({
    host: credentials[0],
    port: credentials[1],
    secure: false,
    auth: {
      user: credentials[2],
      pass: credentials[3],
    },
  });

  var mailOptions = {
    from: credentials[2],
    to: credentials[4],
    attachments: [
      {
        // file on disk as an attachment
        filename: filenametoSent,
        path: "../download/"+filenametoSent, // stream this file
      }
    ]
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
    else {
      console.log( "\""+filenametoSent+"\""+" sent: " + info.response);
      deletefile(filenametoSent);
    }
  })
}
