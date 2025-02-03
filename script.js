let teams = [];
let currentUser = null;
let users = [];
let tournamentName = '';

// Login and Registration Logic
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = username;
        showApp();
    } else {
        alert('Invalid username or password.');
    }
}

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    if (username && password) {
        users.push({ username, password });
        alert('Registration successful! Please login.');
        showLogin();
    } else {
        alert('Please fill all fields.');
    }
}

function logout() {
    currentUser = null;
    showLogin();
}

function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
}

function showApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('registerContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
}

// Team Management Logic
function addTeam() {
    tournamentName = document.getElementById('tournamentName').value;
    const teamName = document.getElementById('teamName').value;
    const captainName = document.getElementById('captainName').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const baseFee = parseFloat(document.getElementById('baseFee').value);

    if (teamName && captainName && contactNumber && baseFee) {
        const team = {
            teamName,
            captainName,
            contactNumber,
            baseFee,
            ballFee: 0,
            totalFee: baseFee,
            paid: 0,
            pending: baseFee
        };
        teams.push(team);
        displayTeams();
        clearForm();
    } else {
        alert('Please fill all fields.');
    }
}

function displayTeams() {
    const teamBody = document.getElementById('teamBody');
    teamBody.innerHTML = '';
    let totalFeeSum = 0, totalPaidSum = 0, totalPendingSum = 0;

    teams.forEach((team, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.teamName}</td>
            <td>${team.captainName}</td>
            <td>${team.contactNumber}</td>
            <td>${team.baseFee}</td>
            <td>${team.ballFee}</td>
            <td>${team.totalFee}</td>
            <td>${team.paid}</td>
            <td>${team.pending}</td>
            <td class="actions">
                <button onclick="recordPayment(${index})">Record Payment</button>
                <button onclick="addBallFee(${index})">Add Ball Fee</button>
                <button onclick="sendReminder(${index})">Reminder</button>
            </td>
        `;
        teamBody.appendChild(row);

        totalFeeSum += team.totalFee;
        totalPaidSum += team.paid;
        totalPendingSum += team.pending;
    });

    document.getElementById('totalFeeSum').textContent = totalFeeSum;
    document.getElementById('totalPaidSum').textContent = totalPaidSum;
    document.getElementById('totalPendingSum').textContent = totalPendingSum;
}

function searchTeams() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTeams = teams.filter(team => 
        team.teamName.toLowerCase().includes(searchTerm) || 
        team.captainName.toLowerCase().includes(searchTerm)
    );

    const teamBody = document.getElementById('teamBody');
    teamBody.innerHTML = '';
    filteredTeams.forEach((team, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.teamName}</td>
            <td>${team.captainName}</td>
            <td>${team.contactNumber}</td>
            <td>${team.baseFee}</td>
            <td>${team.ballFee}</td>
            <td>${team.totalFee}</td>
            <td>${team.paid}</td>
            <td>${team.pending}</td>
            <td class="actions">
                <button onclick="recordPayment(${teams.indexOf(team)})">Record Payment</button>
                <button onclick="addBallFee(${teams.indexOf(team)})">Add Ball Fee</button>
                <button onclick="sendReminder(${teams.indexOf(team)})">Reminder</button>
            </td>
        `;
        teamBody.appendChild(row);
    });
}

function recordPayment(index) {
    const amount = parseFloat(prompt('Enter payment amount:'));
    if (!isNaN(amount)) {
        teams[index].paid += amount;
        teams[index].pending = teams[index].totalFee - teams[index].paid;
        displayTeams();
    }
}

function addBallFee(index) {
    const ballFee = parseFloat(prompt('Enter ball fee amount:'));
    if (!isNaN(ballFee)) {
        teams[index].ballFee += ballFee;
        teams[index].totalFee = teams[index].baseFee + teams[index].ballFee;
        teams[index].pending = teams[index].totalFee - teams[index].paid;
        displayTeams();
    }
}

function sendReminder(index) {
    const team = teams[index];
    const message = `Dear ${team.captainName}, your pending fee for ${team.teamName} is ₹${team.pending}. Please pay at the earliest. Regards, ${tournamentName}. Thank you.`;
    const url = `https://api.whatsapp.com/send?phone=${team.contactNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function clearForm() {
    document.getElementById('teamName').value = '';
    document.getElementById('captainName').value = '';
    document.getElementById('contactNumber').value = '';
    document.getElementById('baseFee').value = '';
}
