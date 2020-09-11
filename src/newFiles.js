const request =require("./request");
const mail=require("./emailsending");

async function NewFullLookup(){
    const allStorages= await request.requestAll()
    var requestStorage= CheckForlastmod(allStorages)
    while(requestStorage.length>0){
        requestStorage= await request.requestFolders(requestStorage)
        requestStorage= CheckForlastmod(requestStorage)
    }
    //kursnummernNew müssen neu abgefragt werden und so weiter
}

function CheckForlastmod(allStorages){
    let requestStorage=[];
    let dateienAnzahl=[];
    /*
    /   Hier wird in jedem obersten Ordener eines Kurses nach der Anzahl von Dateien/Ordnern geschaut
    */
    for(i=0;i<allStorages.length;i++){
        //Jedes Fach wird einmal aufgerufen
        for(j=0;j<allStorages[i].length;j++){
            dateienAnzahl[i]=j
        }
        if(typeof(dateienAnzahl[i])==="undefined"){
            dateienAnzahl[i]=-1
        }
    }
    /*
    /   Hier werden alle Ordner, welche nochmal abgefragt werden sollen in ein Array gepusht
    */
    for(i=0;i<allStorages.length;i++){
        for(j=dateienAnzahl[i];j>=0;j--){
            if(allStorages[i][j].type=='directory'){
                if(allStorages[i][j].basename==="Posteingang 📨"||allStorages[i][j].basename==="Posteingang"){
                    
                }else{
                    requestStorage.push(allStorages[i][j].filename)  
                }
            }else{
                CheckupFile(allStorages[i][j])
            }
        }
    }
    return requestStorage;
    
}

function CheckupFile(file){
    if((Date.now()-Date.parse(file.lastmod)<86400000)){
        if(file.mime=='application/pdf'){
            request.downloadFile(file.filename,file.basename)
            .then(setTimeout(mail.sendFile, 1000, file.basename))
        }else{
            console.log("File found at: "+file.filename+"cannot cannot be sent to Goodnotes")
        }
        
    };
}

NewFullLookup()