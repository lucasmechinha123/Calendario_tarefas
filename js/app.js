const calendarElement = document.getElementById("calendar");
const selectedDateElement = document.getElementById("selected-date");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const currentMonthElement = document.getElementById("current-month");

let selectedDate = null;
let currentYear = 2025;
let currentMonth = 0;

const tasks = JSON.parse(localStorage.getItem("tasks")) || {};

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createCalendar(year, month) {
  calendarElement.innerHTML = "";
  currentMonthElement.textContent = `${months[month]} ${year}`;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "day";
    calendarElement.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = day;

    const date = `${year}-${String(month + 1).padStart(1, "0")}-${String(
      day
    ).padStart(1, "0")}`;
    dayElement.dataset.date = date;
    dayElement.onclick = () => selectDate(date);
    calendarElement.appendChild(dayElement);
  }
}

function selectDate(date) {
  selectedDate = date;
  selectedDateElement.textContent = new Date(date).toLocaleDateString("pt-BR");

  document
    .querySelectorAll(".day")
    .forEach((day) => day.classList.remove("selected"));
  const selectedDayElement = document.querySelector(`[data-date="${date}"]`);
  if (selectedDayElement) {
    selectedDayElement.classList.add("selected");
  }

  renderTasks();
}

function addTask() {
  if (!selectedDate) {
    alert("Por favor, selecione uma data primeiro!");
    return;
  }

  const taskText = taskInput.value.trim();
  if (!taskText) return;

  if (!tasks[selectedDate]) tasks[selectedDate] = [];
  tasks[selectedDate].push({ text: taskText, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTaskStatus(index) {
  if (tasks[selectedDate]) {
    tasks[selectedDate][index].completed =
      !tasks[selectedDate][index].completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  if (tasks[selectedDate]) {
    tasks[selectedDate].splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  taskList.innerHTML = "";
  if (tasks[selectedDate]) {
    tasks[selectedDate].forEach((task, index) => {
      const li = document.createElement("li");

      const taskSpan = document.createElement("span");
      taskSpan.textContent = task.text;
      if (task.completed) {
        taskSpan.style.textDecoration = "line-through";
      }
      li.appendChild(taskSpan);

      const completeButton = document.createElement("button");
      completeButton.textContent = task.completed
        ? "Não Concluído"
        : "Concluído";
      completeButton.className = task.completed ? "incomplete" : "complete";
      completeButton.onclick = () => toggleTaskStatus(index);
      li.appendChild(completeButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Excluir";
      deleteButton.className = "delete";
      deleteButton.onclick = () => deleteTask(index);
      li.appendChild(deleteButton);

      taskList.appendChild(li);
    });
  }
}

function exportToExcel() {
  const worksheetData = [];
  for (const [date, taskArray] of Object.entries(tasks)) {
    taskArray.forEach((task) => {
      worksheetData.push({
        Data: date,
        Tarefa: task.text,
        Concluída: task.completed ? "Sim" : "Não",
      });
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tarefas");

  XLSX.writeFile(workbook, "tarefas_2025.xlsx");
}

function previousMonth() {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  createCalendar(currentYear, currentMonth);
}

function nextMonth() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  createCalendar(currentYear, currentMonth);
}

createCalendar(currentYear, currentMonth);
