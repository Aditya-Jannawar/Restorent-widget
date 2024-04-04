// CSS styles
const styles = `
  body {
    background-color: antiquewhite;
  }

  #suggestedDates ul,
  #suggestedTimes ul,
  #suggestedPeople ul {
    list-style-type: none;
    padding: 0;
  }

  #suggestedDates li,
  #suggestedTimes li,
  #suggestedPeople li {
    display: inline-block;
    margin-right: 10px;
  }

  .reservationButton {
    background-color: blue;
    color: white;
    padding: 16px 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    align-items: center;
  }

  .suggestedButton {
    background-color: blue;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 3px;
  }

  .popup {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 2px solid blue;
    border-radius: 8px;
    z-index: 999;
  }
`;

// Create style element and set CSS
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

// HTML structure
const popupHTML = `
<div class="popup" id="reservationPopup">
  <form id="reservationForm">
    <label for="reservationDate">Date:</label>
    <input type="date" id="reservationDate" name="reservationDate" required>
    <div id="suggestedDates">
      <ul>
        <li><button class="suggestedButton suggestedDate">Today</button></li>
        <li><button class="suggestedButton suggestedDate">Tomorrow</button></li>
        <li><button class="suggestedButton suggestedDate">Select Date</button></li>
      </ul>
    </div><br><br>

    <label for="reservationTime">Time:</label>
    <input type="time" id="reservationTime" name="reservationTime" required>
    <div id="suggestedTimes">
      <ul></ul>
    </div><br><br>

    <label for="numberOfPeople">Number of People:</label>
    <input type="number" id="numberOfPeople" name="numberOfPeople" required><br><br>
    <div id="suggestedPeople">
      <ul>
        <li><button class="suggestedButton suggestedPeople">Solo</button></li>
        <li><button class="suggestedButton suggestedPeople">Couple</button></li>
        <li><button class="suggestedButton suggestedPeople">Family of 4</button></li>
        <li><button class="suggestedButton suggestedPeople">Group </button></li>
      </ul>
    </div><br><br>

    <button type="submit">Reserve Table</button>
  </form>
</div>
`;

// Create popup element and set HTML
const popupElement = document.createElement('div');
popupElement.innerHTML = popupHTML;
document.body.appendChild(popupElement);

// JavaScript functionality
const reservationButton = document.createElement('button');
reservationButton.textContent = 'Make a Reservation';
reservationButton.className = 'reservationButton';
document.body.appendChild(reservationButton);

// Function to toggle visibility of popup when reservation button is clicked
reservationButton.addEventListener('click', function() {
  const reservationPopup = document.getElementById('reservationPopup');
  reservationPopup.style.display = reservationPopup.style.display === 'block' ? 'none' : 'block';
});

// Function to close popup when clicking outside of it
window.addEventListener('click', function(event) {
  const reservationPopup = document.getElementById('reservationPopup');
  if (event.target === reservationPopup) {
    reservationPopup.style.display = 'none';
  }
});

// Function to generate date options for today, tomorrow, and select date
function generateDateOptions() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const suggestedDates = document.querySelectorAll('.suggestedDate');
  
  suggestedDates[0].addEventListener('click', function() {
    document.getElementById('reservationDate').value = formatDate(today);
  });

  suggestedDates[1].addEventListener('click', function() {
    document.getElementById('reservationDate').value = formatDate(tomorrow);
  });

  suggestedDates[2].addEventListener('click', function() {
    document.getElementById('reservationDate').value = ''; // Clear the input
  });
}

// Function to generate time options from 1 hour later to 10 hours later
function generateTimeOptions() {
  const currentTime = new Date();
  const timeList = document.getElementById('suggestedTimes').querySelector('ul');

  for (let i = 1; i <= 10; i++) {
    const suggestedTime = new Date(currentTime.getTime() + i * 60 * 60 * 1000);
    const formattedTime = formatTime(suggestedTime);
    const button = document.createElement('button');
    button.textContent = formattedTime;
    button.className = 'suggestedButton suggestedTime';
    button.addEventListener('click', function() {
      document.getElementById('reservationTime').value = formattedTime;
    });
    const li = document.createElement('li');
    li.appendChild(button);
    timeList.appendChild(li);
  }
}

// Function to handle suggested number of people
document.querySelectorAll('.suggestedPeople').forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = button.textContent.toLowerCase();
    const reservationPeopleInput = document.getElementById('numberOfPeople');
    
    switch (buttonText) {
      case 'solo':
        reservationPeopleInput.value = 1;
        break;
      case 'couple':
        reservationPeopleInput.value = 2;
        break;
      case 'family of 4':
        reservationPeopleInput.value = 4;
        break;
      case 'group':
        const customValue = prompt('Enter number of people for the group:');
        if (customValue !== null && !isNaN(customValue) && customValue !== '') {
          reservationPeopleInput.value = parseInt(customValue);
        }
        break;
      default:
        break;
    }
  });
});

// Function to format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to format time as HH:MM
function formatTime(time) {
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Call the functions initially
generateDateOptions();
generateTimeOptions();

// Function to handle form submission
document.getElementById('reservationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get form values
  const reservationDate = document.getElementById('reservationDate').value;
  const reservationTime = document.getElementById('reservationTime').value;
  const numberOfPeople = document.getElementById('numberOfPeople').value;

  // Call the Seatninja API to make a reservation
  window.SeatNinja.makeReservation({
    date: reservationDate,
    time: reservationTime,
    covers: numberOfPeople
  });
});
