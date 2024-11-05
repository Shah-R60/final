document.getElementById("uploadForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // Prevent the default form submission

  const imageInput = document.getElementById("imageInput");
  const file = imageInput.files[0]; // Get the selected file

  if (!file) {
      alert("Please select an image file to upload.");
      return;
  }

  // Create a new FormData instance
  const formData = new FormData();
  formData.append("image", file); // Append the file with the key "image"

  try {
      // Send the POST request to your server
      const response = await fetch("http://localhost:3000/api/upload", {
          method: "POST",
          body: formData
      });

      // Check if the response is OK
      if (response.ok) {
          const result = await response.json(); // Parse the JSON response
          console.log("Image uploaded successfully:", result);
      } else {
          console.error("Image upload failed:", response.statusText);
      }
  } catch (error) {
      console.error("Error uploading image:", error);
  }
});
