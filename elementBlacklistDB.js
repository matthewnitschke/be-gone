var eleBlacklistDB = (function(){
  var eDB = {};
  var datastore = null;

  eDB.open = function(callback){
    var version = 1;

    var request = indexedDB.open('eleBlacklist', version);

    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('eleBlacklist')) {
        db.deleteObjectStore('eleBlacklist');
      }

      // Create a new datastore.
      var store = db.createObjectStore('eleBlacklist', {
        keyPath: 'timestamp'
      });
    };

    request.onsuccess = function(e) {
      datastore = e.target.result;

      callback();
    };

    request.onerror = tDB.onerror;
  }

  eDB.fetchEleBlacklists = function(callback){
    var db = datastore;
    var transaction = db.transaction(['eleBlacklist'], 'readwrite');
    var objStore = transaction.objectStore('eleBlacklist');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var elements = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(elements);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;

      if (!!result == false) {
        return;
      }

      elements.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = tDB.onerror;
  }

  eDB.createEleBlacklist = function(selector, url, callback){
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['eleBlacklist'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('eleBlacklist');

    // Create an object for the todo item.
    var ele = {
      'selector': selector,
      'url': url
    };

    // Create the datastore request.
    var request = objStore.put(ele);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      // Execute the callback function.
      callback(ele);
    };

    // Handle errors.
    request.onerror = tDB.onerror;
  }

  eDB.deleteEleBlacklist = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['eleBlacklist'], 'readwrite');
    var objStore = transaction.objectStore('eleBlacklist');

    var request = objStore.delete(id);

    request.onsuccess = function(e) {
      callback();
    }

    request.onerror = function(e) {
      console.log(e);
    }
  };

  return eDB;

}());
