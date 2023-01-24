let db;
let dbReq = indexedDB.open('scheduledb', 13);
let reverseOrder = false;
let latestDate = '';
let startDate = new Date();
let endDate = new Date();
let liveCache = [];

dbReq.onupgradeneeded = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;

	let savedLives;
  if (!db.objectStoreNames.contains('savedLives')) {
  		savedLives = db.createObjectStore('savedLives', {autoIncrement: true});
  	} else {
		savedLives = dbReq.transaction.objectStore('savedLives');
	}
	if (!savedLives.indexNames.contains('name')) {
		savedLives.createIndex('name', 'name', { unique: true });
	}	
	
	let allLives;
  if (!db.objectStoreNames.contains('allLives')) {
  		allLives = db.createObjectStore('allLives', {autoIncrement: true});
  	} else {
		allLives = dbReq.transaction.objectStore('allLives');
	}
	if (!allLives.indexNames.contains('date')) {
		allLives.createIndex('date', 'date', {unique: false});
	}
	if (!allLives.indexNames.contains('club')) {
		allLives.createIndex('club', 'club', {unique: false});
	}
}
dbReq.onsuccess = function(event) {
  db = event.target.result;
  
// DEBUG: already loaded to cache, so commment:
//  clearAllLives(db); // changed to clearCache()
//  copyLivesToStorage(db, schedule); // changed to populateCache()

//  mergeScheduleToStorage(db, schedule);

	if (liveCache.size == 0) {
		populateCache(1);	
	}
  	getAndDisplayLiveCache();

}
dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

function saveLive(name) {
	addSavedLive(db, name);
}

function deleteLive(key) {
	deleteSavedLive(db, key);
}

function addSavedLive(db, name) {
  let tx = db.transaction(['savedLives'], 'readwrite');
  let store = tx.objectStore('savedLives');
  let savedLive = {name: name};
  store.add(savedLive);
  tx.oncomplete = function() { 
	// no need to reload anymore...
//	getAndDisplaySavedLives(db); 
	}
  tx.onerror = function(event) {
    alert('error saving live' + event.target.errorCode);
  }
}

function deleteSavedLive(db, key) {
  let tx = db.transaction(['savedLives'], 'readwrite');
  let store = tx.objectStore('savedLives');
  store.delete(key);
  tx.oncomplete = function() {
	// no need to reload anymore... 
//	getAndDisplaySavedLives(db); 
	}
  tx.onerror = function(event) {
    alert('error deleting live' + event.target.errorCode);
  }
}


function getAndDisplaySavedLives(db) {
  let tx = db.transaction(['savedLives'], 'readonly');
  let store = tx.objectStore('savedLives');  
  let req = store.openCursor(null, 'next'); // TODO: support reverse order
  let allSavedLives = [];

  req.onsuccess = function(event) {
    let cursor = event.target.result;    
    if (cursor != null) {
      allSavedLives.push({key: cursor.key, value: cursor.value});
      cursor.continue();    
     } else {
      displaySavedLives(allSavedLives);    
     }
  }
  req.onerror = function(event) {
  	alert('error in cursor request ' + event.target.errorCode);
  }
}

function getSavedLives(db) {
  let tx = db.transaction(['savedLives'], 'readonly');
  let store = tx.objectStore('savedLives');  
  let req = store.openCursor(null, 'next'); // TODO: support reverse order
  let allSavedLives = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;    
    if (cursor != null) {
      allSavedLives.push({key: cursor.key, value: cursor.value});
      cursor.continue();    
     } else {
      return allSavedLives;   
     }
  }
  req.onerror = function(event) {
  	alert('error in cursor request ' + event.target.errorCode);
  }
}


function displaySavedLives(savedLives) {
	document.getElementById('savedLives').innerHTML = '';

  let listHTML = '<ul>';
  for (let i = 0; i < savedLives.length; i++) {
    let savedLive = savedLives[i];
    listHTML += '<span id="' + savedLive.key + '"><li>' + savedLive.key + ": " + savedLive.value.name;
    listHTML += ` <a href='' onclick='deleteLive(${savedLive.key}); `;
    listHTML += `document.getElementById("${savedLive.key}").style.display="none"; return false;'>remove</a></li></span>`;
  }
  document.getElementById('savedLives').innerHTML = listHTML;
}



