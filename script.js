let newListBtn = document.querySelector(".new-list-btn");
let newListDialog = document.querySelector(".new-list-dialog");
let listTitle = document.querySelector(".list-title");
let addTodoListBtn = document.querySelector(".add");
let cancelDialog = document.querySelector(".cancel");
let listCont =document.querySelector(".list-cont");

let names = [];
function name(){
    return `Paul`;
}
names.push(name());



class TodoList {
    listArray = [];
    listKey = "list key";
    newTodoListName = '';

    displayListOnLoad() {
        document.addEventListener("DOMContentLoaded", ()=>{
            this.getStorageList();
        });
    }

    openTodoDialog(){
        newListBtn.addEventListener ("click", ()=>{
            listTitle.value = ""; 
            newListDialog.showModal();
        });
    }
    
    closeTodoDialog(){
        cancelDialog.addEventListener("click", ()=>{
            newListDialog.close();
        });
    }

    createNewList(){
       return  `
                    <div class="name">
                        <div class="icon"></div>
                        <h3>${this.newTodoListName}</h3>
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
        this.listArray = storedList ? JSON.parse(storedList) : []; // Parse or initialize as an empty array
        for (let list of this.listArray) {
            let newList = document.createElement("div");
            newList.classList.add("list");
            newList.innerHTML += list; 
            listCont.appendChild(newList);
        }
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


let todoList = new TodoList();
todoList.showList();