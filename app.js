// Sample data structure to store users and their pushups
let users = JSON.parse(localStorage.getItem('users')) || [];
let isAdmin = false; // Add this variable to track admin status

// References to page elements
const pages = {
    landing: document.getElementById('landing-page'),
    userSelection: document.getElementById('user-selection'),
    pushupEntry: document.getElementById('pushup-entry'),
    pushupStats: document.getElementById('pushup-stats'),
    adminLogin: document.getElementById('admin-login'), // Add this reference
};
const userList = document.getElementById('user-list');
const deleteButton = document.getElementById('delete-user'); // Add this reference
// Event listener for the "Reset App and Data" button
document.getElementById('reset-app-button').addEventListener('click', () => {
    const confirmation = confirm('Are you sure you want to reset the app and data? This action cannot be undone.');
    if (confirmation) {
        // Clear local storage to reset app data
        localStorage.clear();

        // Reset the user interface (you may need to customize this part)
        // For example, you can show the Admin Options button here
        // adminOptionsButton.style.display = 'block';

        // Clear user data in the 'users' array
        users = [];

        // Optionally, repopulate the user list and update the UI as needed
        populateUserList();
        toggleSelectExistingUserButton();

        alert('App and data reset successfully.'); // Show a confirmation message
    }
});

// Declare the event listener as a const
const editPushupButton = document.getElementById('edit-pushup');
editPushupButton.addEventListener('click', () => {
    toggleDeleteButtons(true); // Show the "Delete" buttons when editing
});

// Event listeners
document.getElementById('create-user').addEventListener('click', () => createUser());
document.getElementById('existing-user').addEventListener('click', showUserSelectionPage);

// Event listener for the "Start Pushup Entry" button on the user selection page
document.getElementById('start-pushup-entry').addEventListener('click', () => {
    // Set a data attribute to indicate that you reached this page from "Start Pushup Entry"
    editPushupButton.dataset.visible = 'true';
    startPushupEntry();
});

// Event listener for logging pushups and redirecting to statistics page
document.getElementById('log-pushup').addEventListener('click', () => logPushup());
document.getElementById('pushups').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior (form submission)
        document.getElementById('log-pushup').click(); // Trigger a click event on the "Log Pushup" button
    }
});

document.getElementById('back-to-user-selection').addEventListener('click', () => showUserSelectionPage());

// Add an event listener for the "Admin Login" button on the admin login page
document.getElementById('admin-login-button').addEventListener('click', () => adminLogin());


// Event listener for the "Back to Landing Page" button on the admin login page
document.getElementById('back-to-landing').addEventListener('click', () => {
    showPage('landing'); // Call the function to show the landing page
});

document.getElementById('admin-back-to-landing').addEventListener('click', () => {
    showPage('landing'); // Call the function to show the landing page
});

// Add an event listener for the "Admin Options" button
document.getElementById('admin-options-button').addEventListener('click', () => showAdminOptionsPage());




// Add an event listener for the "Admin Login" button on the landing page
document.getElementById('admin-login-button-landing').addEventListener('click', () => showAdminLoginForm());


deleteButton.addEventListener('click', () => deleteUser());

// Event listener for the "View Pushup Statistics" button on the landing page
document.getElementById('view-pushup-stats').addEventListener('click', () => {
    // Make the "Edit Pushup" button invisible
    editPushupButton.style.display = 'none';
    viewPushupStatistics();
});

// Event listener for the "Return to Landing Page" button
document.getElementById('return-to-landing').addEventListener('click', () => {
    // Check if you are on the pushup stats page to toggle the buttons
    if (pages.pushupStats.style.display === 'block') {
        toggleDeleteButtons(false); // Hide the "Delete" buttons when returning to the landing page
    }
    showLandingPage();
});

// Event listener for the "Edit Pushup" button on the statistics page
document.getElementById('edit-pushup').addEventListener('click', () => {
    toggleEditWidgets(); // Show or hide the edit widgets when the button is clicked
});

// ...

// Function to toggle the visibility of edit widgets
function toggleEditWidgets() {
    const editWidgets = document.querySelectorAll('.edit-widget');

    // Loop through each edit widget and toggle its display style
    editWidgets.forEach(widget => {
        widget.style.display = widget.style.display === 'none' ? 'inline-block' : 'none';
    });
}


