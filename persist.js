



// Requesting permission for Notifications after clicking on the button
const button = document.getElementById('persist');
button.addEventListener('click', () => {
  console.log("persisted");
  // Check if site's storage has been marked as persistent
if (navigator.storage && navigator.storage.persist) {
//  const isPersisted = await navigator.storage.persisted();
  const isPersisted = navigator.storage.persisted();
  console.log(`Persisted storage granted: ${isPersisted}`);
} else {
	console.log("Persisted storage not available");
}
});

