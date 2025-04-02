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

function openDialog() {
    newListDialog.showModal();
    newListBtnText.innerHTML = "New List";
    listTitle.value = "";
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
    getClickedList() {
        listCont.addEventListener("click", (e) => {
            const clickedList = e.target.closest(".list"); 
            if (clickedList) {
                let listId = clickedList.dataset.listId; 
                let listName = clickedList.querySelector(".list-name").textContent; 
                if (listId > 2){
                    listCont.innerHTML = this.openCreatedTaskPage(listName);
                }                
                else {
                    listCont.innerHTML = this.openDefaultTaskPage(listName);
                }
                this.changeAddBtn();
            }
        });
    }
    changeAddBtn(){
        newListBtnText.innerHTML = "New Task";
        newListBtn.removeEventListener("click", openDialog);
    }
    openDefaultTaskPage(listName) {
        return `
            <div class="task-header">
                <div class="left-content">
                    <i class="bi bi-arrow-left"></i>
                    <h2>${listName}</h2>
                </div>
            </div>
        `;
    }
    openCreatedTaskPage(listName) {
        return `
            <div class="task-header">
                <div class="left-content">
                    <i class="bi bi-arrow-left"></i>
                    <h1>${listName}</h1>
                </div>
                <div class="right-content">
                    <i class="bi bi-trash3"></i>
                    <i class="bi bi-pencil"></i>
                </div>
            </div>
        `;
    }

    showTask() {
        this.getClickedList(); 
    }
}

class TodoList{
    constructor() {
        this.list = new List();
        this.task = new Task();
    }
    moveToDefaultSection () {
        document.addEventListener("click", (e)=>{
            const clickedList = e.target.closest(".bi-arrow-left");
            console.log(clickedList);
            if (clickedList) {
                this.list.getStorageList();
                this.list.openTodoDialog();
            }
        });
        
    }
    showList() {
        this.list.showList();
        this.task.showTask();
        this.moveToDefaultSection();
    }
}

const todoList = new TodoList();
// todoList.showList();
