
let content = '';
for (let date in schedule) {
	content += "<h3>" + date + "</h3><ul>\n";
	for (let slug in schedule[date]) {
		content += "<li>" + slug + ": ";
		let live = '';
			let count = schedule[date][slug].length;
			if (count == 1) {
				live += ' ' + schedule[date][slug][0];
			} else {
				for (let k=1; k<=count; k++) {
					live += ' [#' + k + "/" + count + '] ' + schedule[date][slug][k-1];
				}
			}
		content += live + "</li>\n";
	}
	content += "</ul>\n";
}
document.getElementById('content').innerHTML = content;		
	
// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
