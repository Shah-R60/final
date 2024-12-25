
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



//current user profile
let avatar_l = document.querySelectorAll("#avatar");
let full_name = document.querySelector(".fullName");
let user_name = document.querySelector(".userName");
let full = document.querySelector(".name");
let user_n = document.querySelector(".user_name");
let subscriber_element = document.querySelector(".subscriber");
let current_user_name = "";

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
      console.log(subscriber.data.subscribersCount);
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


