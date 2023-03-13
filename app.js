let todoListMemory = [];
  let localStorage = window.localStorage;
  //заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.setAttribute("disabled", "disabled");
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    input.addEventListener("input", function (e) {
      e.preventDefault();
      if (input.value !== "") {
        button.removeAttribute("disabled");
      } else {
        button.setAttribute("disabled", "disabled");
      }
    });

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoApp(container, title = "Список дел", listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    if (JSON.parse(localStorage.getItem(listName))) {
      let todoListTemp = JSON.parse(localStorage.getItem(listName));
      for (const itemTodo of todoListTemp) {    
        todoList.append(createTodoItemElement(itemTodo));
      }
    }

    todoItemForm.form.addEventListener("submit", async (e)=> { 
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          name:todoItemForm.input.value.trim(),
          owner: 'my'
        }),
        headers: {
          'Content-Type': 'application/json',
        }    
      })

      const todoItem = await response.json();

      let todoItemElement = createTodoItemElement(todoItem);
       SaveTaskList(listName, todoListMemory);
      todoList.append(todoItemElement);
      todoItemForm.input.value = "";
    });

  }

  function createTodoItemElement(itemTodo) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    let button = document.querySelector(".btn-primary");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    if ((todoListMemory.length !== 0) && itemTodo.id === 0) {
      id = Math.max(...todoListMemory.map((item) => item.id));
      id++;
    }
   

    todoListMemory.push({ name: itemTodo.name, done: itemTodo.done, id: itemTodo.id });
    item.textContent = itemTodo.name;
    item.setAttribute("index", itemTodo.id);

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    doneButton.addEventListener("click", function () {
      let indexItem = parseInt(item.getAttribute("index"));
      let tempItem = todoListMemory.find((i) => i.id === indexItem);
      tempItem.done = !tempItem.done;
      item.classList.toggle("list-group-item-success");
      SaveTaskList(listName, todoListMemory);
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        let indexItem = parseInt(item.getAttribute("index"));
        let todoItemIndex = todoListMemory.findIndex(
          (i) => i.id === indexItem
        );
        todoListMemory.splice(todoItemIndex, 1);
        item.remove();
        SaveTaskList(listName, todoListMemory);
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    button.setAttribute("disabled", "disabled");

    return item;
  }

  function SaveTaskList(listName, list) {
    localStorage.setItem(listName, JSON.stringify(list));
  }

 export { createTodoApp } ;
