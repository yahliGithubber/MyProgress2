//לתקן את הבעיות בחיפוש//

const videoList = [];
let videoListOriginal;
let checkPreview = false;
const main = document.querySelector('main');
const sidebar = document.querySelector('.sidebar');
const hamburgerMenu = document.querySelector('.hamburger-menu');

hamburgerMenu.addEventListener('click', function() {
  if (sidebar.style.display === 'block') {
    sidebar.style.display = 'none';
    main.style.width = '105%';    
    main.style.height = '105%';
    main.style.marginLeft = '-80px';       
  } else {
    sidebar.style.display = 'block';
    main.style.width = '100%';    
    main.style.height = '100%';
    main.style.marginLeft = '0px';
  }
});


document.getElementById('openTab').addEventListener('click', function() {
  if (window.matchMedia("(orientation: portrait)").matches) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }
  const website = document.querySelector('.opacity-popup')
  website.style.opacity = '0.4';
  website.style.cursor = 'not-allowed';
  website.style.pointerEvents = 'none';
  var popup = document.getElementById('popupTab');
  popup.style.display = 'block'; // Make sure it's visible for the transition
  setTimeout(function() {
    popup.classList.add('show'); // Start the transition
  }, 10); // Small delay to allow display property to take effect

});
document.getElementById('closeTab').addEventListener('click', function() {
  const website = document.querySelector('.opacity-popup');
  website.style.opacity = '1';
  website.style.cursor = 'pointer';
  website.style.pointerEvents = 'auto';
  var popup = document.getElementById('popupTab');
  popup.classList.remove('show'); // Start the fade-out transition
  setTimeout(function() {
    popup.style.display = 'none'; // Hide after transition ends
  }, 500); // Delay matches the transition duration (0.5s)
});

document.querySelector('.done-button').addEventListener('click', function() {
  const website = document.querySelector('.opacity-popup')
  website.style.opacity = '1';
  website.style.cursor = 'pointer';
  website.style.pointerEvents = 'auto';
  var popup = document.getElementById('popupTab');
  popup.classList.remove('show'); // Start the fade-out transition
  setTimeout(function() {
    popup.style.display = 'none'; // Hide after transition ends
  }, 500); // Delay matches the transition duration (0.5s)
  window.location.href = '/';
});


document.querySelector('#video-upload').addEventListener('change', function(event){
  const file = event.target.files[0];
  const videoPreview = document.querySelector('#video-preview');

  if (file) {
    const fileURL = URL.createObjectURL(file); // Create a URL for the selected file
    videoPreview.src = fileURL; // Set the video source to the file URL
    videoPreview.style.display = 'block'; // Show the video element
    document.querySelector('.video-preview-text').style.display = 'block';
    checkPreview = true;

} else {
    videoPreview.style.display = 'none'; // Hide the video element if no file is selected
}
});

document.querySelector('.next-button').addEventListener('click', function(event){
  event.preventDefault();
  if (!checkPreview){
    document.querySelector('.select-video').style.display = 'block';
    setTimeout(function() {
      document.querySelector('.select-video').style.display = 'none';
  }, 2000);
  } else{
  document.querySelector('.custom-file-input').style.display = 'none';
  document.querySelector('#video-preview').style.display = 'none';
  document.querySelector('.video-preview-text').style.display = 'none';
  document.querySelector('.next-button').style.display = 'none';

  document.querySelector('.input-text').style.display = 'block';
  document.querySelector('.input-text').disabled  = false;
  document.querySelector('.upload-button-submit').style.display = 'block';
  document.querySelector('.back-button').style.display = 'block';
  }
});
document.querySelector('.back-button').addEventListener('click', function(event){
  event.preventDefault();

  document.querySelector('.custom-file-input').style.display = 'block';
  document.querySelector('.next-button').style.display = 'block';
  document.querySelector('#video-preview').style.display = 'block';
  document.querySelector('.video-preview-text').style.display = 'block';

  document.querySelector('.enter-videoName').style.display = 'none';
  document.querySelector('.select-video').style.display = 'none'
  document.querySelector('.input-text').style.display = 'none';
  document.querySelector('.upload-button-submit').style.display = 'none';
  document.querySelector('.back-button').style.display = 'none';

});
const inputTextNameElement = document.querySelector('.input-text');

