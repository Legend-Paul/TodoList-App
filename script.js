let newListBtn = document.querySelector(".new-list-btn");
let newListDialog = document.querySelector(".new-list-dialog");
let listTitle = document.querySelector(".list-title");
let addTodoListBtn = document.querySelector(".add");
let listCont = document.querySelector(".list-cont");
let newListBtnText = document.querySelector(".new-list-btn p");
let listAmount = document.querySelector(".amount");
let checkIcon = document.querySelector(".check-icon i");
let checkIconCont = document.querySelector(".check-icon");
let editListDialog = document.querySelector(".edit-list-dialog");
let addEditBtn = document.querySelector(".add-edit");
let editListTitle = document.querySelector(".edit-list-title");
let newListError = document.querySelector(".new-list-error");

let currentListName = "";
let currentListId = "";
let defaultList = true;
let currentTaskIdx = "";

let addListByEnterKey = (e) => {
    if (e.key === "Enter") {
        todoList.addNewList();
    }
};

function editListTitleName() {
    let newListName = editListTitle.value;
    if (newListName) {
        newListBtn.removeEventListener("click", getTaskPageContent);
        newListBtn.addEventListener("click", openDialog);
        newListBtnText.innerHTML = "New List";
        toggleIcons("flex", "none");
        todoList.editListArray(newListName);
        todoList.editTaskContentObj(newListName);
    }
}
let editListByEnterKey = (e) => {
    if (e.key === "Enter") {
        editListTitleName();
    }
};

let addTaskByEnterkey = (e) => {
    if (e.key === "Enter") {
        todoList.task.checkIconContEvent();
    }
};

let editTaskByEnterKey = (e) => {
    if (e.key === "Enter") {
        todoList.task.checkIconEdits();
    }
};

function openDialog() {
    newListDialog.showModal();
    listTitle.value = "";
    newListError.innerHTML = "";
    newListError.style.padding = "0";
    document.addEventListener("keyup", addListByEnterKey);
}

function closeDialog() {
    newListDialog.close();
    editListDialog.close();
    document.removeEventListener("keyup", addListByEnterKey);
}
function getTaskPageContent() {
    let taskPageContent = `
        <div class="task-header">
            <div class="left-content">
                <i class="bi bi-arrow-left back-task-btn"></i>
                <h1>${currentListName}</h1>
            </div>
            <div class="right-content">
                <i class="bi bi-trash3 delete-task" style="display: none;"></i>
                <p class="icon-name">Delete_Task</p>
            </div>
        </div>  
        <div class="description-cont">
            <label>
                Task Description:
                <input type="text" class="description" required placeholder="e.g Read book 20 minutes per day">
            </label>
            <label>
                Due Date:
                <input type="date" class="date">
            </label>
            <label>
                Time:
                <input type="time" class="time">
            </label>
            <div class="repeate-options-cont">
                <p>Select Priority Options</p>
                <select name="repeate-options" class="repeate-options">
                    <option value="Once">Once</option>
                    <option value="Everyday">Everyday</option>
                    <option value="Per week">Per Week</option>
                    <option value="Per month">Per Month</option>
                </select>
            </div>
        </div>     
    `;
    listCont.innerHTML = taskPageContent;
    toggleIcons("none", "inline-block");
    checkIconCont.removeEventListener("click", todoList.task.checkIconEdits);
    document.removeEventListener("keyup", editTaskByEnterKey);
    checkIconCont.addEventListener("click", todoList.task.checkIconContEvent);
    document.addEventListener("keyup", addTaskByEnterkey);
}

function toggleIcons(newListBtnState, checkIconState) {
    newListBtn.style.display = newListBtnState;
    checkIcon.style.display = checkIconState;
}

