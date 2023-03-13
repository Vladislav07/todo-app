import { createTodoApp } from './view.js';
const btnToggle = document.querySelector('.btn-js');
const navLinks = document.querySelectorAll('.nav-link');
let  modulePath = './apiLocalStorage.js';
let isLocalStorage = true;
let owner = navLinks[0].textContent;
navLinks[0].classList.add('active');

navLinks.forEach(element =>{
  element.addEventListener("click", (event)=>{
    event.preventDefault();
    owner = element.textContent;
    navLinks.forEach(el => {
      el.classList.remove('active');
    })
    element.classList.add('active');
    LoadApp();
  })
})


btnToggle.addEventListener('click', (e) => {
  e.preventDefault();
  if (isLocalStorage) {
    btnToggle.textContent = 'Перейти на локальное хранилище'
    isLocalStorage = false;
    modulePath = './apiServer.js';
  }
  else {
    btnToggle.textContent = 'Перейти на серверное хранилище'
    isLocalStorage = true;
    modulePath = './apiLocalStorage.js';
  }
  LoadApp();
})



export async function LoadApp() {
  const container = document.getElementById("todo-app");
  if(container.children.length > 0){
    for (let index = container.children.length; index > 0 ; index--) {
      let element = container.children[index-1];
      element.remove();
    }
  }
  const { getTodoList,
    createTodoItem,
    switchTodoItemDone,
    deleteTodoItem } = await import(modulePath);
 const todoItemList = await getTodoList(owner);

  createTodoApp(container,
    {
      title: "Список дел",
      owner,
      todoItemList,
      onCreateFormSubmit: createTodoItem,
      onDoneClick: switchTodoItemDone,
      onDeleteClick: deleteTodoItem,
    }
  );
}