function restrictInput(event) {
  const currentLength = event.target.value.length;
    const hebrewRegex = /[\u0590-\u05FF]/;
    if (hebrewRegex.test(event.target.value)) {
      event.target.style.fontFamily = 'HebrewFont'; // Change this to your Hebrew font
  } else {
      event.target.style.fontFamily = 'EnglishFont'; // Reset the font if no Hebrew characters are found
  }
  if (currentLength > 55) {
    document.querySelector('.max-len').style.display = 'block';
    event.target.value = event.target.value.slice(0, 55);
  } else{
    document.querySelector('.max-len').style.display = 'none';
  }
}

inputTextNameElement.addEventListener('input', restrictInput);


document.querySelector('#uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const videoName = inputTextNameElement.value;
  if (videoName === ''){
    document.querySelector('.enter-videoName').style.display = 'block';
    setTimeout(function() {
      document.querySelector('.enter-videoName').style.display = 'none';
  }, 2000);
  } else {
    
  const formData = new FormData(e.target);
  document.querySelector('.loading').style.display = "block";
  document.querySelector('.loading-button').style.display = "block";
  document.querySelector('.back-button').style.display = "none";
  document.querySelector('.upload-button-submit').style.display = "none";
  document.querySelector('.input-text').disabled  = true;
  try {
      const response = await fetch('/upload', {
          method: 'POST',
          body: formData
      });

      const result = await response.json();
      
      if (result.success) {
          // Update the DOM with the success message
          // document.querySelector('.uploading-section').style.display = "none"
          //  document.querySelector('.uploaded-section').style.display = "block"
      } else {
          document.querySelector('.uploading-section').style.display = "none";
           document.querySelector('.uploaded-section').style.display = "block";
           document.querySelector('.done-button').style.display = "block";
           document.querySelector('.loading').style.display = "none";
           document.querySelector('.loading-button').style.display = "none";
      }
  } catch (error) {
      // Handle network errors or other unexpected issues
      console.log(result.message);

  }
}
});



document.addEventListener('DOMContentLoaded', () => {
  fetch('videoDetails.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          data.forEach(videoData => {
              videoList.push(videoData);
          });
          videoListOriginal = videoList;
          videoPreviewHome(videoList);
                })
                .catch(error => console.error('There has been a problem with your fetch operation:', error));
});

  
document.querySelector('.js-youtube-logo').addEventListener('click', (event) => { 
  event.preventDefault();
  window.location.href = '/';
  });


  document.querySelector('.js-search-bar').addEventListener('input', (event) => { 
    const searchBar = document.querySelector('.js-search-bar');
    const hebrewRegex = /[\u0590-\u05FF]/;

    if (hebrewRegex.test(searchBar.value)) {
      searchBar.style.fontFamily = 'HebrewFont'; // Change this to your Hebrew font
  } else {
      searchBar.style.fontFamily = 'EnglishFont'; // Reset the font if no Hebrew characters are found
  }
  });

  document.querySelector('.search-icon-mobile').addEventListener('click', (event) => { 
    if (window.matchMedia("(orientation: portrait)").matches) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
    }
    document.querySelector('.search-bar').style.display = "block";
    document.querySelector('.search-button').style.display = "block";
    document.querySelector('.search-icon-mobile').style.display = "none";
    document.querySelector('.arrow-img').style.display = "block";
    document.querySelector('.current-user-picture').style.display = "none" ;
    document.querySelector('.upload2').style.display = "none";
    document.querySelector('.youtube-logo').style.display = "none";
    document.querySelector('.head-line-recent').style.display = "none";
    document.querySelector('.head-line-recomend').style.display = "none";

  });
  document.querySelector('.arrow-img').addEventListener('click', (event) => { 
    document.querySelector('.search-bar').style.display = "none";
    document.querySelector('.search-button').style.display = "none";
    document.querySelector('.search-icon-mobile').style.display = "block";
    document.querySelector('.arrow-img').style.display = "none";
    document.querySelector('.current-user-picture').style.display = "block" ;
    document.querySelector('.upload2').style.display = "block";
    document.querySelector('.youtube-logo').style.display = "block";
    document.querySelector('.head-line-recent').style.display = "block";
    document.querySelector('.head-line-recomend').style.display = "block";
    const valueSearchName = document.querySelector('.js-search-bar').value;
    if (valueSearchName !== ''){
    videoPreviewHome(videoList);
    }
  });