class List {
    listArray = [
        `
            <h1>Todo List</h1>
            <div class="list default" data-list-id=${0}>
                <div class="name">
                    <div class="icon">
                        <i class="bi bi-list"></i>
                    </div>
                    <h3 class="list-name">Default</h3>
                </div>
                <p class="amount"></p>
            </div>
            <div class="list today" data-list-id=${1}>
                <div class="name">
                    <div class="icon">
                        <i class="bi bi-calendar-day"></i>
                    </div>
                    <h3 class="list-name">Today</h3>
                </div>
                <p class="amount"></p>
            </div>
            <div class="list important" data-list-id=${2}>
                <div class="name">
                    <div class="icon">
                        <i class="bi bi-star-fill active-star"></i>
                    </div>
                    <h3 class="list-name">Important</h3>
                </div>                
                <p class="amount"></p>
            </div>
            <hr>
        `,
    ];
    listKey = "list key";
    newTodoListName = "";

    displayListOnLoad() {
        document.addEventListener("DOMContentLoaded", () => {
            let storedList = localStorage.getItem(this.listKey);
            if (!storedList) {
                localStorage.setItem(
                    this.listKey,
                    JSON.stringify(this.listArray)
                );
            }
            this.getStorageList();
            toggleIcons("flex", "none");
        });
    }

    openTodoDialog() {
        newListBtn.addEventListener("click", openDialog);
    }

    closeTodoDialog() {
        document.addEventListener("click", (e) => {
            let clickedBtn = e.target.closest(".cancel");
            if (clickedBtn) {
                closeDialog();
            }
        });
    }

    createNewList(newListName) {
        return `
            <div class="name">
                <div class="icon">
                    <i class="bi bi-person-lines-fill"></i>
                </div>
                <h3 class="list-name">${newListName}</h3>
            </div>                
            <p class="amount"></p>
            `;
    }

    addToStorage() {
        let newHTMLList = this.createNewList(this.newTodoListName);
        this.listArray.push(newHTMLList);
        localStorage.setItem(this.listKey, JSON.stringify(this.listArray));
    }

    getStorageList() {
        let storedList = localStorage.getItem(this.listKey);
        this.listArray = storedList ? JSON.parse(storedList) : [];
        let listDataId = 3;
        this.listArray.forEach((list, i) => {
            if (i === 0) {
                listCont.innerHTML = list; // Clear the list container for the first item
            } else {
                let newList = document.createElement("div");
                newList.classList.add("list");
                newList.setAttribute("data-list-id", listDataId);
                listDataId++;
                newList.innerHTML = list;
                listCont.appendChild(newList);
            }
        });
    }

    showList() {
        this.displayListOnLoad();
        this.openTodoDialog();
        this.closeTodoDialog();
    }
}

class Task {
    taskContentObj = {};
    taskStorageKey = "task key";
    checkIconContEvent = this.generateTask.bind(this);
    checkIconEdits = this.generateTaskEdits.bind(this);
    getClickedList() {
        document.addEventListener("click", (e) => {
            let clickedList = e.target.closest(".list");
            if (clickedList) {
                let listId = clickedList.dataset.listId;
                let listName =
                    clickedList.querySelector(".list-name").textContent;
                currentListName = listName;
                currentListId = listId;
                if (listId > 2) {
                    this.openCreatedTaskPage(listName);
                    defaultList = false;
                } else {
                    this.openDefaultTaskPage(listName);
                    defaultList = true;
                }
                this.createNewTaskBtn();
                this.openTaskPage();
                this.displayStoredTask(currentListName);
                this.displayTaskState();
                this.checkCompleteTask();
            }
        });
    }

