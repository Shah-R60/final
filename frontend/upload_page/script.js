const button = document.querySelector(".button")
const fileInput = document.querySelector(".file-input")

button.addEventListener("click",(event)=>{
    fileInput.click();
    
})

fileInput.addEventListener("change",async ({target})=>{
    const file = target.files[0]
    console.log(file);
    if(!file)
    {
        alert("please select a video to upload.");
    }
   
    const formData = new FormData();
    formData.append("VideoFile",file);
    try{
         const response = await fetch(`http://localhost:3000/api/v1/video/uploadVideo`,{
            method:"POST",
            body:formData
            // credentials:"include"
         });
         console.log(response)
         if(response)
         {
            alert("video uploaded successfully!");
         }
    }
    catch(error){
       console.log("Error uploading video:",error);      
    }
})