document.querySelector('.js-search-button').addEventListener('click', (event) => { 
  search(1);
});


document.querySelector('.js-search-bar').addEventListener('keydown', (event) => { 
  if (event.key === 'Enter'){
    event.preventDefault();
    search(1);
}
});

document.querySelector('.js-search-bar').addEventListener('input', (event) => { 
    search(2);
});

function videoPreviewHome(videoList){
  let videoListRecent = [];
  if (videoList.length > 0) {
    videoListRecent.push(videoList[videoList.length - 1]); 
  }
  if (videoList.length > 1) {
    videoListRecent.push(videoList[videoList.length - 2]);
  }
  if (videoList.length > 2) {
    videoListRecent.push(videoList[videoList.length - 3]);
  }
  if (videoList.length > 3) {
    videoListRecent.push(videoList[videoList.length - 4]); 
  }
  const videoListFiltered = videoList.filter(video => 
    !videoListRecent.some(recentVideo => recentVideo.id === video.id)
  );
    videoDataPreview(videoListRecent, 2,``);
    videoDataPreview(videoListFiltered,3,``);
}

function search(checker){
  const valueSearchName = document.querySelector('.js-search-bar').value.toLowerCase();
  let VideoSearchDetails = [];
  const lenValue = valueSearchName.length;
  videoList.forEach((video) => {
    const videoNameEX = video.name.toLowerCase();
    if (checker === 1){
    if (videoNameEX.includes(valueSearchName)) {
      VideoSearchDetails.push(video);
    }
  } else{
    if (videoNameEX.slice(0, lenValue) === valueSearchName){
      VideoSearchDetails.push(video);
    }
  }   
  });


  if (VideoSearchDetails.length === 0) {
    VideoSearchDetails = ['empty'];
  }
  if (valueSearchName === ''){
    videoPreviewHome(videoList);
    if (window.matchMedia("(orientation: portrait)").matches) {
      document.querySelector('.head-line-recomend').style.display = "none"
      document.querySelector('.head-line-recent').style.display = "none" 
    }
  } else {
    videoDataPreview(VideoSearchDetails,0,``);
  }
}

