// this is the indexDB file

// create variable to hold db connection
let db
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1)


request.onupgradeneeded = function(event) {
    
    // save reference to global variable
    const db = event.target.result

    // create an object store (table) with auto incrementing key
    db.createObjectStore('new_pizza', { autoIncrement: true })
}

request.onsuccess = function(event) {
    
    // on successful db creation save to global variable 
    db = event.target.result

    if (navigator.onLine) {
        // stuff here 
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode)
}