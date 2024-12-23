// ----------------sidebar toggle-----
var menuIcon = document.querySelector(".menu_icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");
menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}


// --------------main------------

const list_container = document.querySelector('.list-container')
const banner_container = document.querySelector(".container");
const nav_ul = document.querySelector(".nav_ul");
const signInIcon = document.getElementById("signInIcon")
const shorts = document.querySelectorAll('.short');
const sign = document.querySelectorAll('.sign');

//signInbtn
const signInBtn = document.querySelector(".signInBtn")
const sidebar_signInBtn = document.querySelector(".sidebar_signInBtn")
const subscribe_list = document.querySelector(".subscribed-list")
const singInInfo = document.querySelector(".singInInfo");
const hr = document.querySelector(".hr");

//current user profile
let avatar_l = document.querySelectorAll("#avatar");
let full_name = document.querySelector(".fullName");
let user_name = document.querySelector(".userName");
let user_fullName = "";
let user_userName = "";
let avatar_link ="";

//check for signin or not
const urlParams = new URLSearchParams(window.location.search);
const flag  = urlParams.get('flag');

if(flag=="signin")
{
        console.log("inside");
    async function show_video(){
      try{
          const response = await fetch('http://localhost:3000/api/v1/video/getAllVideos?limit=100',{
              method:'GET',
              credentials:"include"
          });
          // console.log(response);
          const responseObject = await response.json();
          console.log(responseObject);
          const video_list = responseObject.data;
          // console.log(video_list);

          singInInfo.style.display = "none";
          hr.style.display = "none";

          let videoHTML = '';
          video_list.forEach(element => {
              const Id = element._id;
              // console.log(Id)
              const thumbnailLink = element.thumbnail
              const videoLink = element.videoFile
              const avatar = element.avatar
              const videoTitle = element.title
              const videoDescription = element.description
              const videoView = element.views;
              const created_time_string = element.createdAt;
              const current_time = new Date();
              const created_time = new Date(created_time_string);
              const channel_name = element.channel_name;
              let time_passed =((current_time.getDate()-created_time.getDate())+30)%30;        
              let vari = "days ago";
              if(time_passed===0){
                time_passed = current_time.getHours()-created_time.getHours()
                vari = "Hours ago"
                  if(time_passed===0){
                    time_passed = created_time.getMinutes()-current_time.getMinutes();
                    vari = "Minutes ago"
                  }
              }
          
              const playlink = `../frontend/play.folder/play.html?link=${videoLink}&id=${Id}`
            videoHTML += `
                  <div class="vidlist">
                    <a href=${playlink}><img src="${thumbnailLink}" class="thumbnail"></a>
                    <div class="flex-div">
                      <img src="${avatar}">
                      <div class="video-info">
                        <a href="">${videoTitle}</a>
                        <p class="channel_name">${channel_name}</p>
                        <p>${videoView} Views • ${time_passed} ${vari}</p>
                      </div>
                    </div>
                  </div>
                `
          });

          list_container.innerHTML = videoHTML;
          
          //  get current user data
          console.log("hahahaha")
          const user_data = await fetch('http://localhost:3000/api/v1/user/current-user', {
            method: 'GET',
            credentials: 'include' // Ensures cookies are sent
        });
        const user = await user_data.json();
        //  console.log(user.data)
        console.log(user.data)
        user_fullName = user.data.fullname
        user_userName = user.data.username
        avatar_link = user.data.avatar

                
        console.log(avatar_link)
        console.log(user_fullName)
        full_name.textContent = user_fullName
        user_name.textContent = user_userName
         
        avatar_l.forEach(avat=>{
          avat.src = avatar_link
        })
      }
      catch{

      }
    }
    show_video()
    
}
else
{

   for (let index = 0; index < nav_ul.children.length; index++) {
      nav_ul.children[index].style.display = "none";
   }  // all li of nav-right remove

     
   banner_container.style.display = "none"// banner remove

   signInIcon.style.display = "flex";//signInIcon added to nav-right
   
   signInBtn.addEventListener("click",(event)=>{
    event.preventDefault()
    window.location.href = "../frontend/login_page/login.html"
   })//on clicking signIn Button , redirected to new signIN page


   for (let i = 0; i < shorts.length; i++) {
    shorts[i].style.display = "none";
    }


    for (let i = 0; i < sign.length; i++) {
      sign[i].style.display = "flex";
    }

    sidebar_signInBtn.addEventListener("click",(event)=>{
      event.preventDefault()
      window.location.href = "../frontend/login_page/login.html"
     })//on clicking signIn Button , redirected to new signIN page

     subscribe_list.style.display = "none";
  
     
}

// ------------upload-------
// const upload = document.querySelector('.upload')
// upload.addEventListener('click', (event) => {
//   const ul = document.createElement('ul');
//   ul.className = "upload_ul"
//   const li1 = document.createElement('li');
//   li1.className = "upload_video_li"
//   const li2 = document.createElement('li');
//   li2.className = "upload_video_li"
//   li1.innerHTML = "<p>upload Video</p>"
//   li2.innerHTML = "<p>upload post</p>"
//   ul.appendChild(li1);
//   ul.appendChild(li2);
//   upload.appendChild(ul);
// })

const upload = document.querySelector('.upload');
const sub_class = document.querySelector('.sub-class');

upload.onclick = function(){
  sub_class.classList.toggle("larger_ul")
}


//profile_info


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







