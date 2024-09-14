const todoValue = document.getElementById("todoText");
const prioritySelect = document.getElementById("prioritySelect");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];
let updateText = null; 


function CreateToDoItems() {
    if (todoValue.value.trim() === "") {
        setAlertMessage("Please enter your todo text!");
        todoValue.focus();
        return;
    }
    const newItem = todoValue.value.trim();
    const priority = prioritySelect.value || "low";
    const isPresent = todo.some(item => item.item === newItem);

    if (isPresent && updateText === null) {
        setAlertMessage("This item is already present in the list!");
        return;
    }

    let li = document.createElement("li");
    const todoItems = `
        <div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)" class="task-text">${newItem}</div>
        <div>
            <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="assets/pencil.png" />
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="assets/delete.png" />
        </div>`;
    li.innerHTML = todoItems;
    li.classList.add(`${priority}-priority`);
    listItems.appendChild(li);

    if (updateText) {
      const index = todo.findIndex(item => item.item === updateText.innerText.trim());
        if (index !== -1) {
            todo[index].item = newItem;
            todo[index].priority = priority;
        }
        updateText = null; 
    } else {
        todo.push({ item: newItem, status: false, priority: priority });
    }

    setLocalStorage();
    todoValue.value = "";
    prioritySelect.value = "low"; 
    addUpdate.setAttribute("onclick", "CreateToDoItems()"); 
    addUpdate.setAttribute("src", "assets/add.png"); 
    setAlertMessage(updateText ? "Todo item Updated Successfully!" : "Todo item Created Successfully!");
}

function ReadToDoItems() {
    todo.forEach(item => {
        let li = document.createElement("li");
        let style = item.status ? "style='text-decoration: line-through'" : "";
        const priorityClass = `${item.priority}-priority`;
        const todoItems = `
            <div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)" class="task-text">${item.item}</div>
            ${style === "" ? "" : '<img class="todo-controls" src="assets/check-mark.png" />'}
            <div>
                ${style === "" ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="assets/pencil.png" />' : ""}
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="assets/delete.png" />
            </div>`;
        li.innerHTML = todoItems;
        li.classList.add(priorityClass);
        listItems.appendChild(li);
    });
}

ReadToDoItems();

function UpdateToDoItems(e) {
    const itemText = e.parentElement.parentElement.querySelector(".task-text");
    if (itemText.style.textDecoration === "") {
        todoValue.value = itemText.innerText.trim();
        
        const classes = e.parentElement.parentElement.classList;
        let priorityClass = "low"; 
        if (classes.length > 1) {
            priorityClass = classes[1].split('-')[0]; 
        }
        
        prioritySelect.value = priorityClass;
        updateText = itemText; 
        
        addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
        addUpdate.setAttribute("src", "assets/refresh.png"); 
        todoValue.focus();
    }
}

function UpdateOnSelectionItems() {
    if (!updateText) {
        setAlertMessage("No item selected for updating.");
        return;
    }

    const newItem = todoValue.value.trim();
    const priority = prioritySelect.value || "low";

    const isPresent = todo.some(item => item.item === newItem);

    if (isPresent && updateText.innerText.trim() !== newItem) {
        setAlertMessage("This item is already present in the list!");
        return;
    }

    const index = todo.findIndex(item => item.item === updateText.innerText.trim());
    if (index !== -1) {
        todo[index].item = newItem;
        todo[index].priority = priority;
    }

    setLocalStorage();

    updateText.innerText = newItem;
    updateText.className = `${priority}-priority task-text`;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "assets/add.png"); 
    todoValue.value = "";
    prioritySelect.value = "low"; 
    updateText = null; 
    setAlertMessage("Todo item Updated Successfully!");
}

function DeleteToDoItems(e) {
    let deleteValue = e.parentElement.parentElement.querySelector(".task-text").innerText.trim();

    if (confirm(`Are you sure you want to delete this item: ${deleteValue}?`)) {
        e.parentElement.parentElement.setAttribute("class", "deleted-item");
        todoValue.focus();

        todo = todo.filter(item => item.item !== deleteValue);

        setTimeout(() => {
            e.parentElement.parentElement.remove();
        }, 1000);

        setLocalStorage();
    }
}

function CompletedToDoItems(e) {
    if (e.style.textDecoration === "") {
        const img = document.createElement("img");
        img.src = "assets/check-mark.png";
        img.className = "todo-controls";
        e.style.textDecoration = "line-through";
        e.appendChild(img);
        e.parentElement.querySelector("img.edit").remove();

        todo.forEach(item => {
            if (e.innerText.trim() === item.item) {
                item.status = true;
            }
        });
        setLocalStorage();
        setAlertMessage("Todo item Completed Successfully!");
    }
}

function setLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;
    setTimeout(() => {
        todoAlert.classList.add("toggleMe");
    }, 1000);
}
