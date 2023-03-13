
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
    button.setAttribute('type', 'submit')

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

  function createTodoApp(container,
     {title = "Список дел",
      owner,
      todoItemList = [],
      onCreateFormSubmit,
      onDoneClick,
      onDeleteClick
      }) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    const handlers = {onDone: onDoneClick, onDelete: onDeleteClick}

    

    container.append(todoAppTitle);
    container.append(todoItemForm.form); 
    container.append(todoList);

    todoItemList.forEach(todoItem =>  {
      const todoItemElement = createTodoItemElement (todoItem, handlers);
      todoList.append(todoItemElement);
    })

    todoItemForm.form.addEventListener("submit", async (event)=> { 
      event.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }
      const todoItem = await onCreateFormSubmit({
        owner,
        name : todoItemForm.input.value.trim()
      })

      let todoItemElement =  createTodoItemElement(todoItem, handlers);
      todoList.append(todoItemElement);
      todoItemForm.input.value = "";
    });

  }

  function createTodoItemElement(todoItem, {onDone, onDelete}) {
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

    item.textContent = todoItem.name;
    item.setAttribute("index", todoItem.id);

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    doneButton.addEventListener("click", async (e)=> {
      e.preventDefault();
      await onDone({element:item, todoItem })
    });

    deleteButton.addEventListener("click", async(e)=> {
      e.preventDefault();
     await onDelete({element:item, todoItem })
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    button.setAttribute("disabled", "disabled");
    return item;
  }

 export { createTodoApp } ;

