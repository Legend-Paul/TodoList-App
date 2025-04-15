let newListBtn = document.querySelector(".new-list-btn");
let newListDialog = document.querySelector(".new-list-dialog");
let listTitle = document.querySelector(".list-title");
let addTodoListBtn = document.querySelector(".add");
let cancelDialog = document.querySelector(".cancel");
let listCont = document.querySelector(".list-cont");
let newListBtnText = document.querySelector(".new-list-btn p");
let listName = document.querySelector(".list-name");
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
// eslint-disable-next-line no-unused-vars
let currentTaskId = "";
// eslint-disable-next-line no-unused-vars
let currentTaskName = "";

function openDialog() {
    newListDialog.showModal();
    listTitle.value = "";
    newListError.innerHTML = "";
    newListError.style.padding = "0";
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
                <p>Select Repeate Options</p>
                <select name="repeate-options" class="repeate-options">
                    <option value="Once">No Repeate</option>
                    <option value="Everyday">Everyday</option>
                    <option value="Per week">Per Week</option>
                    <option value="Per month">Per Month</option>
                </select>
            </div>
        </div>     
    `;
    listCont.innerHTML = taskPageContent;
    toggleIcons("none", "inline-block");
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
                newListDialog.close();
                editListDialog.close();
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
                // this.displayStoredTask();
                this.displayStoredTask(currentListName);
                // this.displayStoredTaskOnLoad();
            }
        });
    }

    createNewTaskBtn() {
        newListBtnText.innerHTML = "New Task";
        newListBtn.removeEventListener("click", openDialog);
        document.removeEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                this.addNewList();
            }
        });
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
    }

    createTask(description, date, time, repeate) {
        time = `   ${time}   `;
        if (description) {
            return `                  
                <div class="task">
                    <div class="left-content">
                        <input type="checkbox" class="checkbox">
                        <div class="descripton-cont">
                            <h4 class="task-decription">${description}</h4>
                            <div class="description-mini-info">
                                <p class=""task-date">${date}</p>
                                <p class=""task-time">${time}</p>
                                <p class=""task-repeate-option">${repeate}</p>
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
        checkIconCont.addEventListener("click", () => {
            let checkbox = document.querySelector(".checkbox");
            checkbox.addEventListener("click", (e) => {
                let task = e.target.closest(".task");
                task.classList.toggle("checked");
            });
        });
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

    rederTask() {
        checkIconCont.addEventListener("click", () => {
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
        });
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
    openTask() {
        document.addEventListener("click", (e) => {
            let clickedTask = e.target.closest(".edit-task");
            if (clickedTask) {
                let taskCont = clickedTask.closest(".task-cont");
                let descriptionValue =
                    taskCont.querySelector(".task-decription").textContent;
                let dateValue =
                    taskCont.querySelector(".task-decription").textContent;
                let timeValue =
                    taskCont.querySelector(".task-decription").textContent;
                let repeateOptionValue =
                    taskCont.querySelector(".task-decription").textContent;
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
                time.value = timeValue;
                let repeate = document.querySelector(".repeate-options");
                repeate.value = repeateOptionValue;
                let taskIdx = Array.from(taskCont.parentNode.children).indexOf(
                    taskCont
                );
                let idx = taskIdx;
                console.log("Task Id: " + idx);
                this.deleteTask(taskIdx);
            }
        });
    }

    removeTask(taskIdx) {
        let allTask = localStorage.getItem(this.taskStorageKey);
        if (allTask) {
            taskIdx = parseInt(taskIdx);
            this.taskContentObj = JSON.parse(allTask);
            console.log(this.taskContentObj[currentListName].length);
            console.log("Remove Task Id: " + taskIdx);
            this.taskContentObj[currentListName].splice(taskIdx, 1);
            console.log(this.taskContentObj[currentListName].length);
            localStorage.setItem(
                this.taskStorageKey,
                JSON.stringify(this.taskContentObj)
            );
            this.displayStoredTask(currentListName);
            this.moveBackTocreateTask();
        }
    }
    deleteTask(taskIdx) {
        const deleteTaskBtn = document.querySelector(".delete-task");
        const newDeleteTaskHandler = (e) => {
            if (confirm("Are you sure you want to delete this Task?")) {
                this.removeTask(taskIdx);
                deleteTaskBtn.removeEventListener(
                    "click",
                    newDeleteTaskHandler
                );
            }
        };

        deleteTaskBtn.removeEventListener("click", newDeleteTaskHandler); // Ensure no duplicate listeners
        deleteTaskBtn.addEventListener("click", newDeleteTaskHandler);
    }
    showTask() {
        this.getClickedList();
        this.createDefaultListStorage();
        this.rederTask();
        this.openTask();
        // this.deleteTask();
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
        if (listTitleValue) {
            let listTitle = listTitleValue.toLowerCase();
            console.log(listTitle);
        }

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
            newListError.innerHTML = "Please enter a list name";
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
        document.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                this.addNewList();
            }
        });
        addTodoListBtn.addEventListener("click", () => {
            this.addNewList();
        });
    }

    displayListOnLoad() {}
    moveToHomeSection() {
        document.addEventListener("click", (e) => {
            let clickedList = e.target.closest(".back-home-btn");
            if (clickedList) {
                this.list.getStorageList();
                this.list.openTodoDialog();
                newListBtn.removeEventListener("click", getTaskPageContent);
                newListBtnText.innerHTML = "New List";
                toggleIcons("flex", "none");
            }
        });
    }

    moveToTaskSection() {
        document.addEventListener("click", (e) => {
            let clickedBtn = e.target.closest(".back-task-btn");
            if (clickedBtn) {
                this.task.moveBackTocreateTask();
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
        addEditBtn.addEventListener("click", () => {
            let newListName = editListTitle.value;
            if (newListName) {
                this.editListArray(newListName);
                this.editTaskContentObj(newListName);
            }
        });
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
