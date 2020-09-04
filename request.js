const { createClient } = require("webdav");
const fs = require('fs')
const path = require('path');
var credentials=[0];

async function GetCredentials(){  
    const credentialsPath = path.join(__dirname,"/credentials.json")
    
    return new Promise(function(resolve, reject) {
        fs.readFile(credentialsPath, 'utf8' , (err, data) => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            const credentials= [JSON.parse(data).username,JSON.parse(data).password];
            //console.log(credentials)
            return resolve(credentials);
        })
    }    
)}

async function Getcontent(client){
    
    const kurse=["kr-gk-4","d-gk-2","e-pk-2","mu-gk-2","d-gk-2","if-gk-1","e-gk-2","m-lk-2","ek-lk-2","ch-gk-2","sw-gk-2","stufe"]
    var requestUrl="/22-"+kurse[0]+"@magydo.schulportal-erzbistum-pb.de/storage"
    console.log(requestUrl);
    const items = await client.getDirectoryContents(requestUrl);
    console.log(items)
    console.log(items[0].type)
}

function main(){
     GetCredentials()
        .then((credentials) =>{
            return new Promise(function(resolve) {
                
                const client = createClient(
                    "https://www.schulportal-erzbistum-pb.de/webdav.php",
                    {
                        username: credentials[0],
                        password: credentials[1]
                    }
                );
                return resolve(client);
            })
        })
        .then((client)=> Getcontent(client));
}
main();
