const usernameElement = document.getElementById("username");
const userJobElement = document.getElementById("user-job");

// Function to save profile to local storage
function saveProfile(profile) {
  localStorage.setItem("profile", JSON.stringify(profile));
}

// Function to display profile on the page
function displayProfile(profile) {
  usernameElement.textContent = profile.username;
  userJobElement.textContent = profile.job;
}

window.addEventListener("load", function () {
  // Function to show SweetAlert form
  Swal.fire({
    title: "Profile",
    html: `
      <input type="text" id="usernameInput" class="swal2-input" placeholder="Enter your name" required>
      <input type="text" id="userJobInput" class="swal2-input" placeholder="Enter your job" required>
    `,
    confirmButtonText: "Submit",
    focusConfirm: false,
    allowOutsideClick: false, // Prevent users from closing it
    preConfirm: () => {
      const username = Swal.getPopup().querySelector("#usernameInput").value;
      const userJob = Swal.getPopup().querySelector("#userJobInput").value;

      if (!username || !userJob) {
        Swal.showValidationMessage("Please fill out both fields.");
      } else {
        return { username: username, job: userJob };
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const profile = result.value;

      // Save profile data
      saveProfile(profile);
      // Update the displayed profile with the new data
      displayProfile(profile);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const profile = loadProfile();
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const taskInputContainer = document.getElementById("task-input-container");
  const addTaskBtn = document.getElementById("add-task-btn");
  const saveTaskBtn = document.getElementById("save-task-btn");
  const taskMessage = document.getElementById("task-message");
  const taskPriority = document.getElementById("task-priority");
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
    Swal.fire({
      title: "Edit Profile",
      html: `
        <input type="text" id="editUsernameInput" class="swal2-input" value="${profile.username}" required>
        <input type="text" id="editUserJobInput" class="swal2-input" value="${profile.job}" required>
      `,
      confirmButtonText: "Save",
      focusConfirm: false,
      showCancelButton: true,
      allowOutsideClick: false,
      preConfirm: () => {
        const newUsername =
          Swal.getPopup().querySelector("#editUsernameInput").value;
        const newUserJob =
          Swal.getPopup().querySelector("#editUserJobInput").value;

        if (!newUsername || !newUserJob) {
          Swal.showValidationMessage("Please fill out both fields.");
        } else {
          return { username: newUsername, job: newUserJob };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newProfile = result.value;
        saveProfile(newProfile); // Save the updated profile
        displayProfile(newProfile); // Update the UI with the new profile
      }
    });
  });

  function loadProfile() {
    const savedProfile = localStorage.getItem("profile");
    return savedProfile ? JSON.parse(savedProfile) : { username: "", job: "" };
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
      priority: taskPriority.value,
      deadline: taskDeadline.value,
      isComplete: false,
      createdAt: formatDate(new Date()),
    };

    if (!task.message || !task.priority || !task.deadline) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Fields",
        text: "Please fill in all fields before saving the task.",
      });
    } else {
      tasks.push(task);
      saveTasks();
      displayTasks();
      taskMessage.value = "";
      taskPriority.value = "";
      taskDeadline.value = "";
    }
  });

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  }

  function displayTasks() {
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = `
      ${task.message} 
      (Priority: ${task.priority}) 
      (Created task: ${task.createdAt}) 
      (Deadline: ${task.deadline})
      `;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("task-checkbox");
      checkbox.checked = task.isComplete;
      checkbox.addEventListener("change", () => {
        task.isComplete = checkbox.checked;
        saveTasks();
        displayTasks();
      });

      const deleteBtn = document.createElement(`button`);
      deleteBtn.innerHTML = `<button class="delete-button"><i class="bi bi-trash3"></i></button>`;
      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        displayTasks();
      });

      taskItem.prepend(checkbox);
      taskItem.appendChild(deleteBtn);

      if (task.isComplete) {
        taskItem.classList.add("completed");
        completedTaskList.appendChild(taskItem);
      } else {
        taskItem.classList.remove("completed");
        taskList.appendChild(taskItem);
      }
    });
  }

  // Delete all tasks
  deleteAllBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All tasks will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        tasks = []; // Clear all tasks
        saveTasks(); // Save the empty task list to localStorage
        displayTasks(); // Refresh the task display
        Swal.fire("Deleted!", "All your tasks have been deleted.", "success");
      }
    });
  });
});
