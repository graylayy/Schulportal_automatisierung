const request =require("./request");


function main(){
    
    request.requestAll()
    .then((items)=>console.log(items))
    .then(()=> ghjz())
    //console.log(items[0].type)
    
    //request.requestFolder(0,"Gottesbilder")
    //.then((folderContent)=>console.log(folderContent));
}

function ghjz(){
    request.requestFolder(0,"Gottesbilder")
    .then((folderContent)=>console.log(folderContent));
}

main()