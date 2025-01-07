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



//for upload
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


// -----------------main-------------------------------
const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get('link');
let videoId = urlParams.get('id');

const videoLink_element = document.querySelector('video');


const video_title_element = document.querySelector(".video_title_element");
const channel_avatar = document.querySelector(".channel_avatar");
const channel_name = document.querySelector(".name");
const subscriber = document.querySelector('.subscriber')
const subscriber_button = document.querySelector('.subscriber_button');
const subscriber_bell = document.querySelector(".subscriber_bell")
const subs = document.querySelector(".subs")
let video_owner_id = "";
let subscrie_status ="";
async function playVideo() {
    if(link)
        {
            try{
                const video_response  = await fetch(`http://localhost:3000/api/v1/video/IncView/${videoId}`,{
                    method: 'GET',
                    credentials:"include"
                })

                if(!video_response)
                {
                    throw new error("no video response")
                }

                const video = await video_response.json();
                // console.log(video.data)
                // console.log("hii")             
                   
                video_title_element.textContent = video.data.title;
                // console.log(video.data.owner[0].avatar)
                channel_avatar.src = video.data.owner[0].avatar
                channel_name.textContent = video.data.owner[0].fullname
                video_owner_id = video.data.owner[0]._id;

                //Subscriber count
                const username = video.data.owner[0].username
                // console.log(username)
                const user_response = await fetch(`http://localhost:3000/api/v1/user/c/${username}`,{
                    method: 'GET',
                    credentials: "include"
                })
                const user = await user_response.json();
                // console.log(user.data)
                subscriber.textContent = `${user.data.subscribersCount} Subscriber`;
                const isSubscribe = user.data.isSubscribed;
                // console.log(typeof isSubscribe, isSubscribe); 
                subscrie_status=isSubscribe
                if (isSubscribe == true) {
                    subscriber_button.style.backgroundColor = "rgb(235, 235, 235)"; // Corrected value
                    subscriber_button.style.color = "black";
                    subscriber_button.style.width = "130px"
                    subs.textContent = "Subscribed";
                    subscriber_bell.style.display = "flex";
                }

                videoLink_element.src = link
            }
            catch(error){
                console.log("there is something error ..",error)
            }
        }
    else
    {
        console.log("error")
    }
}

playVideo()

//


subscriber_button.addEventListener("click",(event)=>{
    event.preventDefault();
    async function toggle_subscribe() {
        try{
             const toggle_subscriber_response = await fetch(`http://localhost:3000/api/v1/subscription/${video_owner_id}`,{
                method: 'POST',
                credentials:"include"
             })

             if(!toggle_subscriber_response)
             {
                throw new errro("error at receving toggle_subscription_response");
             }
             const json_toggle_response = await toggle_subscriber_response.json();
             console.log(json_toggle_response);

             if(subscrie_status==true)
             {
                subscriber_button.style.backgroundColor = "black"; // Corrected value
                subscriber_button.style.color = "white";
                subscriber_button.style.width = "120px"
                subs.textContent = "Subscribe";
                subscriber_bell.style.display = "none";
                subscrie_status= false
             }
             else
             {
                subscriber_button.style.backgroundColor = "rgb(235, 235, 235)"; // Corrected value
                subscriber_button.style.color = "black";
                subscriber_button.style.width = "130px"
                subs.textContent = "Subscribed";
                subscriber_bell.style.display = "flex";
                subscrie_status= true
             }

        }
        catch(error)
        {
            console.log("error at toggle_subscriber",error)
        }
    }

    toggle_subscribe()
    
})



// side videos

let right_video_container = document.querySelector(".right-sidebar");
async function show_video(){
    try{
        const response = await fetch('http://localhost:3000/api/v1/video/getAllVideos?limit=100',{
            method:'GET',
            credentials:"include"
        });
        const responseObject = await response.json();
        const video_list = responseObject.data;
        // filling videoHTL with video element 
        let videoHTML = '';
        video_list.forEach(element => {
            const Id = element._id;
            const thumbnailLink = element.thumbnail
            const videoLink = element.videoFile
            const avatar = element.avatar
            const videoTitle = element.title
            const videoDescription = element.description
            const videoView = element.views;
            const created_time_string = element.createdAt;
            const channel_name = element.channel_name;
            const playlink = `play.html?link=${videoLink}&id=${Id}`
            videoHTML += `
                <div class="side-video-list">
                    <a href="${playlink}" class="small-thumbnail">
                        <img src="${thumbnailLink}" alt="Thumbnail">
                    </a>
                    <div class="vid-info">
                        <a href="#" class="video_description">${videoDescription}</a>
                        <p class="channel_name">${channel_name}</p>
                        <p class="view">${videoView} Views</p> 
                    </div>
                </div>
            `;            
        });
        
        right_video_container.innerHTML = videoHTML;
        
    }
    catch(err){
        console.log("error in show function",err)
    }
  }

  show_video()
//fullScreen change



const video = document.querySelector('video');

function toggleFullscreen() {
    if(!document.fullscreenElement)
        {
            video.requestFullscreen().catch((err)=>{
                console.error(err);
            })
        }
        else
        {
            document.exitFullscreen().catch((err)=>{
                console.error(err);
            })
        }
}

document.addEventListener("keydown",(event)=>{
    if(event.key === "f"||event.key==="F"){
        toggleFullscreen()
    }
})




//comments

const comment_input_element = document.querySelector(".comment_input_element")
const comment_button = document.querySelector(".comment_button")


comment_input_element.addEventListener("keydown",(event)=>{
    event.stopPropagation();//prevent interfering with global key events
})


comment_button.addEventListener("click",()=>{

    if (!comment_input_element.value.trim()) {
        console.log("Comment cannot be empty");
        return;
    }
    upload_comment_fun();
})

async function upload_comment_fun() {
    try{
         const upload_comment_response = await fetch(`http://localhost:3000/api/v1/comment/${videoId}`,{
            method: "POST",
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify({
                "content": `${comment_input_element.value}`
            }),
            credentials:"include"
         })
         
         const upload_comment_json = await upload_comment_response.json()
         if(upload_comment_json)
         {
            comment_input_element.value = "";
            window.location.reload()
         }
    }
    catch(err)
    {
        console.log("error at upload comment function",err)
    }
}


async function displayCommentsFun(event) {
    try{
            
    }
    catch(err)
    {
        console.log("error at display comments function",err)
    }
}

displayCommentsFun()

