let signupBtn = document.getElementById("signupBtn")
let signinBtn = document.getElementById("signinBtn")
let username = document.getElementById("username")
let fullname = document.getElementById("fullname")
let email = document.getElementById("email")
let password = document.getElementById("password")
let avatar = document.getElementById("avatar")
let coverimage = document.getElementById("coverImage");

let input_username = document.querySelector(".username")
let input_fullname = document.querySelector(".fullname")
let input_email = document.querySelector(".email")
let input_password = document.querySelector(".password")
let input_avatar = document.querySelector(".avatar");
let input_coverImage = document.querySelector(".coverImage");

let avartar_but = document.querySelector(".avatar-but")
let cover_but = document.querySelector(".cover-but")


const submit = document.querySelector(".submit");

let title = document.getElementById("title");
let flag="signup";
signinBtn.addEventListener("click",()=>{
     username.style.display = "none"
     fullname.style.display = "none"
     avatar.style.display = "none"
     coverimage.style.display = "none"
     title.innerHTML = "Sign in"
     signinBtn.classList.remove("disable")
     signupBtn.classList.add("disable")
     flag="signin";
})

signupBtn.addEventListener("click",()=>{
     username.style.display = "flex"
     fullname.style.display = "flex"
     avatar.style.display = "flex"
     coverimage.style.display = "flex"
     title.innerHTML = "Sign up"
     signinBtn.classList.add("disable")
     signupBtn.classList.remove("disable")
     flag="signup";
})
      
let avatar_res, cover_res;

avartar_but.addEventListener("click",()=>{
     input_avatar.click();
})

cover_but.addEventListener("click",()=>{
     input_coverImage.click();
})


     input_avatar.addEventListener("change",(event)=>{
           avatar_res = event.target.files[0];
          console.log(avatar_res);
     })


     input_coverImage.addEventListener("change",(event)=>{
           cover_res = event.target.files[0];
          console.log(cover_res);
     })

     async function show(event) {
          event.preventDefault();
          if(flag=="signup")
          {
               console.log(input_username);
               console.log(input_password);
               console.log(input_fullname);
               console.log(input_email);
               console.log(avatar_res);
               console.log(cover_res);

               if(input_username&&input_fullname&&input_email&&input_password&&avatar_res&&cover_res)
               {
                    const formData = new FormData()
                    formData.append("email",input_email.value);
                    formData.append("password",input_password.value);
                    formData.append("username",input_username.value);
                    formData.append("fullname",input_fullname.value);
                    formData.append("coverImage",avatar_res);
                    formData.append("avatar",cover_res);
                    console.log("hi");
                    try{
                         const response = await fetch('http://localhost:3000/api/v1/user/register',{
                                   method:"POST",
                                   body:formData
                         });
                    }
                    catch(error)
                    {
                         console.log("error",error)
                    }
               }
               else{
                    alert("all field are compulsary")
               }
          }
          else if(flag=="signin"){
             if(input_email&&input_password)
             {
              
               const response = await fetch("http://localhost:3000/api/v1/user/login",{
                    method:"POST",
                    headers:{
                         'Content-type':'application/json'
                    },

                    body:JSON.stringify({
                        "email":`${input_email.value}`,
                        "password":`${input_password.value}`
                    })
               })

               console.log(response)
             }
             else{
                alert("All field are required");
             }
          }

          
     }

     submit.addEventListener("click",show);



