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


//main

const main = document.querySelector(".main");
let videoHTML = "";
async function saerch_videos_fun() {
    try{
        const urlParams = new URLSearchParams(window.location.search)
        const data = urlParams.get('data');
        if(data=="")
        {
          videoHTML="";
              videoHTML+=`
                  <div class="no_result">
                      <img src="/frontend/image.folder/no_result.jpg" alt="">
                      <p class="found">no result found</p>
                      <p>Try different keywords</p>
                  </div>
              `
           main.innerHTML=videoHTML
        }
        
          if(!data){
            throw new error("do not get data from home page");
          }

          const search_response = await fetch(`http://localhost:3000/api/v1/video/getAllVideos?query=${data}&limit=50`,{
            method: "GET",
            credentials:"include"
          })
          if(!search_response){
            throw new error("do not response from get all video api");
          }
          const json_search = await search_response.json()
          const video_array = json_search.data;
          // console.log(json_search.data)
          console.log(typeof  video_array.length)
          
          
            video_array.forEach((element)=>{
              const Id = element._id;
              const video_thumbnail = element.thumbnail
              const video_title = element.title
              const video_description = element.description
              // const video_duration = document.querySelector(".duration");
              const video_views = element.views
              const channel_name =element.channel_name[0]
              const channel_avatar = element.avatar[0]
              const videoLink = element.videoFile
              const playlink = `/frontend/play.folder/play.html?link=${videoLink}&id=${Id}`

              videoHTML+=`
                          <div class="video_sub_main">
                  <div class="video_thumbnail">
                  <a href=${playlink}><img src="${video_thumbnail}" class="thumbnail"></a>
                  </div>
                  <div class="video_detail">
                      <p class="video_title">${video_title}</p>
                      <div class="view_duration">
                          <p class="views">${video_views} views</p>
                          <p class="duration">4 day ago</p>
                      </div>
                      <div class="channel_detail">
                          <img src="${channel_avatar}" alt="" class="channel_avatar">
                          <p class="channel_name">${channel_name}</p>
                      </div>
                      <div class="video_description">
                         ${video_description}
                      </div>
                  </div>
              </div>`
          // }
          })
          if(!video_array||video_array.length==0)
          {
            videoHTML="";
              videoHTML+=`
                  <div class="no_result">
                      <img src="/frontend/image.folder/no_result.jpg" alt="">
                      <p class="found">no result found</p>
                      <p>Try different keywords</p>
                  </div>
              `
          }

          
          main.innerHTML=videoHTML
    }
    catch(error)
    {
      console.log("error at showing search result",error)
    }
}

saerch_videos_fun()




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


