// sort by last visit date
let sort_latest = '';
let sorted = [];
counter = 0;
for (let key in visits) {
	sorted.push([key, visits[key][0], visits[key][visits[key].length-1]]);
}
sorted.sort(function compare(a, b) {if (a[2] == b[2]) return 0; return a[2] > b[2] ? -1 : 1; });
let cur_year = 0;
for (let i=0; i<sorted.length; i++) {
	let this_year = new Date(sorted[i][2]).getFullYear();
	if (this_year != cur_year) {
		if (cur_year != 0)
			sort_latest += "</ol>";
		sort_latest += "<b>" + this_year + "</b>\n";
		sort_latest += "<ol>";
		cur_year = this_year;
	}
	sort_latest += "<li>" + sorted[i][0] + ": " + sorted[i][2] + "</li>\n";
}
sort_latest += "</ol>";
document.getElementById('sort_latest').innerHTML = sort_latest;


// sort by first visit date
let sort_first = '';
sorted.sort(function compare(a, b) {if (a[1] == b[1]) return 0; return a[1] > b[1] ? -1 : 1; });
cur_year = 0;
for (let i=0; i<sorted.length; i++) {
	let this_year = new Date(sorted[i][1]).getFullYear();
	if (this_year != cur_year) {
		if (cur_year != 0)
			sort_first += "</ol>";
		sort_first += "<b>" + this_year + "</b>\n";
		sort_first += "<ol>";
		cur_year = this_year;
	}
	sort_first += "<li>" + sorted[i][0] + ": " + sorted[i][1] + "</li>\n";
}
sort_first += "</ol>";
document.getElementById('sort_first').innerHTML = sort_first;


// all visits
let all_visits = '';
let sorted_visits = [];
counter = 0;
for (let key in visits) {
	for (let i=0; i<visits[key].length; i++) {
		sorted_visits.push([key, visits[key][i]]);
	}
}
sorted_visits.sort(function compare(a, b) {if (a[1] == b[1]) return 0; return a[1] > b[1] ? -1 : 1; });
cur_year = 0;
let count = sorted_visits.length;
for (let i=0; i<sorted_visits.length; i++) {
	let this_year = new Date(sorted_visits[i][1]).getFullYear();
	if (this_year != cur_year) {
		if (cur_year != 0)
			all_visits += "</ol>";
		all_visits += "<b>" + this_year + "</b>\n";
		all_visits += "<ol>";
		cur_year = this_year;
	}
	all_visits += "<li>" + "(# " + count-- + ") " + sorted_visits[i][0] + ": " + sorted_visits[i][1] + "</li>\n";
}
all_visits += "</ol>";
document.getElementById('all_visits').innerHTML = all_visits;



// Registering Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

