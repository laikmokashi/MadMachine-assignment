const button = document.getElementById('send-request');

// we are using array for temporary storing api calls
// we can also use browser db such as indexdb for bigger application
const requestQueue = []; 
// indicator will become green for online and red for offline 
if (navigator.onLine) {
    document.getElementById('indicator').style.backgroundColor = 'green'
  } else {
    document.getElementById('indicator').style.backgroundColor = 'red'
  }

  //event handler for hit me button , request sent once hit me button gets cliked
function sendRequest() {
    const url = 'https://webhook.site/6553b826-b49b-47ae-9b6a-c924a0c506af'; 
    //checking if systme in online or offline 
    if (navigator.onLine) {
        // if online hitting requested api
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/html; charset=UTF-8',
            },
            mode: 'no-cors'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Request successful:', data)
            document.getElementById('action').style.display = 'block'
            document.getElementById('action').style.color = 'green'
            document.getElementById('action').innerHTML = 'Action performed successfully'
            setTimeout(() => {
                document.getElementById('action').style.display = 'none'
            }, 5000);
        })
        .catch(error =>{ console.error('Request failed:', error)
            document.getElementById('action').style.display = 'block'
            document.getElementById('action').style.color = 'red'
            document.getElementById('action').innerHTML = 'API Error'
            setTimeout(() => {
                document.getElementById('action').style.display = 'none'
            }, 5000);
        });
    } else {
        // store the request if offline
        requestQueue.push({ url });
        console.log('Request queued. You are offline.');
        document.getElementById('action').style.display = 'block'
            document.getElementById('action').style.color = 'red'
            document.getElementById('action').innerHTML = 'System is Offline! Action will perform once system backs online'
            setTimeout(() => {
                document.getElementById('action').style.display = 'none'
            }, 5000);
    }
}
// adding event listener on hit me button
button.addEventListener('click', sendRequest);
//changing indicator to offline 
window.addEventListener('offline', () => {
    document.getElementById('indicator').style.backgroundColor = 'red'
})
// Listen for online event to process stored requests
window.addEventListener('online', () => {
    //changing indicator to online 
    document.getElementById('indicator').style.backgroundColor = 'green'
    document.getElementById('action').style.display = 'block'
            document.getElementById('action').style.color = 'green'
            document.getElementById('action').innerHTML = 'System is online. All actions will perform again'
            setTimeout(() => {
                document.getElementById('action').style.display = 'none'
            }, 5000);
    console.log('Back online. Processing queued requests.');

    while (requestQueue.length > 0) {
        const { url } = requestQueue.shift(); // calling api which gets stored first and removing from storage
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors'
        })
        .then(response => response.json())
        .then(data => console.log('Request successful:', data))
        .catch(error => {console.error('Request failed:', error)
            document.getElementById('action').style.display = 'block'
            document.getElementById('action').style.color = 'red'
            document.getElementById('action').innerHTML = 'API Error'
            setTimeout(() => {
                document.getElementById('action').style.display = 'none'
            }, 5000);
        });
    }
});

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}
