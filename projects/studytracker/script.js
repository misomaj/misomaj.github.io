const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-task");
const list = document.getElementById("task-list");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => toggleTask(index);

    const label = document.createElement("span");
    label.textContent = task.text;

    if (task.done) li.classList.add("done");

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
  });
  updateProgress();
}

// Add new task
function addTask() {
  const text = input.value.trim();
  if (!text) return;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, done: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  loadTasks();
}

// Toggle task completion
function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// Update progress bar
function updateProgress() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  progressBar.style.width = percent + "%";
  progressText.textContent = `${percent}% Complete`;
}

// Auto-reset tasks at midnight
function resetIfNewDay() {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem("lastResetDate");

  if (lastDate !== today) {
    localStorage.removeItem("tasks");
    localStorage.setItem("lastResetDate", today);
  }
}
function scheduleMidnightCheck() {
  const now = new Date();
  const msUntilMidnight = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1
  ) - now;

  setTimeout(() => {
    resetIfNewDay();
    loadTasks();
    scheduleMidnightCheck();
  }, msUntilMidnight);
}

resetIfNewDay();
loadTasks();
scheduleMidnightCheck();


// Event listeners
addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// ---------- Pomodoro Timer ----------
let timerDuration = 25 * 60; // 25 minutes in seconds
let timerRemaining = timerDuration;
let timerInterval = null;
let isRunning = false;
let isFocusMode = true;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-timer");
const pauseBtn = document.getElementById("pause-timer");
const resetBtn = document.getElementById("reset-timer");
const timerMode = document.getElementById("timer-mode");

function updateTimerDisplay() {
  const minutes = Math.floor(timerRemaining / 60).toString().padStart(2, '0');
  const seconds = (timerRemaining % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timerInterval = setInterval(() => {
    timerRemaining--;
    updateTimerDisplay();

    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      switchMode();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timerRemaining = isFocusMode ? 25 * 60 : 5 * 60;
  updateTimerDisplay();
}

function switchMode() {
  isFocusMode = !isFocusMode;
  timerRemaining = isFocusMode ? 25 * 60 : 5 * 60;
  timerMode.textContent = `Mode: ${isFocusMode ? "Focus" : "Break"}`;
  alert(isFocusMode ? "Focus session started! 💪" : "Break time! ☕");
  updateTimerDisplay();
  startTimer();
}

// Button handlers
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize display
updateTimerDisplay();


// Initialize
loadTasks();
resetAtMidnight();