function renderPushupEntries(user) {
    const pushupList = document.getElementById('pushup-list');
    pushupList.innerHTML = `<strong>${user.name}'s Pushup Statistics</strong><br>`;
    
    user.pushups.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.innerHTML = `${entry.date.toLocaleString()}: ${entry.count} pushups`;
        
        // Create an "Edit" button for each entry
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button'; // Add a class for the edit button
        editButton.style.display = 'none'; // Hide the edit button by default
        
        // Add an event listener to the "Edit" button
        editButton.addEventListener('click', () => editPushupEntry(user, index));

        // Create a "Delete" button for each entry
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button'; // Add a class for the delete button
        deleteButton.style.display = 'none'; // Hide the delete button by default
        
        // Add an event listener to the "Delete" button
        deleteButton.addEventListener('click', () => deletePushupEntry(user, index));

        entryElement.appendChild(editButton);
        entryElement.appendChild(deleteButton);
        pushupList.appendChild(entryElement);
    });
}

// Function to display push-up statistics for a specific user
function displayPushupStats(user) {
    const pushupList = document.getElementById('pushup-list');
    pushupList.innerHTML = `<strong>${user.name}'s Pushup Statistics</strong><br>`;

    user.pushups.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.innerHTML = `${entry.date.toLocaleString()}: ${entry.count} pushups`;

        // Create an "Edit" button for each entry
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button'; // Add a class for the edit button
        editButton.style.display = 'none'; // Hide the edit button by default

        // Add an event listener to the "Edit" button
        editButton.addEventListener('click', () => editPushupEntry(user, index));

        // Create a "Delete" button for each entry
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button'; // Add a class for the delete button
        deleteButton.style.display = 'none'; // Hide the delete button by default

        // Add an event listener to the "Delete" button
        deleteButton.addEventListener('click', () => deletePushupEntry(user, index));

        entryElement.appendChild(editButton);
        entryElement.appendChild(deleteButton);
        pushupList.appendChild(entryElement);
    });
}

function toggleEditButtons() {
    const editButtons = document.querySelectorAll('.edit-button');
    const deleteButtons = document.querySelectorAll('.delete-button');
    const shouldShow = editButtons[0].style.display === 'none'; // Check the first button's state

    editButtons.forEach(button => {
        button.style.display = shouldShow ? 'inline-block' : 'none';
    });
    deleteButtons.forEach(button => {
        button.style.display = shouldShow ? 'inline-block' : 'none';
    });
}

function toggleDeleteButtons(show) {
    const deleteButtons = document.querySelectorAll('.delete-button');
    const displayValue = show ? 'inline-block' : 'none';
    deleteButtons.forEach(button => {
        button.style.display = displayValue;
    });
}

// Event listener for the "Reset App and Data" button
resetAppButton.addEventListener('click', () => {
    if (isAdmin) {
        const confirmation = confirm('Are you sure you want to reset the app and data? This action cannot be undone.');
        if (confirmation) {
            // Clear local storage to reset app data
            localStorage.clear();

            // Reset the user interface (you may need to customize this part)
            // For example, you can show the Admin Options button here
            const adminOptionsButton = document.getElementById('admin-options-button');
            adminOptionsButton.style.display = 'block';

            // Clear user data in the 'users' array
            users = [];

            // Optionally, repopulate the user list and update the UI as needed
            populateUserList();
            toggleSelectExistingUserButton();

            alert('App and data reset successfully.'); // Show a confirmation message
        }
    } else {
        alert('Only administrators can reset the app and data.');
    }
});


// Event listener for the "Edit Pushup" button to show the "Delete" buttons
document.getElementById('edit-pushup').addEventListener('click', () => {
    toggleDeleteButtons(true); // Show the "Delete" buttons when editing
});

// Event listener for the "Return to Landing Page" button
document.getElementById('return-to-landing').addEventListener('click', () => {
    toggleDeleteButtons(false); // Hide the "Delete" buttons when returning to the landing page
});

// Function to delete a pushup entry
function deletePushupEntry(user, entryIndex) {
    const confirmation = confirm(`Are you sure you want to delete this push-up entry for ${user.name}?`);
    if (confirmation) {
        user.pushups.splice(entryIndex, 1);
        saveUserData();
        displayPushupStats(user); // Refresh the displayed statistics
    }
}


