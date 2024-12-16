const urlParams = new URLSearchParams(window.location.search);
const videoLink = document.querySelector('video');
const link = urlParams.get('link');
const videoId = urlParams.get('id');
async function playVideo() {
    if(link)
        {
            try{
                const id = await fetch(`http://localhost:3000/api/v1/video/IncView/${videoId}`)
                console.log(id);
                console.log(link);
                videoLink.src = link
            }
            catch{
                console.log("there is something error ..")
            }
        }
    else
    {
        console.log("error")
    }
}

playVideo()



