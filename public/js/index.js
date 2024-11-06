const song_img = document.querySelector("#img-container");
const searchField = document.getElementById("search-field");
const dropdown = document.getElementById("dropdown");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const timer = document.getElementById("timer");
const progress = document.getElementById("progress");

let playing = false;
let song;
let current_song;

// Display dropdown when search field is focused
searchField.addEventListener("focus", () => {
  dropdown.style.display = "block";
});

// Hide dropdown when clicking outside of navigation
document.addEventListener("click", (event) => {
  if (!event.target.closest("#navigation")) {
    dropdown.style.display = "none";
  }
});

// Play selected song and update the UI
dropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    searchField.value = item.innerText.trim();
    searchField.style.color = "white";
    dropdown.style.display = "none";
    current_song = song_collection.get(item.innerText.trim());

    if (song) {
      song.pause(); // Stop any currently playing song
    }
    song = new Audio(current_song); // Initialize new song
    song.play();
    playing = true;

    renderImage(item.innerText.trim());
    updateTimerAndProgress(); // Call this to set initial values

    // Update timer and progress bar as song plays
    song.addEventListener("timeupdate", updateTimerAndProgress);
  });
});

// Action buttons event listeners
for (var i = 0; i < 3; i++) {
  document.querySelectorAll(".buttons")[i].firstElementChild.addEventListener("click", action);
}

function action() {
  var action_to_do = this.id;
  switch (action_to_do) {
    case "play-pause":
      if (!playing) {
        song.play();
        playing = true;
      } else {
        song.pause();
        playing = false;
      }
      break;

    case "forward":
      playNextSong(1);
      break;

    case "rewind":
      playNextSong(-1);
      break;
  }
}

// Function to play the next or previous song
function playNextSong(direction) {
  const songTitles = Array.from(song_collection.keys());
  const currentIndex = songTitles.indexOf(searchField.value);
  const newIndex = (currentIndex + direction + songTitles.length) % songTitles.length;
  
  searchField.value = songTitles[newIndex];
  current_song = song_collection.get(songTitles[newIndex]);

  if (song) {
    song.pause();
  }
  song = new Audio(current_song);
  song.play();
  playing = true;

  renderImage(songTitles[newIndex]);
  updateTimerAndProgress();
  song.addEventListener("timeupdate", updateTimerAndProgress);
}

// Update the timer and progress bar as song plays
function updateTimerAndProgress() {
  const currentTime = song.currentTime;
  const duration = song.duration;

  // Update timer
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60).toString().padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;

  // Update progress bar
  progress.value = (currentTime / duration) * 100;

  // Set max duration for progress bar when song loads
  if (duration) {
    progress.max = 100;
  }
}

progress.addEventListener("input", () => {
  if (song && song.duration) {
    const newTime = (progress.value / 100) * song.duration; // Calculate new time
    song.currentTime = newTime; // Update song's current time
  }
});

// Render song image
function renderImage(songName) {
  const defaultImage = "./assets/images/default.png"; // Default image path
  song_img.style.backgroundImage = `url(${defaultImage})`; // Replace with actual image URL if available
}
