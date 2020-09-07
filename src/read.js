const request =require("./request");


function main(){
    
    request.requestAll()
    .then((items)=>console.log(items))
    
    //console.log(items[0].type)
    
    //request.requestFolder(0,"Gottesbilder")
    //.then((folderContent)=>console.log(folderContent));
}

function ghjz(){
    request.requestFolder(7,"Unterricht 7.9.2020")
    .then((folderContent)=>console.log(folderContent))
    //.then(()=> main())
}

main();
