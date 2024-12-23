// ----------------sidebar toggle-----
var menuIcon = document.querySelector(".menu_icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");
menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}

console.log("1")
//upload

const upload = document.querySelector('.upload');
const sub_class = document.querySelector('.sub-class');

upload.onclick = function(){
  sub_class.classList.toggle("larger_ul")
}

//profile
console.log("2")


const profile_li = document.querySelector('.profile_li');
const profile_sub_class = document.querySelector('.profile_sub_class');

profile_li.onclick = function(){
  profile_sub_class.classList.toggle("larger_profile")
}

//logout 
const logout = document.querySelector(".logOut");
console.log("3")

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

console.log("4")


//current user profile
let avatar_l = document.querySelectorAll("#avatar");
let full_name = document.querySelector(".fullName");
let user_name = document.querySelector(".userName");



//logic for profile
console.log("5")

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


//main history
console.log("6");
const main = document.querySelector(".main");
async function  history_fun() {
    try{
         const history_response =  await fetch("http://localhost:3000/api/v1/user/history",{
          method: 'GET',
          credentials:"include"
         })

        if(!history_response){
          throw new error("history is not fetch")
         }
        const json_response = await history_response.json();
        const history_array = json_response.data.history;
        // console.log(history_array);
        let videoHTML = '';
        
        for (let index = 0; index < history_array.length; index++) {
          
          console.log(history_array[index])
              const thumbnailLink = history_array[index].thumbnail
              const videoLink = history_array[index].videoFile
              const videoTitle = history_array[index].title
              const videoDescription = history_array[index].description
              const videoView = history_array[index].views
              const owner_full_name = history_array[index].owner.fullname

               const playlink = `/frontend/play.folder/play.html?link=${videoLink}&id=${history_array[index]._id}`
               videoHTML += `
                <div class="vid">
                <a href=${playlink}><img src="${thumbnailLink}" alt="" class="thumbnail"> </a>
                    <div class="vid_detail">
                            <div class="video_title">
                               ${videoTitle}
                            </div>
                        <div class="channel_detail">
                                <div class="channel_name">
                                  ${owner_full_name}
                                </div>
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

        main.innerHTML = videoHTML
    }
    catch(error)
    {
       console.log("history error",error)
    }
}

history_fun()