    displayTaskState() {
        if (this.taskContentObj[currentListName]) {
            let taskDateAndTimes = document.querySelectorAll(
                ".description-mini-info"
            );
            if (taskDateAndTimes) {
                taskDateAndTimes.forEach((taskDateAndTime) => {
                    let taskDate = taskDateAndTime
                        .querySelector(".task-date")
                        .textContent.trim();
                    let taskTime = taskDateAndTime
                        .querySelector(".task-time")
                        .textContent.trim();
                    if (taskDate) {
                        if (this.formatCurentDate() === taskDate) {
                            if (taskTime) {
                                if (taskTime < this.formatCurrentTime()) {
                                    taskDateAndTime.style.color = "#e63946";
                                }
                            }
                        } else if (this.formatCurentDate() > taskDate) {
                            taskDateAndTime.style.color = "#e63946";
                        }
                    }
                    if (!taskDate && taskTime) {
                        if (taskTime < this.formatCurrentTime()) {
                            taskDateAndTime.style.color = "#e63946";
                        }
                    }
                });
            }
        }
    }
    formatCurentDate() {
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, "0");
        let date = String(now.getDate()).padStart(2, "0");
        let formattedDate = `${year}-${month}-${date}`;
        return formattedDate;
    }
    formatCurrentTime() {
        let now = new Date();
        let formattedTime = now.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
        return formattedTime;
    }

    createNewTaskBtn() {
        newListBtnText.innerHTML = "New Task";
        newListBtn.removeEventListener("click", openDialog);
        document.removeEventListener("keyup", addListByEnterKey);
    }
    openDefaultTaskPage(listName) {
        listCont.innerHTML = `
            <div class="task-header">
                <div class="left-content">
                    <i class="bi bi-arrow-left back-home-btn"></i>
                    <h2>${listName}</h2>
                </div>
            </div>
        `;
        toggleIcons("flex", "none");
    }
    openCreatedTaskPage(listName) {
        listCont.innerHTML = `
            <div class="task-header">
                <div class="left-content">
                    <i class="bi bi-arrow-left back-home-btn"></i>
                    <h1>${listName}</h1>
                </div>
                <div class="right-content">
                    <i class="bi bi-trash3 delete-list"></i>
                    <i class="bi bi-pencil edit-list"></i>
                </div>
            </div>
        `;
        toggleIcons("flex", "none");
    }

    openTaskPage() {
        newListBtn.addEventListener("click", getTaskPageContent);
        document.removeEventListener("keyup", editListByEnterKey);
    }

    createTask(description, date, time, repeate) {
        time = `   ${time}   `;
        if (description) {
            return `  
                <p class="task-headline">Task Completed.</p>                
                <div class="task">
                    <div class="left-content">
                        <input type="checkbox" class="checkbox">
                        <div class="descripton-cont">
                            <h4 class="task-decription">${description}</h4>
                            <div class="description-mini-info">
                                <p class="task-date">${date}</p>
                                <p class="task-time">${time}</p>
                                <p class="task-repeate-option">${repeate}</p>
                            </div>
                        </div>
                    </div>
                    <div class="right-content">
                        <i class="bi bi-pencil edit-task"></i>
                    </div>                
                </div>               
            `;
        }
    }
    createListObjStorage(listName) {
        let storedTask = localStorage.getItem(this.taskStorageKey);
        let taskObj = JSON.parse(storedTask);
        if (taskObj === null || !taskObj[listName]) {
            this.taskContentObj[listName] = [];
            this.updateTaskStorage();
        }
    }
    createDefaultListStorage() {
        this.createListObjStorage("Default");
        this.createListObjStorage("Important");
        this.createListObjStorage("Today");
    }
    displayStoredTaskOnLoad(listName) {
        let currentTaskArray = this.checkTaskInStorage();
        if (currentTaskArray === undefined) {
            this.task.taskContentObj[listName] = [];
            this.task.updateTaskStorage();
        } else {
            this.task.displayStoredTask();
        }
        this.task.checkTaskInStorage();
    }

    checkTaskInStorage(listName) {
        let storedTask = localStorage.getItem(this.taskStorageKey);
        this.taskContentObj = JSON.parse(storedTask);
        let currentTaskArray = this.taskContentObj[listName];
        return currentTaskArray;
    }

    checkCompleteTask() {
        let checkBoxes = document.querySelectorAll(".checkbox");
        if (checkBoxes) {
            checkBoxes.forEach((checkBox, i) => {
                checkBox.addEventListener("click", () => {
                    let taskCont = document.querySelectorAll(".task")[i];
                    let comletedTaskHeadline =
                        document.querySelectorAll(".task-headline")[i];
                    comletedTaskHeadline.classList.toggle(
                        "task-comlete-headline"
                    );
                    taskCont.classList.toggle("complete-task");
                });
            });
        }
    }
    addTaskToStorage(newTask) {
        let currentTaskArray = this.checkTaskInStorage(currentListName);
        if (currentTaskArray) {
            this.taskContentObj[currentListName].push(newTask);
            this.updateTaskStorage();
        }
        this.checkTaskInStorage();
    }
    updateTaskStorage() {
        localStorage.setItem(
            this.taskStorageKey,
            JSON.stringify(this.taskContentObj)
        );
    }
    displayStoredTask(listName) {
        let currentTaskArray = this.checkTaskInStorage(listName);
        let taskCont = document.createElement("div");
        taskCont.classList.add("tasks-cont");
        let taskDataId = 0;
        currentTaskArray.forEach((taskContent) => {
            let div = document.createElement("div");
            div.setAttribute("data-list-id", taskDataId);
            div.classList.add("task-cont");
            div.innerHTML = taskContent;
            taskCont.appendChild(div);
            listCont.appendChild(taskCont);
            taskDataId++;
        });
        return listCont;
    }

    generateTask() {
        let description = document.querySelector(".description");
        let date = document.querySelector(".date");
        let time = document.querySelector(".time");
        let repeate = document.querySelector(".repeate-options");
        let newTask = this.createTask(
            description.value,
            date.value,
            time.value,
            repeate.value
        );

        if (defaultList) {
            this.openDefaultTaskPage(currentListName);
        } else {
            this.openCreatedTaskPage(currentListName);
        }
        this.addTaskToStorage(newTask);
        this.displayStoredTask(currentListName);
        this.displayTaskState();
        this.displayTaskState();
    }

    rederTask() {
        checkIconCont.removeEventListener("click", this.checkIconEdits);
        checkIconCont.addEventListener("click", this.checkIconContEvent);
    }

    displayTaskContent() {
        let taskCont = document.createElement("div");
        taskCont.classList.add(".task-cont");
        taskCont.innerHTML = this.createTask();
        listAmount.innerHTML = taskCont;
    }

    moveBackTocreateTask() {
        if (!defaultList) {
            this.openCreatedTaskPage(currentListName);
        } else {
            this.openDefaultTaskPage(currentListName);
        }
        this.displayStoredTask(currentListName);
        newListBtn.innerHTML = `
            <div class="plus-icon">
                <i class="bi bi-plus-lg"></i>
            </div>
            <p>New Task</p>
    `;
    }
    openEditTaskPage() {
        document.addEventListener("click", (e) => {
            let clickedTask = e.target.closest(".edit-task");
            if (clickedTask) {
                let taskCont = clickedTask.closest(".task-cont");
                let descriptionValue =
                    taskCont.querySelector(".task-decription").textContent;
                let dateValue =
                    taskCont.querySelector(".task-date").textContent;
                let timeValue =
                    taskCont.querySelector(".task-time").textContent;
                let repeateOptionValue = taskCont.querySelector(
                    ".task-repeate-option"
                ).textContent;
                getTaskPageContent();
                document.querySelector(".delete-task").style.display =
                    "inline-block";
                let description = document.querySelector(".description");
                description.value = descriptionValue;
                description.focus();
                description.select();
                let date = document.querySelector(".date");
                date.value = dateValue;
                let time = document.querySelector(".time");
                if (dateValue) {
                    date.value = dateValue;
                }

                if (timeValue) {
                    time.value = timeValue.trim();
                }
                let repeate = document.querySelector(".repeate-options");
                repeate.value = repeateOptionValue;
                let taskIdx = Array.from(taskCont.parentNode.children).indexOf(
                    taskCont
                );
                currentTaskIdx = taskIdx;
                this.deleteTask();
                this.editTaskContent();
                document.removeEventListener("keyup", addTaskByEnterkey);
                document.addEventListener("keyup", editTaskByEnterKey);
            }
        });
    }

    removeTask() {
        let allTask = localStorage.getItem(this.taskStorageKey);
        let taskIdx = parseInt(currentTaskIdx);
        if (allTask) {
            this.taskContentObj = JSON.parse(allTask);
            this.taskContentObj[currentListName].splice(taskIdx, 1);
            localStorage.setItem(
                this.taskStorageKey,
                JSON.stringify(this.taskContentObj)
            );
            this.displayStoredTask(currentListName);
            this.moveBackTocreateTask();
        }
    }
    deleteTask() {
        const deleteTaskBtn = document.querySelector(".delete-task");
        const deletingTask = () => {
            if (confirm("Are you sure you want to delete this Task?")) {
                this.removeTask();
                checkIconCont.removeEventListener("click", this.checkIconEdits);
                checkIconCont.addEventListener(
                    "click",
                    this.checkIconContEvent
                );
                this.displayTaskState();
                deleteTaskBtn.removeEventListener("click", deletingTask);
                this.checkCompleteTask();
            }
        };

        deleteTaskBtn.removeEventListener("click", deletingTask); // Ensure no duplicate listeners
        deleteTaskBtn.addEventListener("click", deletingTask);
    }
    generateTaskEdits() {
        let description = document.querySelector(".description");
        let date = document.querySelector(".date");
        let time = document.querySelector(".time");
        let repeate = document.querySelector(".repeate-options");
        let editedTask = this.createTask(
            description.value,
            date.value,
            time.value,
            repeate.value
        );
        let taskIdx = parseInt(currentTaskIdx);
        let storedTask = localStorage.getItem(this.taskStorageKey);
        this.taskContentObj = JSON.parse(storedTask);
        let listToEdit = this.taskContentObj[currentListName];
        let editedList = listToEdit.toSpliced(taskIdx, 1, editedTask);
        this.taskContentObj[currentListName] = editedList;
        this.updateTaskStorage();
        if (defaultList) {
            this.openDefaultTaskPage(currentListName);
        } else {
            this.openCreatedTaskPage(currentListName);
        }
        this.displayStoredTask(currentListName);
        this.displayTaskState();
        this.displayTaskState();
    }
    editTaskContent() {
        checkIconCont.removeEventListener("click", this.checkIconContEvent);
        document.addEventListener("keyup", addTaskByEnterkey);
        checkIconCont.addEventListener("click", this.checkIconEdits);
    }
    showTask() {
        this.getClickedList();
        this.createDefaultListStorage();
        this.rederTask();
        this.openEditTaskPage();
        this.displayTaskState();
    }
}

