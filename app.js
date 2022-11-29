// Generating content based on the template
const template = `<article>
  &nbsp;&nbsp;&nbsp;POS. NAME <a href='http://WEBSITE/'>WEBSITE</a>
</article>`;

let content = '';

	content += 'LIVE BY CLUB: <ul>';
	content += '</ul>';
	
	content += 'LIVE BY DATE: <ul>';
for (let i=0; i<ldata.length; i++) {
	content += '<li>' + ldata[i] + "</li>";
}
	content += '</ul>';
	
	
let content_clubs = '';
for (let i=0; i<clubs.length; i++) {
	content_clubs += "<h2>" + clubs[i].name + "</h2>";
	for (let j=0; j<clubs[i].data.length; j++) {
		 let entry = template.replace(/POS/g, (j + 1))
		    .replace(/SLUG/g, clubs[i].data[j].slug)
		    .replace(/NAME/g, clubs[i].data[j].name)
		    .replace(/WEBSITE/g, clubs[i].data[j].website);
		  entry = entry.replace('<a href=\'http:///\'></a>', '-');
		  content_clubs += entry;
		}
}
	document.getElementById('content_clubs').innerHTML = content_clubs;		
	
	
document.getElementById('content').innerHTML = content;

// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Requesting permission for Notifications after clicking on the button
//const button = document.getElementById('notifications');
//button.addEventListener('click', () => {
//  Notification.requestPermission().then((result) => {
//    if (result === 'granted') {
//      randomNotification();
//    }
//  });
//});

// Setting up random Notification
function randomNotification() {
  const randomItem = Math.floor(Math.random() * clubs.length);
  const notifTitle = clubs[randomItem].name;
  const notifBody = `Created by ${clubs[randomItem].author}.`;
  const notifImg = `data/img/${clubs[randomItem].slug}.jpg`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000);
}

// Progressive loading images
const imagesToLoad = document.querySelectorAll('img[data-src]');
const loadImages = (image) => {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((items) => {
    items.forEach((item) => {
      if (item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target);
      }
    });
  });
  imagesToLoad.forEach((img) => {
    observer.observe(img);
  });
} else {
  imagesToLoad.forEach((img) => {
    loadImages(img);
  });
}