// Function to create a new user
function createUser() {
    const username = prompt('Enter your username:');
    if (username) {
        users.push({ name: username, pushups: [] });
        saveUserData();
        populateUserList();
        toggleSelectExistingUserButton();
        showUserSelectionPage();
    }
}

// Function to show the landing page
function showLandingPage() {
    showPage('landing');
}

// Initialize the app by populating the user list and enabling/disabling the "Select Existing User" button
populateUserList();
toggleSelectExistingUserButton();

// Function to populate the user list dropdown and toggle the "Select Existing User" button
function toggleSelectExistingUserButton() {
    // Enable the button if there are users, otherwise, disable it
    const selectExistingUserButton = document.getElementById('existing-user');
    selectExistingUserButton.disabled = users.length === 0;
}

// Event listener for the "Edit Pushup" button
editPushupButton.addEventListener('click', () => {
    toggleEditButtons(true); // Show edit buttons when "Edit Pushup" is clicked
});

// Function to show the push-up statistics page
function viewPushupStatistics() {
    if (users.length === 0) {
        alert('There are no users with push-up statistics. Please create a user and log push-ups.');
        return;
    }

    showPage('pushupStats');

    // Display push-up statistics for all users
    const pushupList = document.getElementById('pushup-list');
    pushupList.innerHTML = '<strong>Pushup Statistics for All Users</strong><br>';

    users.forEach(user => {
        pushupList.innerHTML += `<p><strong>${user.name}'s Pushup Statistics</strong></p>`;
        user.pushups.forEach(entry => {
            pushupList.innerHTML += `${entry.date.toLocaleString()}: ${entry.count} pushups<br>`;
        });
    });

    // Show edit button only if you reached this page from "Start Pushup Entry"
    if (editPushupButton.dataset.visible === 'true') {
        toggleEditButtons(true); // Show edit buttons
    }
}

// Function to populate the user list dropdown
function populateUserList() {
    userList.innerHTML = '';
    users.forEach(user => {
        const option = document.createElement('option');
        option.textContent = user.name;
        userList.appendChild(option);
    });
}

// Function to show a specific page
function showPage(page) {
    for (const key in pages) {
        if (pages.hasOwnProperty(key)) {
            pages[key].style.display = key === page ? 'block' : 'none';
        }
    }
}

// Function to show the user selection page
function showUserSelectionPage() {
    if (users.length === 0) {
        alert('There are no current users. Please create a user.');
        return;
    }
    showPage('userSelection');
}

// Function to show the pushup entry page
function startPushupEntry() {
    const selectedUserIndex = userList.selectedIndex;
    if (selectedUserIndex === -1) {
        alert('Please select an existing user or create a new one.');
    } else {
        showPage('pushupEntry');
    }
}

// Event listener for logging pushups and redirecting to statistics page
document.getElementById('log-pushup').addEventListener('click', () => {
    const pushups = parseInt(document.getElementById('pushups').value, 10);
    if (!isNaN(pushups) && pushups >= 0) {
        const selectedUserIndex = userList.selectedIndex;
        if (selectedUserIndex === -1) {
            alert('Please select an existing user or create a new one.');
        } else {
            const user = users[selectedUserIndex];
            const currentDate = new Date();
            user.pushups.push({ date: currentDate, count: pushups });
            alert(`Logged ${pushups} pushups for ${user.name} on ${currentDate}.`);
            document.getElementById('pushups').value = '';
            showPage('pushupStats');
            renderPushupEntries(user);
            toggleEditButtons(); // Show edit buttons
            saveUserData();
        }
    } else {
        alert('Please enter a valid pushup count.');
    }
});

// Function to edit a pushup entry
function editPushupEntry(user, entryIndex) {
    const newCount = prompt(`Edit push-up count for ${user.name}:`, user.pushups[entryIndex].count);
    if (newCount !== null && !isNaN(newCount)) {
        user.pushups[entryIndex].count = parseInt(newCount);
        saveUserData();
        displayPushupStats(user); // Refresh the displayed statistics
    } else if (newCount !== null) {
        alert('Please enter a valid push-up count.');
    }
}


// Function to save user data to localStorage
function saveUserData() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Function to show the admin login form
function showAdminLoginForm() {
    showPage('adminLogin');
}