class TodoList {
    constructor() {
        this.list = new List();
        this.task = new Task();
    }
    addNewList() {
        let listTitleValue = listTitle.value;
        this.list.getStorageList();
        let listTaskArray = this.checkListNameInObj(listTitleValue);

        if (listTitleValue && listTaskArray == null) {
            this.list.newTodoListName = listTitleValue;
            this.list.addToStorage();
            this.list.getStorageList();
            newListDialog.close();
            this.task.taskContentObj[listTitleValue] = [];
            this.task.updateTaskStorage();
        } else if (listTitleValue && listTaskArray) {
            newListError.innerHTML = `${listTitleValue} already exixt`;
            newListError.style.padding = ".5rem";
        } else {
            newListError.innerHTML = "Please enter a list title";
            newListError.style.padding = ".5rem";
        }
    }

    checkListNameInObj(listName) {
        let storedListName = localStorage.getItem(this.task.taskStorageKey);
        this.task.taskContentObj = storedListName
            ? JSON.parse(storedListName)
            : {};
        let currentTaskArray = this.task.taskContentObj[listName];
        return currentTaskArray;
    }
    displayNewList() {
        addTodoListBtn.addEventListener("click", () => {
            this.addNewList();
        });
    }

    moveToHomeSection() {
        document.addEventListener("click", (e) => {
            let clickedList = e.target.closest(".back-home-btn");
            if (clickedList) {
                this.list.getStorageList();
                this.list.openTodoDialog();
                newListBtn.removeEventListener("click", getTaskPageContent);
                newListBtnText.innerHTML = "New List";
                toggleIcons("flex", "none");
                document.removeEventListener("keyup", addTaskByEnterkey);
            }
        });
    }

