// Generating content based on the template
const template = `<article>
  &nbsp;&nbsp;&nbsp;POS. <a href="WEBSITE">NAME</a> <i>LASTVISIT</i> LIVE
</article>`;

let date_today = new Date();
let month = (date_today.getMonth() < 9) ? "0" + (date_today.getMonth()+1) : (date_today.getMonth()+1);
let day = (date_today.getDate() < 10) ? "0" + date_today.getDate() : date_today.getDate();
let today = date_today.getFullYear() + "-" + month + "-" + day;

// testing
// today = '2022-12-01';

document.getElementById('today').innerHTML = today;
	
let content_clubs = '';
let counter = 0;
for (let i=0; i<clubs.length; i++) {
	content_clubs += "<h2>" + clubs[i].name + "</h2>";
	for (let j=0; j<clubs[i].data.length; j++) {
		 let entry = template.replace(/POS/g,  + ++counter + '.' + (i+1))
		    .replace(/SLUG/g, clubs[i].data[j].slug)
		    .replace(/NAME/g, clubs[i].data[j].name)
		    .replace(/WEBSITE/g, clubs[i].data[j].website);
		  entry = entry.replace('<a href=\'http:///\'></a>', '-');
		  let slug = clubs[i].data[j].slug;
		  if (visits[slug]) {
				let first = visits[slug][0];
			  	let last = visits[slug][visits[slug].length-1];
			  	if (first != last) 
			  		last = first + " &hellip; " + last;
			  	last = ''; // clear above, which adds "2010-06-04 … 2019-05-31" or "2011-11-05"
			  	last += " (" + visits[slug].length + "x)"
			  	entry = entry.replace(/LASTVISIT/g, last);
		  } else {
			entry = entry.replace(/LASTVISIT/g, "");
			}
		if (schedule[today][slug]) {
			let live = '';
			let count = schedule[today][slug].length;
			if (count == 1) {
				live += ' ' + schedule[today][slug][0];
			} else {
				for (let k=1; k<=count; k++) {
					live += ' [#' + k + "/" + count + '] ' + schedule[today][slug][k-1];
				}
			}
			entry = entry.replace(/LIVE/g, live);
		} else {
			entry = entry.replace(/LIVE/g, "");
		}
		  content_clubs += entry;
		}
}
	document.getElementById('content_clubs').innerHTML = content_clubs;		
	
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
//function randomNotification() {
//  const randomItem = Math.floor(Math.random() * clubs.length);
//  const notifTitle = clubs[randomItem].name;
//  const notifBody = `Created by ${clubs[randomItem].author}.`;
//  const notifImg = `data/img/${clubs[randomItem].slug}.jpg`;
//  const options = {
//    body: notifBody,
//    icon: notifImg,
//  };
//  new Notification(notifTitle, options);
//  setTimeout(randomNotification, 30000);
//}
//
//// Progressive loading images
//const imagesToLoad = document.querySelectorAll('img[data-src]');
//const loadImages = (image) => {
//  image.setAttribute('src', image.getAttribute('data-src'));
//  image.onload = () => {
//    image.removeAttribute('data-src');
//  };
//};
//if ('IntersectionObserver' in window) {
//  const observer = new IntersectionObserver((items) => {
//    items.forEach((item) => {
//      if (item.isIntersecting) {
//        loadImages(item.target);
//        observer.unobserve(item.target);
//      }
//    });
//  });
//  imagesToLoad.forEach((img) => {
//    observer.observe(img);
//  });
//} else {
//  imagesToLoad.forEach((img) => {
//    loadImages(img);
//  });
//}
//