function clearCache() {
	let tx = db.transaction(['allLives'], 'readwrite');
	let store = tx.objectStore('allLives');
	store.clear();
	latestDate = "";
	tx.oncomplete = function() {
		showStartEndDates();
		showDebugMessage("Cache cleared");
		displayLiveCache();
	};
}

function setLatestDate() {
	latestDate = document.getElementById('latestDateEntry').value;
	showStartEndDates();
}

function pruneCache() {
	showDebugMessage("Cache pruned (TBD: not implemented yet)");
}

function showDebugMessage(message) {
	document.getElementById('debugMessage').innerHTML = message + " (" + new Date().toDateString() + " " + new Date().toLocaleTimeString() + ")";
	setTimeout(function() { document.getElementById('debugMessage').innerHTML = "";}, 3000);	
}

function showLatestDateEntry(message) {
	document.getElementById('latestDateEntry').value = message;	
}
function showStartEndDates() {
//	document.getElementById('latestDate').innerHTML = message;	
	document.getElementById('startDate').innerHTML = startDate.toDateString();	
	document.getElementById('endDate').innerHTML = endDate.toDateString();	
}

function populateCache(addDays) {
	let tx = db.transaction(['allLives'], 'readwrite');
	let store = tx.objectStore('allLives');
	let count = 0;
	let findStartDate;
	let findEndDate;
	if (endDate) {
		findStartDate = new Date(endDate); // start from previous end date
	} else {
		findStartDate = new Date(); // start from today
	}
	findEndDate = new Date(findStartDate);
	findEndDate.setDate(findEndDate.getDate() + addDays);

	startDate = findStartDate; // update startDate
	endDate = findEndDate; // update endDate
	showStartEndDates();
	
	console.log("start=" + findStartDate + " end=" + findEndDate);

	for (let date in schedule) {
		if (new Date(date) < findStartDate)
			continue;
		if (new Date(date) > findEndDate)
			break;
		console.log("Adding events for date=" + date);
		for (let club in schedule[date]) {
			for (let i=0; i<schedule[date][club].length; i++) { // handles single/multiple events at club on one day
				let eventTitle = "'" + schedule[date][club][i] + "'";
				let event = {'date': date, 'club': club, 'event': eventTitle, 'timestamp': Date.now()};
				store.add(event);
				count++;
			}
		}
		console.log( "Added " + count + " events to store using store.add(event)");
	}
	
	tx.oncomplete = function() {
		console.log("Cache populated with " + count + " events");
		showDebugMessage("Cache populated with " + count + " events");
		getAndDisplayLiveCache();
	}

  tx.onerror = function(event) {
    alert('error storing allLives');
  }
}

// upon a page refresh, merge the schedule from schedule.js with data in indexeddb (favoring indexdb data)
function mergeScheduleToStorage(db, schedule) {
// TODO
}


// OBSOLETE: REPLACED WITH displayLiveCache
//function displayLives() {
//// moved and modified from app-schedule.js where it was running inline 
//	let content = '';
//	for (let date in schedule) {
//		content += "<h3>" + date + "</h3><ul>\n";
//		for (let slug in schedule[date]) {
//			let live = '';
//				let count = schedule[date][slug].length;
//				if (count == 1) {
//					live += ' ' + schedule[date][slug][0];
//				} else {
//					for (let k=1; k<=count; k++) {
//						live += ' [#' + k + "/" + count + '] ' + schedule[date][slug][k-1];
//					}
//				}
//			let liveId = date.replaceAll("-", ".") + "." + slug.replace(/[^a-zA-Z0-9_]/, ".");
//			content += `<li> <a href='' id='${liveId}' onclick="saveLive('${liveId}'); document.getElementById('${liveId}').innerHTML=''; return false;">save</a> `;
//			content +=  slug + ": " + live + "</li>\n";
//		}
//		content += "</ul>\n";
//	//	document.getElementById('content').innerHTML = content;		
//	}
//	document.getElementById('content').innerHTML = content;			
//}


function getAndDisplayLiveCache() {
  let tx = db.transaction(['allLives'], 'readonly');
  let store = tx.objectStore('allLives');  
  let req = store.openCursor(null, 'next'); // TODO: support reverse order

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;
    if (cursor != null) {      // If the cursor isn't null, we got an IndexedDB item.
		liveCache.push({key: cursor.key, value: cursor.value});
      	cursor.continue();    
      console.log("cursor=" + cursor.key + " " + cursor.value.name);

     } else {
		displayLiveCache(liveCache);
		getCacheLatestDate();
     }
  }
  req.onerror = function(event) {
  	alert('getLiveCache error in cursor request ' + event.target.errorCode);
  }
}


