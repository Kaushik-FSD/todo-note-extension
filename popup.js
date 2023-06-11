// Get the todo list div element
const todoList = document.getElementById("todo-list");

//get the textarea field
const noteInput = document.getElementById("note-input");

// Get the input element and add event listener
const todoInput = document.getElementById("todo-input");

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

// Get the add button and add event listener
const addButton = document.getElementById("add-button");
addButton.addEventListener("click", addTodo);

// Load existing todos from storage
chrome.storage.sync.get("todos", ({ todos }) => {
  if (todos && Array.isArray(todos)) {
    todos.forEach((todo) => {
      addTodoElement(todo);
    });
  }
});

// Function to add a new todo
function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText !== "") {
    const todo = { text: todoText, checked: false };
    addTodoElement(todo);
    saveTodos();
    todoInput.value = "";
  }
}

// Function to add a new todo element to the list
function addTodoElement(todo) {
  const todoElement = document.createElement("div");
  todoElement.className = "todo-item";

  const todoTextElement = document.createElement("span");
  todoTextElement.className = "todo-text";
  todoTextElement.textContent = todo.text;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.checked;
  checkbox.addEventListener("change", () => {
    todo.checked = checkbox.checked;
    saveTodos();
  });

  const deleteButton = document.createElement("span");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
  deleteButton.addEventListener("click", () => {
    todoElement.remove();
    saveTodos();
  });

  todoElement.appendChild(checkbox);
  todoElement.appendChild(todoTextElement);
  todoElement.appendChild(deleteButton);
  todoList.appendChild(todoElement);
}

// Function to save todos to storage
function saveTodos() {
  const todoElements = document.getElementsByClassName("todo-item");
  const todos = [];
  for (let i = 0; i < todoElements.length; i++) {
    const todoText = todoElements[i].querySelector(".todo-text").textContent;
    const checked = todoElements[i].querySelector(
      'input[type="checkbox"]'
    ).checked;
    todos.push({ text: todoText, checked });
  }
  chrome.storage.sync.set({ todos });
}

// Add an event listener to save the note when user interacts with it
noteInput.addEventListener("input", function (event) {
  const note = event.target.value;
  chrome.storage.sync.set({ note: note });
});

// Get the color input element
const colorInput = document.getElementById("color-input");

// Add an event listener to apply the selected color to the background
colorInput.addEventListener("change", function (event) {
  const color = event.target.value;
  document.body.style.backgroundColor = color;

  const isDarkBackground = isColorDark(color);

  // Adjust the text color based on the background brightness
  document.body.style.color = isDarkBackground ? "white" : "black";
});

function isColorDark(color) {
  const rgb = color.substring(1); // Remove the "#" character
  const r = parseInt(rgb.substr(0, 2), 16);
  const g = parseInt(rgb.substr(2, 2), 16);
  const b = parseInt(rgb.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128; // Adjust the threshold as needed
}
