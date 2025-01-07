
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
const channel_logo = document.querySelector(".channel_logo");
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
let avatar_l = document.querySelectorAll("#avatar");
let full_name = document.querySelector(".fullName");
let user_name = document.querySelector(".userName");
let full = document.querySelector(".name");
let user_n = document.querySelector(".user_name");
let subscriber_element = document.querySelector(".subscriber");
let current_user_name = "";
let user_id="";
let tweet_user_name="";
//logic for profile

let urlParams = new URLSearchParams(window.location.search)
let owner_id = urlParams.get('owner_id')
let search_element = window.location.search

async function profile_updatae() {
     try{
             //  get current user data
             let user_data ="";
             
                   user_data = await fetch('http://localhost:3000/api/v1/user/current-user', {
                    method: 'GET',
                    credentials: 'include' // Ensures cookies are sent
                });

             

           const user = await user_data.json();
           user_id = user.data._id;
           channel_name.textContent= user.data.fullname
           tweet_user_name = user.data.fullname
           full_name.textContent = user.data.fullname
           user_name.textContent = user.data.username
           full.textContent = user.data.fullname
           user_n.textContent= user.data.username
           current_user_name = user.data.username
           channel_logo.style.backgroundImage = `url('${user.data.avatar}')`;

           avatar_l.forEach(avat=>{
             avat.src = user.data.avatar
           })
     }
     catch(error)
     {
       console.log("there is some error",error);
     }

     try{
      const subscriber_response = await fetch(`http://localhost:3000/api/v1/user/c/${current_user_name}`,{
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

// home_fun();

async function home_fun() {
  try{
    const home_response = await fetch("http://localhost:3000/api/v1/video/getAllVideos?limit=100",{
      method:"GET",
      credentials:"include",
    });
    const home_json =await home_response.json();
    const data = home_json.data;
    let homeHTML = "";
    let county=0;
    data.forEach((element)=>{
      let home_id = element.owner;
      // console.log(user_id)
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
    home.style.display = "none";
})


//community

const comunity_li = document.querySelector(".cummunity_li");
const channel_name =document.querySelector(".channel_name");
const tweet_photo_btn = document.querySelector(".image_detail")
const tweet_photo_input = document.querySelector(".tweet_photo_input");
const tweet_input = document.querySelector(".tweet_input");


comunity_li.addEventListener("click",()=>{
    // sec.style.display = "flex";
    home.style.display = "none";
})

const text_area = document.getElementById("text-area")

text_area.addEventListener("input",()=>{
  text_area.style.height = 'auto'; // Reset height to calculate scrollHeight
  text_area.style.height = text_area.scrollHeight + 'px'; // Set height based on content
})


tweet_photo_btn.addEventListener("click",()=>{
      tweet_photo_input.click();
})

let tweet_photo_res="";

let uploaded_image = document.querySelector('.uploaded_image');
let tweet_img_element = document.querySelector('.tweet_img_element');

tweet_photo_input.addEventListener("change",(event)=>{
   tweet_photo_res = event.target.files[0];
   console.log(tweet_photo_res)
   if(tweet_photo_res)
   {
      uploaded_image.style.display = "flex"
      const reader = new FileReader();
      reader.onload = (event) => {
        tweet_img_element.src = event.target.result; // Set the image src to the file data
      };
      reader.readAsDataURL(tweet_photo_res);   }
})


async function tweet_fun() {
   

       if(tweet_input)
       {
          const formData = new FormData();
          formData.append("content",tweet_input.value)
          formData.append("tweet_photo",tweet_photo_res);
          try{
            const tweet_response = await fetch("http://localhost:3000/api/v1/tweet/",{
               method:"POST",
               body:formData,
               credentials:"include"
            })
          }catch(error)
          {
            console.log("error at tweet function",error)
          }
       }
       else{
          alert("all field are compulsary")
       }
}

// tweet_fun()

const tweet_submit = document.querySelector(".submit_button")

tweet_submit.addEventListener("click",tweet_fun)


//show tweet

const smaller_community = document.querySelector('.smaller_community')

async function show_tweet_fun() {
    try{
          const current_user_res = await fetch('http://localhost:3000/api/v1/user/current-user',{
            method:"GET",
            credentials:"include"
          })
          const current_user_json = await current_user_res.json()
          const show_user_id = current_user_json.data._id;
          const show_user_name = current_user_json.data.fullname;
          const show_user_avatar = current_user_json.data.avatar;
               
          const show_tweet_res = await fetch(`http://localhost:3000/api/v1/tweet/user/${show_user_id}`,{
            method:"GET",
            credentials:"include",
          })
          const show_tweet_json = await show_tweet_res.json();
          const show_tweet_fun_data = show_tweet_json.data;

          let show_tweet_html = "";
          // console.log(show_tweet_fun_data)
          // console.log("Number of tweets:", show_tweet_fun_data.length);

          // loop though tweet
          show_tweet_fun_data.forEach((element)=>{
            let tweet_text_jdj = element.content;
            let tweet_image = element.tweet_photo;
            let tweet_idd = element._id;
            // console.log(tweet_id);
            // console.log(typeof tweet_image)
            if(tweet_image!="")
            {
              // console.log(tweet_image)
              show_tweet_html+=`
              <div class="show">
                    <div class="show_avatar">
                        <img src="${show_user_avatar}" alt="" id="avatar">
                    </div>
                    <div class="show_tweet_detail">
                            <div class="show_channnel_name">
                                <p>${show_user_name}</p>
                            </div>
                            <div class="tweet_text">
                                <p>${tweet_text_jdj}</p>
                            </div>
                            <div class="show_tweet_image">
                                <img src="${tweet_image}" alt="">
                            </div>

                        <div class="tweet_reaction">
                            <div>
                                <img src="/frontend/image.folder/like.png" alt="">
                                <img src="/frontend/image.folder/dislike.png" alt="">
                            </div>
                            <button class="tweet_update_button" style="display: none;">post</button>
                        </div>

                    </div>
                    <div class="option">
                        <img src="/frontend/image.folder/option.png" alt="" class="edit_delete"">
                        <div class="option_sub_class"  id="${tweet_idd}">
                            <ul class="option_ul ">
                                <li class="option_li tweet_edit"><img src="/frontend/image.folder/edit.png" alt="">edit</li>
                                <li class="option_li tweet_delete"><img src="/frontend/image.folder/delete.png" alt="">delete</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `
            }
            else
            {
              show_tweet_html+=`
              <div class="show">
                    <div class="show_avatar">
                        <img src="${show_user_avatar}" alt="" id="avatar">
                    </div>
                    <div class="show_tweet_detail">
                            <div class="show_channnel_name">
                                <p>${show_user_name}</p>
                            </div>
                            <div class="tweet_text">
                                <p>${tweet_text_jdj}</p>
                            </div>
                           

                            <div class="tweet_reaction">
                            <div>
                                <img src="/frontend/image.folder/like.png" alt="">
                                <img src="/frontend/image.folder/dislike.png" alt="">
                            </div>
                            <button class="tweet_update_button" style="display: none;">post</button>
                        </div>

                    </div>
                    <div class="option">
                        <img src="/frontend/image.folder/option.png" alt="" class="edit_delete"  >
                        <div class="option_sub_class"  id="${tweet_idd}">
                            <ul class="option_ul">
                                <li class="option_li tweet_edit"><img src="/frontend/image.folder/edit.png" alt="">edit</li>
                                <li class="option_li tweet_delete"><img src="/frontend/image.folder/delete.png" alt="">delete</li>
                            </ul>
                        </div>
                    </div>
              </div>
            `
            }
            
          })

          smaller_community.innerHTML = show_tweet_html;
    }
    catch(error)
    {
        throw new   error("error in show_tweet_funtion",error)
    }
}

show_tweet_fun()

let optionUl="";
document.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("edit_delete")) {
      optionUl = event.target.closest(".option").querySelector(".option_sub_class");
      optionUl.classList.toggle("option_ul_click");
  }
  else if(event.target&&event.target.classList.contains("tweet_delete")){
        async function tweet_delete_fun() {
          try{
            //  const tweet_delete_id = event.target.closest(".option").querySelector(".option_sub_class")
            let tweet_delete_id =  optionUl.attributes.id.value;
            const tweet_delete_response = await fetch(`http://localhost:3000/api/v1/tweet/c/${tweet_delete_id}`,{
              method: "DELETE",
              credentials:"include"
            })

            console.log(tweet_delete_response)
            window.location.reload()

          }catch(error)
          {
            console.log("eeeoee")
          }
        }

        tweet_delete_fun();
  }
  //update_tweet
  else if(event.target&&event.target.classList.contains("tweet_edit"))
  {
   
    let tweet_delete_id =  optionUl.attributes.id.value;
    const tweet_edit_text = event.target.closest(".show").querySelector(".tweet_text p");
    optionUl.classList.toggle("option_ul_click");
    // Make the element editable
    tweet_edit_text.setAttribute("contenteditable", "true");

    // Focus the element
    tweet_edit_text.focus();
    tweet_edit_text.style.border="0px"
    tweet_edit_text.style.outline = "0px"
    // Place the cursor at the end of the text
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(tweet_edit_text);
    range.collapse(false); // Collapse range to the end
    selection.removeAllRanges();
    selection.addRange(range);

    const option_ul = event.target.closest(".show").querySelector(".tweet_update_button")
   
    option_ul.style.display = "block"
    option_ul.addEventListener("click",()=>{
      async function update_tweet_fun() {
        try{
            const update_tweet_response = await fetch(`http://localhost:3000/api/v1/tweet/c/${tweet_delete_id}`,{
              method: 'PATCH',
              headers:{
                'Content-type':'application/json'
              },
              // body: JSON.stringify({text:tweet_edit_text.textContent})
              body:JSON.stringify({
                "content":`${tweet_edit_text.textContent}`
              }),
              credentials:"include"
              
            })

            if(update_tweet_response)
            {
              window.location.reload()
            }
        }catch(error)
        {
          console.log("error at update tweet function",error)
        }
      }
  
      update_tweet_fun()
    //   setTimeout(() => {
    //       window.location.reload()
    //   }, 1000);
    // })
  
    })
  }
  else
  {
    optionUl.classList.remove("option_ul_click");
  }
});

//update tweet
const edit_delete = document.querySelector(".edit_delete");
const option_sub_class = document.querySelector(".option_sub_class");

// console.log(edit_delete);
// console.log(option_sub_class);

edit_delete.onclick = function () {
    console.log("Clicked!");
    option_sub_class.classList.toggle("sub_class_click");
};

//rahul shah rahul shha

