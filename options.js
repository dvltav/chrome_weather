// Saves options to chrome.storage
function save_options() {
  var windGust = document.getElementById('windGust').value;
  var disable = document.getElementById('disable').checked;
  chrome.storage.sync.set({
    windGust: windGust,
    disable: disable
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  console.log("restore_options");
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    windGust: '10',
    disable: false
  }, function(items) {
    document.getElementById('windGust').value = items.windGust;
    document.getElementById('disable').checked = items.disable;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);