function videoDataPreview(videoList,checker,initialHTML) {
  let videosHTML = initialHTML;
  let count=0;
  if (videoList[0] === 'empty') {
    document.querySelector('.js-videos').innerHTML = ``;
    document.querySelector('.js-videos-recomend').innerHTML = ``;
    document.querySelector('.head-line-recent').style.display = "none";
    document.querySelector('.head-line-recomend').style.display = "none";
    return;
  }
  if (checker === 1){
    videoList.sort(() => Math.random() - 0.5);
  } else if (checker === 2){
    count=4;
    document.querySelector('.head-line-recent').style.display = "block" 
  } else if (checker === 3){
    count=4;
    videoList.sort(() => Math.random() - 0.5);
    document.querySelector('.head-line-recomend').style.display = "block"
    document.querySelector('.video-grid-rec').style.display = "grid";
  } 

  else {
    document.querySelector('.video-grid-rec').style.display = "none";
    document.querySelector('.head-line-recent').style.display = "none";
    document.querySelector('.head-line-recomend').style.display = "none";
    // if (window.matchMedia("(orientation: portrait)").matches) {
    //   document.querySelector('.video-info').style.fontSize = "2rem";
    // }
  }
  for (let video of videoList) {
    count++;
    let videoLenMin;
    let videoLen;
    let videoLenSec;
    if (video.length/60 > 1){
      videoLenSec = Math.floor(video.length%60);
      videoLenMin = Math.floor(video.length/60);
      if (videoLenSec>9){
      videoLen= `${videoLenMin}:${videoLenSec}`
      } else{
        videoLen= `${videoLenMin}:0${videoLenSec}`
      }
    }
    else {
      videoLenSec = Math.floor(video.length%60);
      if (videoLenSec<10){
        videoLen = `00:0${videoLenSec}`
      } else{
        videoLen = `00:${videoLenSec}`
      }
    }

    const videoDateNow = new Date();
    const unixTimeNow = videoDateNow.getTime();
    const videoDateOG = new Date(video.date);
    const unixTimeVideo = videoDateOG.getTime(); 
    const videoDate = Math.floor((unixTimeNow-unixTimeVideo)/1000);
    let videoDateOriginal;

    if (videoDate<60){
      videoDateOriginal = `${videoDate} seconds ago`
    } else if ((videoDate<3600) && (videoDate>60)){
      videoDateOriginal = `${Math.floor(videoDate/60)} minutes ago`
    } else if ((videoDate<86400) && (videoDate>3600)){
      videoDateOriginal = `${Math.floor(videoDate/3600)} hours ago`
    } else if ((videoDate<604800) && (videoDate>86400)){
      videoDateOriginal = `${Math.floor(videoDate/86400)} days ago`
    } else if ((videoDate<2592000) && (videoDate>604800)){
      videoDateOriginal = `${Math.floor(videoDate/604800)} weeks ago`
    } else if ((videoDate<31104000) && (videoDate>2592000)){
      videoDateOriginal = `${Math.floor(videoDate/2592000)} months ago`
    } else if (videoDate>31104000){
      videoDateOriginal = `${Math.floor(videoDate/31104000)} years ago`
    }

    let lengthChecker =false;
    const lengthTitle = video.name.length;
    let videoTitle = video.name;
    let videoName= video.name;
    if (lengthTitle>40){
      videoTitle = videoName.slice(0,40)+"...";
      lengthChecker =true;
    }
    if (lengthChecker){
    videosHTML += `
      <div class="video-preview">
        <div class="thumbnail-row">
          <video id="myVideo"   class="thumbnail js-video" src="../../uploads/${video.id}">
          </video>
          </a>
          <div class="video-time js-time">${videoLen}
      </div>
        </div>
        <div class="video-info-grid">
          </div>
          <div class="video-info">
            <p class="video-title">
            ${videoTitle}
            </p>
            <div class="tooltip-title">${videoName}</div>
            <p class="video-stats">
              ${video.views} views &#183; ${videoDateOriginal}
            </p>
          </div>
        </div>
    `
    } else{
      videosHTML += `
      <div class="video-preview">
        <div class="thumbnail-row">
          <video id="myVideo"   class="thumbnail js-video" src="../../uploads/${video.id}">
          </video>
          </a>
          <div class="video-time js-time">${videoLen}
      </div>
        </div>
        <div class="video-info-grid">
          </div>
          <div class="video-info">
            <p class="video-title">
            ${videoTitle}
            </p>
            <p class="video-stats">
              ${video.views} views &#183; ${videoDateOriginal}
            </p>
          </div>
        </div>
    `
    }
    if ((checker === 1) || (checker === 2) || (checker === 3)){
    if (count >= 8) {
      break;
    }
    }
    };
    if (checker === 3){
      document.querySelector('.js-videos-recomend').innerHTML=videosHTML;
    }else {
    document.querySelector('.js-videos').innerHTML=videosHTML;
    }

  if (videoListOriginal.length < 5) {
    document.querySelector('.head-line-recomend').style.display = "none";
  } else if (videoListOriginal.length === 0){
    document.querySelector('.head-line-recent').style.display = "none";
  }
  
    changeToHebrew('.video-title');
    changeToHebrew('.tooltip-title');
     
    function changeToHebrew(title) {
    const hebrewRegex = /[\u0590-\u05FF]/;
    document.querySelectorAll(title).forEach(element => {
      if (hebrewRegex.test(element.textContent)) {
        element.style.fontFamily = 'HebrewFont'; // Change this to your Hebrew font
        element.style.direction = 'rtl';
      }
    });
  }

    document.querySelectorAll('.js-video').forEach(video => {
      video.addEventListener('click', () => {
        const videoSrc = video.getAttribute('src');
        const videoData = videoListOriginal.find(video => `../../uploads/${video.id}` === videoSrc);
        if (videoData) {

          fetch('/update-views', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id: videoData.id })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                localStorage.setItem('selectedVideoId', videoSrc);
                localStorage.setItem('videoList', JSON.stringify(videoListOriginal)); 
                window.location.href ="../z-MyYouTube.html";
            }
          })
          .catch(error => console.error('Error updating views:', error));
        }
      });
  });
}