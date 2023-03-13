(function () {
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
        let todoItemFromStorage = createTodoItem(
          itemTodo.name,
          itemTodo.done,
          itemTodo.id
        );
        AddHandleState(todoItemFromStorage);
        AddHandleDelete(todoItemFromStorage);
        todoList.append(todoItemFromStorage.item);
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

      let todoItemElement = createTodoItem(todoItem.name);
      // SaveTaskList(listName, todoListMemory);
      // AddHandleState(todoItemElement);
      // AddHandleDelete(todoItemElement);
      todoList.append(todoItemElement.item);
      todoItemForm.input.value = "";
    });

    function AddHandleDelete(todoItem) {
      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          let indexItem = parseInt(todoItemElement.item.getAttribute("index"));
          let todoItemIndex = todoListMemory.findIndex(
            (i) => i.id === indexItem
          );
          todoListMemory.splice(todoItemIndex, 1);
          todoItemElement.item.remove();
          SaveTaskList(listName, todoListMemory);
        }
      });
    }

    function AddHandleState(todoItem) {
      todoItem.doneButton.addEventListener("click", function () {
        let indexItem = parseInt(todoItem.item.getAttribute("index"));
        let tempItem = todoListMemory.find((i) => i.id === indexItem);
        tempItem.done = !tempItem.done;
        todoItem.item.classList.toggle("list-group-item-success");
        SaveTaskList(listName, todoListMemory);
      });
    }
  }

  function createTodoItem(name, done = false, id = 0) {
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

    if ((todoListMemory.length !== 0) && id === 0) {
      id = Math.max(...todoListMemory.map((item) => item.id));
      id++;
    }

    todoListMemory.push({ name: name, done: done, id: id });
    item.textContent = name;
    item.setAttribute("index", id);

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    button.setAttribute("disabled", "disabled");

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function SaveTaskList(listName, list) {
    localStorage.setItem(listName, JSON.stringify(list));
  }

  window.createTodoApp = createTodoApp;
})();
