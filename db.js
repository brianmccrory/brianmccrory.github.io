let db;
let dbReq = indexedDB.open('scheduledb', 13);
let reverseOrder = false;

dbReq.onupgradeneeded = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;

  // Create an object store named notes. Object stores
  // in databases are where data are stored.
  let notes;
  if (!db.objectStoreNames.contains('notes')) {
  		notes = db.createObjectStore('notes', {autoIncrement: true});
  	} else {
		notes = dbReq.transaction.objectStore('notes');
	}
	
	if (!notes.indexNames.contains('timestamp')) {
		notes.createIndex('timestamp', 'timestamp');
	}
	
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
//  getAndDisplayNotes(db);  
//  getAndDisplaySavedLives(db);
//displayLives();
  
// DEBUG: already loaded to cache, so commment:
//  clearAllLives(db); // changed to clearCache()
//  copyLivesToStorage(db, schedule); // changed to populateCache()

//  mergeScheduleToStorage(db, schedule);

  getAndDisplayLiveCache();

}
dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

function addStickyNote(db, message) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes');  // Put the sticky note into the object store
  let note = {text: message, timestamp: Date.now()};
  store.add(note);  // Wait for the database transaction to complete
  tx.oncomplete = function() { 
	getAndDisplayNotes(db); 
	}
  tx.onerror = function(event) {
    alert('error storing note ' + event.target.errorCode);
  }
}

function submitNote() {
  let message = document.getElementById('newmessage');
  addStickyNote(db, message.value);
  message.value = '';
}

function flipNoteOrder(notes) {
	reverseOrder = !reverseOrder;
	getAndDisplayNotes(db);
}


function saveLive(name) {
	addSavedLive(db, name);
}

function deleteLive(key) {
	deleteSavedLive(db, key);
}

function addSavedLive(db, name) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction(['savedLives'], 'readwrite');
  let store = tx.objectStore('savedLives');  // Put the sticky note into the object store
  let savedLive = {name: name};
  store.add(savedLive);  // Wait for the database transaction to complete
  tx.oncomplete = function() { 
	// no need to reload anymore...
//	getAndDisplaySavedLives(db); 
	}
  tx.onerror = function(event) {
    alert('error saving live' + event.target.errorCode);
  }
}

function deleteSavedLive(db, key) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction(['savedLives'], 'readwrite');
  let store = tx.objectStore('savedLives');  // Put the sticky note into the object store
  store.delete(key);  // Wait for the database transaction to complete
  tx.oncomplete = function() {
	// no need to reload anymore... 
//	getAndDisplaySavedLives(db); 
	}
  tx.onerror = function(event) {
    alert('error deleting live' + event.target.errorCode);
  }
}


function getAndDisplayNotes(db) {
  let tx = db.transaction(['notes'], 'readonly');
  let store = tx.objectStore('notes');  
  let index = store.index('timestamp');
  
  // Create a cursor request to get all items in the store, which 
  // we collect in the allNotes array
  let req = store.openCursor(null, reverseOrder ? 'prev' : 'next');
  let allNotes = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;    
    if (cursor != null) {      // If the cursor isn't null, we got an IndexedDB item.
      // Add it to the note array and have the cursor continue!
      allNotes.push(cursor.value);
      cursor.continue();    
     } else {      // If we have a null cursor, it means we've gotten
      // all the items in the store, so display the notes we got
      displayNotes(allNotes);    
     }
  }
} 
    
    
function displayNotes(notes) {
  let listHTML = '<ul>';
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    listHTML += '<li>' + note.text + ' ' + 
      new Date(note.timestamp).toString() + '</li>';
  }
  document.getElementById('notes').innerHTML = listHTML;
}


function getAndDisplaySavedLives(db) {
  let tx = db.transaction(['savedLives'], 'readonly');
  let store = tx.objectStore('savedLives');  
  let req = store.openCursor(null, 'next'); // TODO: support reverse order
  let allSavedLives = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;    
    if (cursor != null) {      // If the cursor isn't null, we got an IndexedDB item.
      // Add it to the note array and have the cursor continue!
      allSavedLives.push({key: cursor.key, value: cursor.value});
      cursor.continue();    
     } else {      // If we have a null cursor, it means we've gotten
      // all the items in the store, so display the notes we got
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
    if (cursor != null) {      // If the cursor isn't null, we got an IndexedDB item.
      // Add it to the note array and have the cursor continue!
      allSavedLives.push({key: cursor.key, value: cursor.value});
      cursor.continue();    
     } else {      // If we have a null cursor, it means we've gotten
      // all the items in the store, so display the notes we got
      return allSavedLives;   
     }
  }
  req.onerror = function(event) {
  	alert('error in cursor request ' + event.target.errorCode);
  }
}

function displaySavedLives(savedLives) {
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
	tx.oncomplete = function() {
		console.log('clearAllLives allLives table cleared');
		 document.getElementById('clearCacheMessage').innerHTML = "Cache cleared at " + new Date().toDateString() + " " + new Date().toLocaleTimeString();
		 setTimeout(function() { document.getElementById('clearCacheMessage').innerHTML = "";}, 3000);
	};
}


function populateCache() {
	let tx = db.transaction(['allLives'], 'readwrite');
	let store = tx.objectStore('allLives');
	let count = 0;
//	console.log('copyLivesToStorage size='  + Object.keys(schedule).length);
	for (let date in schedule) {
//		console.log('copyLivesToStorage date=' + date + ' size='  + Object.keys(schedule[date]).length);	
		for (let club in schedule[date]) {
//			console.log('copyLivesToStorage date=' + date + ' club=' + club + ' size='  + schedule[date][club].length);	
			for (let i=0; i<schedule[date][club].length; i++) {
				let eventTitle = "'" + schedule[date][club][i] + "'";
				let event = {'date': date, 'club': club, 'event': eventTitle, 'timestamp': Date.now()};
				store.add(event);
				count++;
			}
		}
	}
	
	tx.oncomplete = function() {
		console.log('copyLivesToStorage complete count=' + count);
		document.getElementById('populateCacheMessage').innerHTML = "Cache populated at " + new Date().toDateString() + " " + new Date().toLocaleTimeString();
		setTimeout(function() { document.getElementById('populateCacheMessage').innerHTML = "";}, 3000);
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
  let liveCache = []; // TODO: instead of an array, maybe an object?

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;
    if (cursor != null) {      // If the cursor isn't null, we got an IndexedDB item.
		liveCache.push({key: cursor.key, value: cursor.value});
      	cursor.continue();    
     } else {
		console.log("number of rows: " + liveCache.length);
		displayLiveCache(liveCache);
     }
  }
  req.onerror = function(event) {
  	alert('getLiveCache error in cursor request ' + event.target.errorCode);
  }
}


function displayLiveCache(liveCache) {
// moved and modified from app-schedule.js where it was running inline 
	let savedContent = '<ul>';
	let content = '<ul>';
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
			content += "</ul><h3>" + date + "</h3><ul>\n";
			curDate = date;
		}
		content += `<li id="li${key}" class="hide${isSaved}"> [${key}] [<a href='' id='${key}' onclick="toggleIsSaved(${key}, ${isSaved});`;
		content += ` document.getElementById('li${key}').removeClass('hide${activeLabel}').addClass('hide${inactiveLabel}');`;
		content += ` document.getElementById('${key}').innerHTML='${savedLabel}'; return false;">${unsavedLabel}</a>] `;
		content +=  obj['club'] + ": " + obj['event'];
		content += " isSaved=" + isSaved + " obj[isSaved]=" + obj['isSaved'] + " ";
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