function displayLiveCache(liveCache) {
	document.getElementById('content').innerHTML = 'Updating...';
	let savedContent = 'SAVED CONTENT: <ul>';
	let content = 'CONTENT: <ul>';
	let curDate = '';
	for (let row in liveCache) {
		let key = liveCache[row].key;
		let obj = liveCache[row].value; 
		let date = obj['date'];
		let activeLabel = 'unsave';
		let inactiveLabel = 'save';
		let isSaved = obj['isSaved'] ? true : false; // handle undefined case by changing to false
		let savedLabel = activeLabel;
		let unsavedLabel = inactiveLabel;
		if (isSaved == true) {
			savedLabel = inactiveLabel;
			unsavedLabel = activeLabel;
		}
		if (curDate != date) {
			content += `</ul><h3>${date}</h3><ul>\n`;
			curDate = date;
		}
		content += `<li id="li${key}" class="hide${isSaved}"> [${key}] [<a href='' id='${key}' onclick="toggleIsSaved(${key}, ${isSaved});`;
		content += ` document.getElementById('li${key}').removeClass('hide${activeLabel}').addClass('hide${inactiveLabel}');`;
		content += ` document.getElementById('${key}').innerHTML='${savedLabel}'; return false;">${unsavedLabel}</a>] `;
		content +=  ` [<a href='' id ='${key}' onclick="; return false;">delete</a>] `;
		content +=  obj['club'] + ": " + obj['event'];
//		content += " isSaved=" + isSaved + " obj[isSaved]=" + obj['isSaved'] + " ";
		content += "</li>\n";
		if (isSaved == true) {
			// TODO: if not already in savedContent...
			savedContent += `<li> [${key}] ${date} `;
			savedContent +=  obj['club'] + ": " + obj['event'] + " isSaved=" + isSaved + " obj[isSaved]=" + obj['isSaved'] + "</li>\n";				
		}
	}
	content += "</ul>\n";
	savedContent += "</ul>\n";	
	// TODO: consider: either update all at once, or row-by-row
	document.getElementById('content').innerHTML = content;			
	document.getElementById('savedContent').innerHTML = savedContent;			
}

function toggleIsSaved(key, isSaved) {
	console.log('toggleIsSaved key=' + key + " isSaved=" + isSaved);
  let tx = db.transaction(['allLives'], 'readwrite');
  let store = tx.objectStore('allLives');
  let req = store.get(key); // or +key if sent as 'string', to turn key into a number
  req.onsuccess = function(event) {
	let obj = event.target.result;
	if (obj) {
		obj.isSaved = (isSaved == true) ? false : true;
		let updateReq = store.put(obj, key); // or +key if you sent param as 'string'
		updateReq.onsuccess = function() {
			console.log("updated isSaved");
			document.getElementById('savedContent').innerHTML += "<ul><li>" + obj.date + ' ' + obj.club + ' ' + obj.event + " isSaved=" + isSaved + " obj.isSaved=" + obj.isSaved + "</li></ul>";
		}
	} else {
		console.log("Object " + key + " not found");
	}
  }
	req.onerror = function(event) {
		console.log("error getting obj " + key + " " + event.target.errorCode);
	}	

  tx.oncomplete = function() { 
	// no need to reload anymore
//	getAndDisplaySavedLives(db); 
	}
  tx.onerror = function(event) {
    alert('toggleIsSaved error saving live' + event.target.errorCode);
  }	
}

function getCacheLatestDate() {
  let tx = db.transaction(['allLives'], 'readonly');
  let store = tx.objectStore('allLives');  
  let index = store.index('date');
  let req = store.openCursor(null, 'prev'); // 
  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;
    if (cursor != null) {      // If the cursor isn't null, we got an IndexedDB item.
		latestDate = cursor.value.date;
		showStartEndDates();
      	// cursor.continue();    
     } else {
//		latestDate = '';
		showStartEndDates();
		// displayLiveCache(liveCache);
		console.log("End of cursor, latestDate=" + latestDate);
     }
  }
  req.onerror = function(event) {
  	alert('getCacheLatestDate error in cursor request ' + event.target.errorCode);
  }
}
