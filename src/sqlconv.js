const fileInput = document.getElementById('file-input');
const sqlOutput = document.getElementById('sql-output');
const loadingOverlay = document.getElementById('loading-overlay');
const footer = document.querySelector('footer');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file.type !== 'text/csv') {
        alert('❌ Please upload only .csv files !');
        return;
    }

    // Moving the container of the file-input to the top of the screen
    fileInput.parentNode.classList.add('file-uploaded');

    // Showing loading overlay
    loadingOverlay.style.display = 'block';

    // Show notification
    const notification = showNotification("Your file is being processed, hang tight.");
    setTimeout(() => {
        hideNotification(notification);
        // Starting the fade-out animation
        footer.style.opacity = '0';
        
        setTimeout(() => {
            footer.style.display = 'none';
        }, 700);
    }, 8000); // Hide notification box after 8 seconds

    const reader = new FileReader();
    reader.onload = () => {
        const text = reader.result;
        const lines = text.split('\n').slice(1); //skipparw to header row pou exei ola ta attributes
        const numRowsRead = lines.length - 1; // Subtracting 1 for the header row
        const sqlCommands = lines.map((line, i) => {
            const values = line.split(','); // The value of attributes are getting splited by ',' in csv files
            return `<li>INSERT INTO myTable VALUES (${values.map(value => `'${value}'`).join(', ')});</li>`;
        }).filter(command => command !== "<li>INSERT INTO myTable VALUES ('');</li>"); //filter avoids displaying blank data

        // Hiding loading overlay after 10 seconds
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            sqlOutput.innerHTML = `<p>~ Rows Read from CSV : <span style="color: rgb(255, 153, 0); font-weight: bold;">${numRowsRead}</span></p><ul>${sqlCommands.join('')}</ul>`;
        }, 9000);
    };
    reader.readAsText(file);
});

// Function to show the notification of the loading msg
function showNotification(msg) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<span class="close">&times;</span>${msg}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.right = '20px';
    }, 100);
    return notification;
}

// Function to hide the notification
function hideNotification(notification) {
    notification.style.right = '-300px';
    setTimeout(() => {
        notification.remove();
    }, 500); // Waiting for the animation to complete before removing
}

// Close button functionality
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('close')) {
        const notification = e.target.parentNode;
        hideNotification(notification);
    }
});
