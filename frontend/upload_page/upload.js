// ----------------sidebar toggle-----
var menuIcon = document.querySelector(".menu_icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");
menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}


const upload = document.querySelector('.upload');
const sub_class = document.querySelector('.sub-class');

upload.onclick = function(){
  sub_class.classList.toggle("larger_ul")
}

//profile

const profile_li = document.querySelector('.profile_li');
const profile_sub_class = document.querySelector('.profile_sub_class');

profile_li.onclick = function(){
  profile_sub_class.classList.toggle("larger_profile")
}

//logout 
const logout = document.querySelector(".logOut");

logout.addEventListener("click",()=>{

   async function logOut_fun() {

    try{
      const logOut_response = await fetch("http://localhost:3000/api/v1/user/logout",{
        method:"POST",
        credentials:"include"
      })

      // console.log(logOut_response)
      if(!logOut_response){
        throw new error('Failed to Logout')
      }
       
      const playlink = `/view/index.html?flag=singOut`;
      window.location.href = playlink;
    }
    catch(error){
       console.log('Logout again');
    }
   }
   logOut_fun();
})



//current user profile
let avatar_l = document.querySelectorAll("#avatar");
let full_name = document.querySelector(".fullName");
let user_name = document.querySelector(".userName");



//logic for profile

async function profile_updatae() {
     try{
             //  get current user data
             const user_data = await fetch('http://localhost:3000/api/v1/user/current-user', {
               method: 'GET',
               credentials: 'include' // Ensures cookies are sent
           });

           const user = await user_data.json();

           full_name.textContent = user.data.fullname
           user_name.textContent = user.data.username
           full = user.data.fullname
           avatar_l.forEach(avat=>{
             avat.src = user.data.avatar
           })
     }
     catch(error)
     {
       console.log("there is some error");
     }
}

profile_updatae();


//
//search logic

const search_input = document.querySelector(".search_input");


  search_input.addEventListener("keydown",(event)=>{
            
       if(event.key=="Enter")
       {
        console.log("Enter key was pressed!")
        search_fun(search_input.value)
       }
  })


  async function search_fun(value) {
    try{
          
          const search_link = `../frontend/search_page/search.html?data=${value}`;
          window.location.href = search_link;

    }
    catch(error)
    {
       console.log("error in search",error);
    }
  }

    // search_fun()




const video_sub = document.querySelector(".video_sub")
const video_file = document.querySelector(".video_file")
let file = "";
video_sub.addEventListener("click",(event)=>{
    video_file.click();
})

video_file.addEventListener("change",async ({target})=>{
    file = target.files[0]
    // console.log(file);
    if(!file)
    {
        alert("please select a video to upload.");
    }
    else{
        bullet[current-1].classList.add("active");
        progressCheck[current-1].classList.add("active");
    }
})

// //main

const slidepage = document.querySelector(".slidepage")
const firstNextBtn = document.querySelector(".nextbtn")
const prevSec  = document.querySelector(".prev-2")
const nextSec = document.querySelector(".next-2")
const prevthird = document.querySelector(".prev-3")
const submitbtn = document.querySelector(".submit")
const progresText = document.querySelectorAll(".step p")
const progressCheck = document.querySelectorAll(".check")
const bullet = document.querySelectorAll(".bullet");

let max =4;
let current =1;

firstNextBtn.addEventListener("click",()=>{
    slidepage.style.marginLeft = "-33.33%"
    progresText[current-1].classList.add("active");
    current+=1
})

const image_sub = document.querySelector(".image_sub")
const image_file = document.querySelector(".image_file")
const third_thumbnail = document.querySelector(".third_thumbnail");

let image = "";
image_sub.addEventListener("click",(event)=>{
    image_file.click();
})

image_file.addEventListener("change",async ({target})=>{
    image = target.files[0]
    console.log(image);
    if(!image)
    {
        alert("please select a video to upload.");
    }
    else{
        const reader = new FileReader();
        reader.onload = (event) => {
            third_thumbnail.src = event.target.result; // Set the image src to the file data
        };
        reader.readAsDataURL(image);
        bullet[current-1].classList.add("active");
        progressCheck[current-1].classList.add("active");
    }
})


nextSec.addEventListener("click",()=>{
    slidepage.style.marginLeft = "-66.66%"
    progresText[current-1].classList.add("active");
    current+=1
})

const title_input = document.querySelector(".title_input")
const des_input = document.querySelector(".des_input")



submitbtn.addEventListener("click",()=>{
    // current+=1
    async function upload_video(){
        if(file&&title_input&&image&&des_input)
            {
                const formData = new FormData();
                formData.append("videoFile",file);
                formData.append("title",title_input.value);
                formData.append("description",des_input.value);
                formData.append("thumbnail",image)
                try{
                     const response = await fetch(`http://localhost:3000/api/v1/video/uploadVideo`,{
                        method:"POST",
                        body:formData,
                        credentials:"include"
                     });

                     console.log(response)
                     if(response)
                     {
                        alert("video uploaded successfully!");
                        bullet[current-1].classList.add("active");
                        progresText[current-1].classList.add("active");
                        progressCheck[current-1].classList.add("active");
                        // location.reload();
                     }
                     else
                     {
                        throw new error("Errrror")
                        alert("error uploading video");
                     }
                }
                catch(error){
                   console.log("Error uploading video:",error);      
                }
            }
            else{
                 alert("all field are compulsary")
            }
    }
    upload_video()
})

prevSec.addEventListener("click",()=>{
    slidepage.style.marginLeft = "0px"
    bullet[current-2].classList.remove("active");
    progresText[current-2].classList.remove("active");
    progressCheck[current-2].classList.remove("active");
    current-=1
})


prevthird.addEventListener("click",()=>{
    slidepage.style.marginLeft = "-33.33%"
    bullet[current-2].classList.remove("active");
    progresText[current-2].classList.remove("active");
    progressCheck[current-2].classList.remove("active");
    current-=1
})

