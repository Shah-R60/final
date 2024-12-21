// ----------------sidebar toggle-----
var menuIcon = document.querySelector(".menu_icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");
menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}

console.log("hiiiiiiiiiiiiiiiiii")
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
