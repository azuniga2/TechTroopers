const apiKey = "URC8iJ1uu0ADE62KhIlJb8twsAtegijp";
const eventSection = document.querySelector("#current-events");
const citySelect = document.querySelector("#city");
const fetchEventsButton = document.querySelector("#fetch-events");
const paginationDiv = document.querySelector("#pagination");

const cityCoordinates = {
  "las-cruces": { lat: 32.3199, long: -106.7637, radius: 50 },
  "el-paso": { lat: 31.7619, long: -106.485, radius: 50 },
  albuquerque: { lat: 35.0844, long: -106.6504, radius: 75 },
};

let currentPage = 1;
let eventsPerPage = 20;
let totalEvents = [];
let totalPages = 0;
let filteredEvents = [];

async function fetchEvents() {
  const selectedCity = citySelect.value;
  const { lat, long, radius } = cityCoordinates[selectedCity];

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${lat},${long}&radius=${radius}&unit=miles&size=50&sort=date,asc`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.status}`);
    }

    const data = await response.json();
    totalEvents = data._embedded?.events || [];
    totalPages = Math.ceil(totalEvents.length / eventsPerPage);

    if (totalEvents.length === 0) {
      eventSection.innerHTML = "<p>No events found for the selected city.</p>";
      paginationDiv.innerHTML = "";
      return;
    }

    currentPage = 1;
    displayEvents();
    setupPagination();
  } catch (error) {
    console.error(error);
    eventSection.innerHTML =
      "<p>Error loading events. Please try again later.</p>";
    paginationDiv.innerHTML = "";
  }
}

function displayEvents() {
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const eventsToShow = totalEvents.slice(startIndex, endIndex);

  eventSection.innerHTML = "<h2>Current Events</h2>";
  eventsToShow.forEach((event) => {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event");
    eventDiv.innerHTML = `
        <h3>${event.name}</h3>
        <p>Date: ${event.dates.start.localDate}</p>
        <p>Location: ${event._embedded.venues[0].name}</p>
        <a href="${event.url}" target="_blank">Buy Tickets</a> <!-- Dynamically created ticket link -->
      `;
    eventSection.appendChild(eventDiv);
  });
}

function setupPagination() {
  paginationDiv.innerHTML = "";

  // Handle edge case for no events
  if (totalEvents.length === 0) return;

  // Create the first button (previous)
  const prevButton = document.createElement("button");
  prevButton.classList.add("pagination-button");
  prevButton.textContent = "Prev";
  prevButton.disabled = currentPage === 1; // Disable if on the first page
  prevButton.addEventListener("click", () => {
    currentPage--;
    displayEvents();
    setupPagination();
  });
  paginationDiv.appendChild(prevButton);

  // Create buttons for each page
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("pagination-button");
    if (i === currentPage) pageButton.classList.add("active");
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayEvents();
      setupPagination();
    });
    paginationDiv.appendChild(pageButton);
  }

  // Create the last button (next)
  const nextButton = document.createElement("button");
  nextButton.classList.add("pagination-button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages; // Disable if on the last page
  nextButton.addEventListener("click", () => {
    currentPage++;
    displayEvents();
    setupPagination();
  });
  paginationDiv.appendChild(nextButton);
}

async function fetchEvents() {
  const selectedCity = citySelect.value;
  const { lat, long, radius } = cityCoordinates[selectedCity];
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&latlong=${lat},${long}&radius=${radius}&unit=miles&size=50&sort=date,asc`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching events: ${response.status}`);
    }

    const data = await response.json();
    filteredEvents = data._embedded?.events || [];
    totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    if (filteredEvents.length === 0) {
      eventSection.innerHTML = "<p>No events found.</p>";
      paginationDiv.innerHTML = "";
      return;
    }

    currentPage = 1;
    displayEvents();
    setupPagination();
  } catch (error) {
    console.error("Error fetching events:", error);
    eventSection.innerHTML =
      "<p>Error loading events. Please try again later.</p>";
    paginationDiv.innerHTML = "";
  }
}

// Function to filter events based on search and genre
function filterEvents() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const selectedGenre = document.getElementById("genre").value.toLowerCase();

  filteredEvents = filteredEvents.filter((event) => {
    const eventName = event.name.toLowerCase();
    const eventGenre = event.classifications
      ? event.classifications[0].segment.name.toLowerCase()
      : "";

    // Search filter
    const matchesSearch = eventName.includes(searchQuery);

    // Genre filter
    const matchesGenre = selectedGenre
      ? eventGenre.includes(selectedGenre)
      : true;

    return matchesSearch && matchesGenre;
  });

  totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  currentPage = 1; // Reset to first page after filtering
  displayEvents();
  setupPagination();
}

// Function to display events (pagination integrated)
function displayEvents() {
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const eventsToShow = filteredEvents.slice(startIndex, endIndex);

  eventSection.innerHTML = "<h2>Current Events</h2>";
  eventsToShow.forEach((event) => {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event");
    eventDiv.innerHTML = `
        <h3>${event.name}</h3>
        <p>Date: ${event.dates.start.localDate}</p>
        <p>Location: ${event._embedded.venues[0].name}</p>
        <a href="${event.url}" target="_blank">Buy Tickets</a>
      `;
    eventSection.appendChild(eventDiv);
  });
}

// Function to handle pagination
function setupPagination() {
  paginationDiv.innerHTML = "";
  const prevButton = document.createElement("button");
  prevButton.classList.add("pagination-button");
  prevButton.textContent = "Prev";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    currentPage--;
    displayEvents();
    setupPagination();
  });
  paginationDiv.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("pagination-button");
    if (i === currentPage) pageButton.classList.add("active");
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayEvents();
      setupPagination();
    });
    paginationDiv.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.classList.add("pagination-button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentPage++;
    displayEvents();
    setupPagination();
  });
  paginationDiv.appendChild(nextButton);
}

// Event listener for applying search and genre filters
document.getElementById("applyFilters").addEventListener("click", filterEvents);

// Call fetchEvents initially to load the events
fetchEvents();

fetchEventsButton.addEventListener("click", fetchEvents);
