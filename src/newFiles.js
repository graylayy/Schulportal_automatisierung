const request =require("./request");
const mail=require("./emailsending");

var dateienAnzahl=[];
var neuAbrufen=[];

async function NewFullLookup(){
    let timenow=Date.now()
    const allStorages= await request.requestAll()
    var kursnummerNew= CheckForlastmod(allStorages,timenow)
    //kursnummernNew müssen neu abgefragt werden und so weiter
}

function CheckForlastmod(allStorages,timenow){
    let kursnummerNew;
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
        //console.log(allStorages[i][j].filename)
            if(allStorages[i][j].type=='directory'){
                if(allStorages[i][j].basename==="Posteingang 📨"||allStorages[i][j].basename==="Posteingang"){
                    
                }else{
                    neuAbrufen.push(allStorages[i][j].filename)  
                }
            }else{
                CheckupFile(allStorages[i][j])
            }
        }
    }
    return kursnummerNew;
    
}

function CheckupFile(file){
    if((Date.now()-Date.parse(file.lastmod)<86400000)){
        if(file.mime=='application/pdf'||file.mime=='application/msword'){
            request.downloadFile(file.filename,file.basename)
            .then(mail.sendFile(file.basename))
        }
        
    };
}

NewFullLookup()