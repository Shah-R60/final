async function loadVideo() {
    try {
      // Replace with your API endpoint
      const response = await fetch('http://localhost:3000/api/v1/video/getAllVideos');
      const rs = await response.json();   
      // Assuming the API response has a property `videoUrl` with the video source
      const videoObject = rs.data;
      const container = document.getElementById('video-container');
      container.innerHTML = ''; // Clear any previous content
      // Optional: autoplay video when loaded
        videoObject.forEach(element => {
            const videoUrl = element.videoFile;
      
            // Create a video element
            const video = document.createElement('video');
            video.controls = true; // Show video controls (play, pause, etc.)
            video.width = 660; // Set video width
            video.height = 400;
            video.src = videoUrl; // Set video source from API
            container.appendChild(video);
        });
      // Append the video to the container
    } catch (error) {
      console.error("Error loading video", error);
    }
  }
  
  loadVideo();
  