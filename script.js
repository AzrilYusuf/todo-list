document.addEventListener("DOMContentLoaded", () => {
  const profile = loadProfile();
  const usernameElement = document.getElementById("username");
  const userJobElement = document.getElementById("user-job");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const taskInputContainer = document.getElementById("task-input-container");
  const addTaskBtn = document.getElementById("add-task-btn");
  const saveTaskBtn = document.getElementById("save-task-btn");
  const taskMessage = document.getElementById("task-message");
  const taskDeadline = document.getElementById("task-deadline");
  const taskList = document.getElementById("task-list");
  const completedTaskList = document.getElementById("completed-task-list");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  let tasks = loadTasks();

  // Load and display profile
  displayProfile(profile);
  displayTasks();

  // Edit profile logic
  editProfileBtn.addEventListener("click", () => {
    const newUsername = prompt("Enter your new username", profile.username);
    const newUserJob = prompt("Enter your new job title", profile.job);

    if (newUsername && newUserJob) {
      profile.username = newUsername;
      profile.job = newUserJob;
      saveProfile(profile);
      displayProfile(profile);
    }
  });

  // Function to load profile from local storage
  function loadProfile() {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : { username: 'User', job: 'Developer' };
}

// Function to save profile to local storage
function saveProfile(profile) {
    localStorage.setItem('profile', JSON.stringify(profile));
}

// Function to display profile on the page
function displayProfile(profile) {
    usernameElement.textContent = profile.username;
    userJobElement.textContent = profile.job;
}

  // Toggle task input
  addTaskBtn.addEventListener("click", () => {
    taskInputContainer.style.display =
      taskInputContainer.style.display === "none" ? "block" : "none";
  });

  // Save task
  saveTaskBtn.addEventListener("click", () => {
    const task = {
      message: taskMessage.value,
      deadline: taskDeadline.value,
      isComplete: false,
      createdAt: formatDate(new Date()),
    };
    tasks.push(task);
    saveTasks();
    displayTasks();
    taskMessage.value = "";
    taskDeadline.value = "";
  });

  // Delete all tasks
  deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      tasks = [];
      saveTasks();
      displayTasks();
    }
  });

  function loadProfile() {
    const savedProfile = localStorage.getItem("profile");
    return savedProfile
      ? JSON.parse(savedProfile)
      : { username: "User", job: "Developer" };
  }

  function displayProfile(profile) {
    document.getElementById("username").textContent = profile.username;
    document.getElementById("user-job").textContent = profile.job;
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function displayTasks() {
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = `${task.message} (Deadline: ${task.deadline})`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.isComplete;
      checkbox.addEventListener("change", () => {
        task.isComplete = checkbox.checked;
        saveTasks();
        displayTasks();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
      });

      taskItem.prepend(checkbox);
      taskItem.appendChild(deleteBtn);

      if (task.isComplete) {
        completedTaskList.appendChild(taskItem);
      } else {
        taskList.appendChild(taskItem);
      }
    });
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
});