function adminLogin() {
    const adminUsername = document.getElementById('admin-username').value;
    const adminPassword = document.getElementById('admin-password').value;

    // Add your admin login logic here
    if (adminUsername === 'Cj' && adminPassword === 'ronnoc15') {
        isAdmin = true;
        alert('Logged in as administrator.');
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';

        // Show the admin options when logged in
        showAdminOptions();

        // Redirect to user selection page or wherever you want
        showUserSelectionPage();
    } else {
        alert('Invalid admin credentials.');
    }
}

// Function to hide the "Admin Login" button
function hideAdminLoginButton() {
    const adminLoginButton = document.getElementById('admin-login-button-landing');
    adminLoginButton.style.display = 'none';
}

// Function to show the "Admin Options" button
function showAdminOptionsButton() {
    const adminOptionsButton = document.getElementById('admin-options-button');
    adminOptionsButton.style.display = 'inline-block';
}
// Function to show the admin options page
function showAdminOptionsPage() {
    // Hide other pages
    for (const key in pages) {
        if (pages.hasOwnProperty(key)) {
            pages[key].style.display = 'none';
        }
    }

    // Show the admin options page
    const adminOptionsDiv = document.getElementById('admin-options');
    adminOptionsDiv.style.display = 'block';
}

// Inside the showAdminOptions function
function showAdminOptions() {
    const adminOptionsDiv = document.getElementById('admin-options');

    // Show the admin options div
    adminOptionsDiv.style.display = 'block';

    // Add event listeners to admin-specific actions
    const resetAppButton = document.getElementById('reset-app-button');
    
    // Event listener for the "Reset App and Data" button
    resetAppButton.addEventListener('click', () => {
        const confirmation = confirm('Are you sure you want to reset the app and data? This action cannot be undone.');
        if (confirmation) {
            // Clear local storage to reset app data
            localStorage.clear();

            // Reset the user interface (you may need to customize this part)
            // For example, you can show the Admin Options button here
            const adminOptionsButton = document.getElementById('admin-options-button');
            adminOptionsButton.style.display = 'block';

            // Clear user data in the 'users' array
            users = [];

            // Optionally, repopulate the user list and update the UI as needed
            populateUserList();
            toggleSelectExistingUserButton();

            alert('App and data reset successfully.'); // Show a confirmation message
        }
    });
}
function logPushup() {
    // Step 1: Retrieve the selected user from the dropdown list
    const selectedUserIndex = userList.selectedIndex;
    if (selectedUserIndex === -1) {
        alert('Please select an existing user or create a new one.');
        return;
    }
    const user = users[selectedUserIndex];

    // Step 2: Get the number of pushups entered by the user
    const pushupsInput = document.getElementById('pushups');
    const pushups = parseInt(pushupsInput.value, 10);

    // Step 3: Validate the input (ensure it's a valid number)
    if (isNaN(pushups) || pushups < 0) {
        alert('Please enter a valid pushup count.');
        return;
    }

    // Step 4: Create a new pushup entry object with the current date and the number of pushups
    const currentDate = new Date();
    const pushupEntry = { date: currentDate, count: pushups };

    // Step 5: Add this entry to the user's pushups array
    user.pushups.push(pushupEntry);

    // Step 6: Save the updated user data to local storage
    saveUserData();

    // Step 7: Show a confirmation message
    alert(`Logged ${pushups} pushups for ${user.name} on ${currentDate}.`);

    // Step 8: Redirect the user to the pushup statistics page
    showPage('pushupStats');

    // Step 9: Update the displayed pushup statistics for the selected user
    renderPushupEntries(user);
    toggleEditButtons(); // Show edit buttons
}


// Function to delete a user (admin-only)
function deleteUser() {
    if (isAdmin) {
        const selectedUserIndex = userList.selectedIndex;
        if (selectedUserIndex !== -1) {
            const username = users[selectedUserIndex].name;
            const confirmation = confirm(`Are you sure you want to delete user "${username}"?`);
            if (confirmation) {
                users.splice(selectedUserIndex, 1);
                saveUserData();
                populateUserList();
                showUserSelectionPage();
            }
        }
    } else {
        alert('Only administrators can delete users.');
    }
}

// Initialize the app by populating the user list
populateUserList();