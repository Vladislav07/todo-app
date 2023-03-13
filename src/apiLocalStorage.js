let localStorage = window.localStorage;
let todoListMemory = [];
let currentOwner = '';
export function getTodoList(owner) {
  if (JSON.parse(localStorage.getItem(owner))) {
    currentOwner = owner;
    todoListMemory = JSON.parse(localStorage.getItem(owner))
    return todoListMemory;
  }


}

export function createTodoItem({ owner, name }) {
  currentOwner = owner;
  let id = 1;
  if (JSON.parse(localStorage.getItem(owner))) {
    todoListMemory = JSON.parse(localStorage.getItem(owner))
  }
  
  if (todoListMemory.length !== 0) {
    id = Math.max(...todoListMemory.map((item) => item.id));
    id++;

  }
  todoListMemory.push({ name: name, done: false, id: id });
  localStorage.setItem(owner, JSON.stringify(todoListMemory));
  return { name: name, done: false, id: id };
}

export function switchTodoItemDone({ element, todoItem }) {
  todoItem.done = !todoItem.done;
  element.classList.toggle("list-group-item-success");
  let todoItemIndex = todoListMemory.findIndex((i) => i.id === todoItem.id);
  todoListMemory[todoItemIndex].done = todoItem.done;
  localStorage.setItem(currentOwner, JSON.stringify(todoListMemory));
}

export function deleteTodoItem({ element, todoItem }) {
  if (!confirm("Вы уверены?")) {
    return;
  }
  element.remove();
  let todoItemIndex = todoListMemory.findIndex((i) => i.id === todoItem.id);
  todoListMemory.splice(todoItemIndex, 1);
  localStorage.setItem(currentOwner, JSON.stringify(todoListMemory));
}