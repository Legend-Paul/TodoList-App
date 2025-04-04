let newListBtn = document.querySelector(".new-list-btn");
let newListDialog = document.querySelector(".new-list-dialog");
let listTitle = document.querySelector(".list-title");
let addTodoListBtn = document.querySelector(".add");
let cancelDialog = document.querySelector(".cancel");
let listCont =document.querySelector(".list-cont");
let newListBtnText = document.querySelector(".new-list-btn p");
let deleteList = document.querySelector(".bi-trash3");
let editList = document.querySelector(".bi-pencil");
let listName = document.querySelector(".list-name");
let listAmount = document.querySelector(".amount");
let checkIcon = document.querySelector(".check-icon i");
let checkIconCont = document.querySelector(".check-icon");


let currentListName = '';
let defaultList = true;


function openDialog() {
    newListDialog.showModal();
    listTitle.value = "";
}
function getTaskPageContent(){
    let taskPageContent = `
        <div class="task-header">
            <div class="left-content">
                <i class="bi bi-arrow-left back-task-btn"></i>
            </div>
            <div class="right-content">
                <i class="bi bi-trash3"></i>
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
function toggleIcons(newListBtnState, checkIconState){
    newListBtn.style.display= newListBtnState;
    checkIcon.style.display = checkIconState;
}


class List {
    listArray = [`
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
                        <i class="bi bi-star-fill"></i>
                    </div>
                    <h3 class="list-name">Important</h3>
                </div>                
                <p class="amount"></p>
            </div>
            <hr>
        `];
    listKey = "list key";
    newTodoListName = '';

    displayListOnLoad() {           
            document.addEventListener("DOMContentLoaded", ()=>{
                let storedList = localStorage.getItem(this.listKey);
                if (!storedList){
                    localStorage.setItem(this.listKey, JSON.stringify(this.listArray));
                }
                this.getStorageList();
                toggleIcons("flex", "none");

            
        });
    }

    openTodoDialog(){
        newListBtn.addEventListener ("click", openDialog);
    }
    
    closeTodoDialog(){
        cancelDialog.addEventListener("click", ()=>{
            newListDialog.close();
        });
    }

    createNewList(){
       return  `
            <div class="name">
                <div class="icon">
                    <i class="bi bi-person-lines-fill"></i>
                </div>
                <h3 class="list-name">${this.newTodoListName}</h3>
            </div>                
            <p class="amount"></p>
            `;
        
    }

    addToStorage(){
        let newHTMLList = this.createNewList();
        this.listArray.push(newHTMLList);
        localStorage.setItem(this.listKey, JSON.stringify(this.listArray));
    }

    getStorageList() {
        let storedList = localStorage.getItem(this.listKey);
        this.listArray = storedList ? JSON.parse(storedList) : [];
        let listDataId = 3;
        this.listArray.forEach((list, i) =>  {
            if (i === 0) {        
            listCont.innerHTML = list; // Clear the list container for the first item
            }
            else {
                let newList = document.createElement("div");
                newList.classList.add("list");
                newList.setAttribute("data-list-id", listDataId);
                listDataId++;
                newList.innerHTML = list; 
                listCont.appendChild(newList);
            }
            
        });
    }
    addNewList(){
        let listTitleValue = listTitle.value;        
            if (listTitleValue){
                this.newTodoListName = listTitleValue;
                this.addToStorage();
                this.getStorageList();
                newListDialog.close();                
            }
    }
    displayNewList(){
        document.addEventListener("keyup", (e)=>{
            if (e.key == "Enter"){
                this.addNewList();                
            }
        });
        addTodoListBtn.addEventListener("click", ()=>{
            this.addNewList();
        });
    }
    
    showList(){
        this.displayListOnLoad();
        this.openTodoDialog();
        this.closeTodoDialog();
        this.displayNewList();
    }
}

class Task {
    takContentArray = [];
    takStorageKey = "task key";
    getClickedList() {
        document.addEventListener("click", (e) => {
            let clickedList = e.target.closest(".list"); 
            if (clickedList) {
                let listId = clickedList.dataset.listId; 
                let listName = clickedList.querySelector(".list-name").textContent; 
                currentListName = listName;
                if (listId > 2){
                    this.openCreatedTaskPage(listName);
                    defaultList = false;
                }                
                else {
                    this.openDefaultTaskPage(listName);
                    defaultList = true;
                }
                this.createNewTaskBtn();
                this.openTaskPage();
            }
        });
    }
   
    createNewTaskBtn(){
        newListBtnText.innerHTML = "New Task";
        newListBtn.removeEventListener("click", openDialog);
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
                    <i class="bi bi-trash3"></i>
                    <i class="bi bi-pencil"></i>
                </div>
            </div>
        `;
        toggleIcons("flex", "none");

    }
    
    openTaskPage(){
        newListBtn.addEventListener("click", getTaskPageContent);
    }
    
    createTask(description, date, time, repeate){
        if (description) {
            return `            
                <div class="task">
                    <div class="left-content">
                        <input type="checkbox" class="checkbox">
                        <div class="descripton-cont">
                            <h4 class="decription">${description}</h4>
                            <p>${date} ${time} ${repeate}</p>
                        </div>
                    </div>
                    <div class="right-content">
                        <i class="bi bi-star-fill"></i>
                    </div>                
                </div>                
            `; 
        }
        
    }
    addTaskToStorage(){
        // this.takContentArray.push(this.createTask());
        // localStorage.setItem(this.takStorageKey, JSON.stringify())
    }
    addTask() {
        checkIconCont.addEventListener("click", ()=>{
            let description = document.querySelector(".description");
            let date = document.querySelector(".date");
            let time = document.querySelector(".time");
            let repeate = document.querySelector(".repeate-options");
            console.log(repeate.value);
            
            let newTask = this.createTask(description.value, date.value, time.value, repeate.value)
                if (defaultList){
                    this.openDefaultTaskPage(currentListName);
                }
                else {
                    this.openCreatedTaskPage(currentListName);
                }
                let taskCont = document.createElement("div");
                taskCont.classList.add(".task-cont");
                taskCont.innerHTML = newTask;
                console.log(newTask);
                listCont.appendChild(taskCont);
                
            });
    }
    displayTaskContent(){
        let taskCont = document.createElement("div");
        taskCont.classList.add(".task-cont");
        taskCont.innerHTML = this.createTask();
        listAmount.innerHTML = taskCont;
    }
    showTask() {
        this.getClickedList(); 
        this.addTask();
    }
}

class TodoList{
    constructor() {
        this.list = new List();
        this.task = new Task();
    }
    moveToHomeSection () {
        document.addEventListener("click", (e)=>{
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

    moveToTaskSection(){
        document.addEventListener("click", (e)=>{
            let clickedBtn = e.target.closest(".back-task-btn");
            if (clickedBtn) {
                if (!defaultList){
                    this.task.openCreatedTaskPage(currentListName);
                }                
                else {
                    this.task.openDefaultTaskPage(currentListName);
                }
                newListBtn.innerHTML =`
                        <div class="plus-icon">
                            <i class="bi bi-plus-lg"></i>
                        </div>
                        <p>New Task</p>
                `;

            }
        }); 
    }
    

    showList() {
        this.list.showList();
        this.task.showTask();
        this.moveToHomeSection();
        this.moveToTaskSection();
    }
}

let todoList = new TodoList();
todoList.showList();