    moveToTaskSection() {
        document.addEventListener("click", (e) => {
            let clickedBtn = e.target.closest(".back-task-btn");
            if (clickedBtn) {
                this.task.moveBackTocreateTask();
                this.task.displayTaskState();
                this.task.checkCompleteTask();
            }
        });
    }

    editListName() {
        document.addEventListener("click", (e) => {
            let clickedBtn = e.target.closest(".edit-list");
            if (clickedBtn) {
                editListDialog.showModal();
                editListTitle.value = currentListName;
                editListTitle.focus();
                editListTitle.select();
                document.addEventListener("keyup", editListByEnterKey);
            }
        });
    }
    editListArray(newListName) {
        let storedList = localStorage.getItem(this.list.listKey);
        this.list.listArray = JSON.parse(storedList);
        this.list.listArray[currentListId - 2] =
            this.list.createNewList(newListName);
        localStorage.setItem(
            this.list.listKey,
            JSON.stringify(this.list.listArray)
        );
        this.list.getStorageList();
        editListDialog.close();
    }
    editTaskContentObj(newListName) {
        let storedListName = localStorage.getItem(this.task.taskStorageKey);
        this.task.taskContentObj = JSON.parse(storedListName);
        this.task.taskContentObj[newListName] =
            this.task.taskContentObj[currentListName];
        delete this.task.taskContentObj[currentListName];
        this.task.updateTaskStorage();
    }
    addEditListName() {
        addEditBtn.addEventListener("click", editListTitleName);
    }

