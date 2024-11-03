var menuIcon = document.querySelector(".menu_icon");
var sidebar = document.querySelector(".sidebar");
var container = document.querySelector(".container");
menuIcon.onclick = function(){
    sidebar.classList.toggle("small-sidebar")
    container.classList.toggle("large-container")
}

// --------------main------------
const list_container = document.querySelector('.list-container')

async function show_video(){
    try{
        const response = await fetch('http://localhost:3000/api/v1/video/getAllVideos');
        // console.log(response);
        const responseObject = await response.json();
        // console.log(responseObject);
        const video_list = responseObject.data;
        // console.log(video_list);

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
            // console.log("shah");
            const playlink = `../frontend/play.folder/play.html?link=${videoLink}&id=${Id}`
           videoHTML += `
                <div class="vidlist">
                  <a href=${playlink}><img src="${thumbnailLink}" class="thumbnail"></a>
                  <div class="flex-div">
                    <img src="${avatar}">
                    <div class="video-info">
                      <a href="">${videoTitle}</a>
                      <p>${videoView} Views • ${time_passed} ${vari}</p>
                    </div>
                  </div>
                </div>
              `
        });

        list_container.innerHTML = videoHTML;
        
    }
    catch{

    }
}

show_video()