
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
          
          const search_link = `/frontend/search_page/search.html?data=${value}`;
          window.location.href = search_link;

    }
    catch(error)
    {
       console.log("error in search",error);
    }
  }

    // search_fun()








// ----------------sidebar toggle-----
var menuIcon = document.querySelector(".menu_icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");
menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}

//upload

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

//main

//current user profile
const channel_logo = document.querySelector(".channel_logo");
let avatar_l = document.querySelectorAll("#avatar");
let full_name = document.querySelector(".fullName");
let user_name = document.querySelector(".userName");

//subscriber profile
let full = document.querySelector(".name");
let user_n = document.querySelector(".user_name");
let subscriber_element = document.querySelector(".subscriber");
let subscriber_user_name = "";
let user_id="";

//logic for profile

let urlParams = new URLSearchParams(window.location.search)
let owner_id = urlParams.get('owner_id')
let search_element = window.location.search

async function profile_updatae() {   

     try{


             //  get subscriber user data
            let  user_data = await fetch(`http://localhost:3000/api/v1/user/id_user/${owner_id}`, {
                    method: 'GET',
                    credentials: 'include' // Ensures cookies are sent
                });

               const subscriber_user = await user_data.json();
               full.textContent = subscriber_user.data.fullname
               user_n.textContent= subscriber_user.data.username
               user_id = subscriber_user.data._id;
               channel_logo.style.backgroundImage = `url('${subscriber_user.data.avatar}')`;
               subscriber_user_name = subscriber_user.data.username





                let  current_user_data = await fetch(`http://localhost:3000/api/v1/user/current-user`, {
                    method: 'GET',
                    credentials: 'include' // Ensures cookies are sent
                });

          
           const current_user = await current_user_data.json();
          //  console.log(user_id)
          full_name.textContent = current_user.data.fullname
           user_name.textContent = current_user.data.username
        
           avatar_l.forEach(avat=>{
             avat.src = current_user.data.avatar
           })
     }
     catch(error)
     {
       console.log("there is some error",error);
     }

     try{
      const subscriber_response = await fetch(`http://localhost:3000/api/v1/user/c/${subscriber_user_name}`,{
       method: 'GET',
       credentials: 'include' // Ensures cookies are sent
      });
      const subscriber = await subscriber_response.json();
      // console.log(subscriber.data._id);
      subscriber_element.textContent = `${subscriber.data.subscribersCount} Subscriber`
      }catch(error)
      {
      console.log("error",error)
      }
}

profile_updatae();

//update avatar


const shah = document.querySelector("#logob")

channel_logo.addEventListener("mouseenter",()=>{
     channel_logo.style.opacity = ".8";
     shah.style.opacity = "1"
})


channel_logo.addEventListener("mouseleave",()=>{
     channel_logo.style.opacity = "1";
     shah.style.opacity = "0"
})



// subscriber list

// const subscriber_image = document.querySelector(".subscriber_image")
// const subscriber_name = document.querySelector(".subscriber_name");
const subscribed_content = document.querySelector(".subscribed_content");
async function subscribed_fun() {
    try{
          const subsciber_response = await fetch("http://localhost:3000/api/v1/subscription/getSubscribed",{
            method:"GET",
            credentials:"include",
          })
          // console.log(subsciber_response)
          // console.log("hsisiasubscriber")
          const subsciber_json = await subsciber_response.json();
          // console.log(subsciber_json.data);
          const subsciber_data = subsciber_json.data;
          let subscriber_innerHTML = "";
          subsciber_data.forEach((element)=>{
            const subscriber_id = element.channel_detail[0]._id;
            const subscriber_avatar = element.channel_detail[0].avatar;
            const subsciber_fullname = element.channel_detail[0].fullname;
              subscriber_innerHTML+=`
               <a href="/frontend/subscriber_profile/subscriber.html?owner_id=${subscriber_id}"><img src="${subscriber_avatar}" class="subscriber_image"><p class="subscriber_name">${subsciber_fullname}</p></a>
              `
          })

          subscribed_content.innerHTML = subscriber_innerHTML
          
    }
    catch(error){
       throw new error("error at subscriber")
    }

} 

subscribed_fun()

// home

const home_li = document.querySelector(".home_li")
const home = document.querySelector(".home")
const sec = document.querySelector("#sec3")

home_li.addEventListener("click",()=>{
    home.style.display = "flex"
    sec.style.display = "none"
    home_fun();
})

home_fun();

async function home_fun() {
  try{
    const home_response = await fetch("http://localhost:3000/api/v1/video/getAllVideos?limit=100",{
      method:"GET",
      credentials:"include",
    });
    // console.lg()
    const home_json =await home_response.json();
    // console.log(json_home_response.data[0].owner);
    const data = home_json.data;
    console.log(data)
    let homeHTML = "";
    let county=0;
    data.forEach((element)=>{
      let home_id = element.owner;
      if(home_id==user_id)
      {
       
        county++;
        const thumbnail = element.thumbnail;
        const videoLink = element.videoFile
        const videoTitle = element.title
        const videoDescription = element.description
        const videoView = element.views
        const owner_full_name = element.owner.fullname
        const playlink = `/frontend/play.folder/play.html?link=${videoLink}&id=${element._id}`
        homeHTML+=
        `
        <div class="vid">
                <a href=${playlink}><img src="${thumbnail}" alt="" class="thumbnail"> </a>
                    <div class="vid_detail">
                            <div class="video_title">
                               ${videoTitle}
                            </div>
                        <div class="channel_detail">
                              
                                <div class="view">
                                  ${videoView} Views
                                </div>
                        </div>
                            <div class="discription">
                               ${videoDescription}
                            </div>
                    </div>
            </div>
        `
      }
    })
    if(county==0){
      home.style.display = "none";
      sec.style.display = "flex";
    }
    home.innerHTML = homeHTML;
  }
  catch(error)
  {
   console.log("some error in home function",error);
  }
}

//playlist

const playlist_li = document.querySelector(".playlist_li");

playlist_li.addEventListener("click",()=>{
    sec.style.display = "flex";
})


//community

const comunity_li = document.querySelector(".cummunity_li");

comunity_li.addEventListener("click",()=>{
    sec.style.display = "flex";
})