    removeListFromObj() {
        let storedListName = localStorage.getItem(this.task.taskStorageKey);
        this.task.taskContentObj = JSON.parse(storedListName);
        delete this.task.taskContentObj[currentListName];
        localStorage.setItem(
            this.task.taskStorageKey,
            JSON.stringify(this.task.taskContentObj)
        );
    }
    removeListFromList() {
        if (!isNaN(currentListId)) {
            let allList = localStorage.getItem(this.list.listKey);

            let deletedListId = parseInt(currentListId);
            if (allList) {
                this.list.listArray = JSON.parse(allList);
                this.list.listArray.splice(deletedListId - 2, 1);
                localStorage.setItem(
                    this.list.listKey,
                    JSON.stringify(this.list.listArray)
                );
                this.list.getStorageList();
                this.list.openTodoDialog();
                newListBtn.removeEventListener("click", getTaskPageContent);
                newListBtnText.innerHTML = "New List";
                this.removeListFromObj();
            }
        }
    }
    deleteList() {
        document.addEventListener("click", (e) => {
            let clickedBtn = e.target.closest(".delete-list");
            if (clickedBtn) {
                confirm("Are you sure you want to delete this list?") &&
                    this.removeListFromList();
            }
        });
    }

    showList() {
        this.list.showList();
        this.task.showTask();
        this.displayNewList();
        this.moveToHomeSection();
        this.moveToTaskSection();
        this.deleteList();
        this.editListName();
        this.addEditListName();
    }
}

let todoList = new TodoList();
todoList.showList();
