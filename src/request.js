const { createClient } = require("webdav");
const fs = require('fs');
const path = require('path');


const kurse=["kr-gk-4","d-gk-2","e-pk-2","mu-gk-2","if-gk-1","e-gk-2","m-lk-2","ek-lk-2","ch-gk-2","sw-gk-2","stufe"]

async function GetCredentials(){  
    const credentialsPath = path.join(__dirname,"..","/credentials.json")
    return new Promise(function(resolve, reject) {
        fs.readFile(credentialsPath, 'utf8' , (err, data) => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            const credentials= [JSON.parse(data)[0].username,JSON.parse(data)[0].password];
            return resolve(credentials);
        })
    }    
)}

function InitializeClient(credentials){
    return new Promise(function(resolve) {
                
        var client = createClient(
            "https://www.schulportal-erzbistum-pb.de/webdav.php",
            {
                username: credentials[0],
                password: credentials[1]
            }
        );
        return resolve(client);})
}

async function GetAllContent(client){
    let items=[];
    for(i=0;i<kurse.length;i++){
        var requestUrl="/22-"+kurse[i]+"@magydo.schulportal-erzbistum-pb.de/storage"
        var request = await client.getDirectoryContents(requestUrl);
        items.push(request)
    }
    return items; 
}

async function GetFolderContent(client,folderName){
    let items=[];
    for(i=0;i<folderName.length;i++){
    items[i]= await client.getDirectoryContents(folderName[i]);
    }
    return items;
}

module.exports.requestAll =function requestAll(){
    return new Promise(function(resolve) {   
        if(typeof(intitedclient)==='undefined'){  
            GetCredentials()
                .then((credentials) =>InitializeClient(credentials))
                .then((client)=>intitedclient=client)
                .then((intitedclient)=> GetAllContent(intitedclient))
                .then((items)=>{ return resolve(items)});
            } else{
                GetAllContent(intitedclient)
                .then((items)=>{ return resolve(items)});
            }
        
    })
}

module.exports.requestFolders =function requestFolders(folderName){
    return new Promise(function(resolve) {
        if(typeof (intitedclient) ==='undefined'){
            GetCredentials()
            .then((credentials) =>InitializeClient(credentials))
            .then((client)=>intitedclient=client)
            .then((intitedclient)=>GetFolderContent(intitedclient,folderName))
            .then((folderContent)=>{ return resolve(folderContent)});
        }else{
            GetFolderContent(intitedclient,folderName)
            .then((folderContent)=>{ return resolve(folderContent)});

        }
    })
}


module.exports.downloadFile=function downloadFile(filedir,filename){
    let downloadUrl=filedir
    intitedclient
    .createReadStream(downloadUrl)
    .pipe(fs.createWriteStream(__dirname+"/../download/"+filename));
}