document.addEventListener("DOMContentLoaded", () => {
  const taskinput = document.getElementById("task-input");
  const taskDate = document.getElementById("task-date");
  const taskTime = document.getElementById("task-time");
  const addtaskbtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-image");
  const todosContainer = document.querySelector(".todos-container");
  const progressBar = document.getElementById("progress");
  const progressNumbers = document.getElementById("numbers");

  document.querySelector(".input-area").addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
  });

  const toggleEmptyState = () => {
    emptyImage.style.display =
      taskList.children.length === 0 ? "block" : "none";
    todosContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
  };

  const updateProgress = (checkCompletion = true) => {
    const totalTasks = taskList.children.length;
    const completedTasks =
      taskList.querySelectorAll(".checkbox:checked").length;
    progressBar.style.width = totalTasks
      ? `${(completedTasks / totalTasks) * 100}%`
      : "0%";
    progressNumbers.textContent = `${completedTasks}/${totalTasks}`;
    if (checkCompletion && totalTasks > 0 && completedTasks == totalTasks) {
      Confetti();
    }
  };

  const saveTaskToLocalStorage = () => {
    const tasks = Array.from(taskList.querySelectorAll("li")).map((task) => {
      return {
        text: task.querySelector("span").textContent,
        completed: task.querySelector(".checkbox").checked,
        date: task.querySelector(".task-datetime")?.dataset.date || "",
        time: task.querySelector(".task-datetime")?.dataset.time || "",
      };
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(({ text, completed, date, time }) =>
      addTask(text, completed, false, date, time)
    );
    toggleEmptyState();
    updateProgress();
  };

  const addTask = (
    text,
    completed = false,
    checkCompletion = true,
    savedDate = "",
    savedTime = ""
  ) => {
    const taskText = text || taskinput.value.trim();
    const taskDueDate = savedDate || taskDate.value;
    const taskDueTime = savedTime || taskTime.value;

    if (!taskText || !taskDueDate || !taskDueTime) return;

    const li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${
        completed ? "checked" : ""
      }/>
      <div class="task-text">
        <span>${taskText}</span>
        <div class="task-datetime" data-date="${taskDueDate}" data-time="${taskDueTime}">
          ${taskDueDate} at ${taskDueTime}
        </div>
      </div>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = "0.5";
      editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? "0.5" : "1";
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      updateProgress(true);
      saveTaskToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        const span = li.querySelector("span");
        const datetime = li.querySelector(".task-datetime");
        taskinput.value = span.textContent;
        taskDate.value = datetime.dataset.date;
        taskTime.value = datetime.dataset.time;
        li.remove();
        toggleEmptyState();
        updateProgress(false);
        saveTaskToLocalStorage();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
      saveTaskToLocalStorage();
    });

    taskList.appendChild(li);
    taskinput.value = "";
    taskDate.value = "";
    taskTime.value = "";

    toggleEmptyState();
    updateProgress(checkCompletion);
  };

  addtaskbtn.addEventListener("click", () => addTask());

  taskinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  });

  loadTasksFromLocalStorage();
});

const Confetti = () => {
  if (window.confetti) {
    window.confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });
  } else {
    console.warn("Confetti function not available.");
  }
};
