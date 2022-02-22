// this is the indexedDB file to handle offline pizza saving

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
        uploadPizza()
    }
}

request.onerror = function(event) {
    console.log(event.target.errorCode)
}

function saveRecord(record) {
    const transaction = db.transaction(['new_pizza'], 'readwrite')

    const pizzaObjectStore = transaction.objectStore('new_pizza')

    pizzaObjectStore.add(record)
}

function uploadPizza() {
    // open a transaction on your db
    const transaction = db.transaction(['new_pizza'], 'readwrite');
  
    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');
  
    // get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();
    
    // upon sucessful get all 
    getAll.onsuccess = function() {
    // send indexedDB data to server
    if (getAll.result.length > 0) {
        fetch('/api/pizzas', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(serverResponse => {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(['new_pizza'], 'readwrite');
            // access the new_pizza object store
            const pizzaObjectStore = transaction.objectStore('new_pizza');
            // clear all items in your store
            pizzaObjectStore.clear();
  
            alert('All saved pizza has been submitted!');
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
}

window.addEventListener('online', uploadPizza)