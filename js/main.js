function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function getUnfinishedTasksCount() {
  const todoItemsCount = window.localStorage.length;
  let count = 0;

  for (let i = 0; i < todoItemsCount; i++) {
    const key = window.localStorage.key(i);
    const item = JSON.parse(window.localStorage.getItem(key));
    if (!item.done) count += 1;
  }

  return count;
}

function getFinishedTasksCount() {
  const todoItemsCount = window.localStorage.length;
  let count = 0;

  for (let i = 0; i < todoItemsCount; i++) {
    const key = window.localStorage.key(i);
    const item = JSON.parse(window.localStorage.getItem(key));
    if (item.done) count += 1;
  }

  return count;
}

if (storageAvailable("localStorage")) {
  const todoHeader = document.getElementsByClassName("todo-header");
  const doneTodoHeader = document.getElementsByClassName("done-header");
  const todoItemsCount = window.localStorage.length;
  const todoList = document.getElementsByClassName("todo-list");
  const doneTodoList = document.getElementsByClassName("done-list");
  const tickSVG = `<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19.7851 6.67391L8.7851 17.6739C8.72125 17.7378 8.64542 17.7885 8.56196 17.8231C8.4785 17.8577 8.38904 17.8755 8.29869 17.8755C8.20834 17.8755 8.11888 17.8577 8.03542 17.8231C7.95196 17.7885 7.87614 17.7378 7.81229 17.6739L2.99979 12.8614C2.87078 12.7324 2.79831 12.5574 2.79831 12.375C2.79831 12.1926 2.87078 12.0176 2.99979 11.8886C3.12879 11.7596 3.30375 11.6871 3.48619 11.6871C3.66863 11.6871 3.84359 11.7596 3.9726 11.8886L8.29869 16.2155L18.8123 5.70109C18.9413 5.57209 19.1163 5.49962 19.2987 5.49962C19.4811 5.49962 19.6561 5.57209 19.7851 5.70109C19.9141 5.8301 19.9866 6.00506 19.9866 6.1875C19.9866 6.36994 19.9141 6.5449 19.7851 6.67391Z"
                  fill="#9E78CF" />
              </svg>
`;

  const deleteSVG = `
     <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path
              d="M18.6112 4.125H3.48621C3.30387 4.125 3.129 4.19743 3.00007 4.32636C2.87114 4.4553 2.79871 4.63016 2.79871 4.8125C2.79871 4.99484 2.87114 5.1697 3.00007 5.29864C3.129 5.42757 3.30387 5.5 3.48621 5.5H4.17371V17.875C4.17371 18.2397 4.31857 18.5894 4.57643 18.8473C4.8343 19.1051 5.18403 19.25 5.54871 19.25H16.5487C16.9134 19.25 17.2631 19.1051 17.521 18.8473C17.7788 18.5894 17.9237 18.2397 17.9237 17.875V5.5H18.6112C18.7935 5.5 18.9684 5.42757 19.0973 5.29864C19.2263 5.1697 19.2987 4.99484 19.2987 4.8125C19.2987 4.63016 19.2263 4.4553 19.0973 4.32636C18.9684 4.19743 18.7935 4.125 18.6112 4.125ZM16.5487 17.875H5.54871V5.5H16.5487V17.875ZM6.92371 2.0625C6.92371 1.88016 6.99614 1.7053 7.12507 1.57636C7.254 1.44743 7.42887 1.375 7.61121 1.375H14.4862C14.6685 1.375 14.8434 1.44743 14.9723 1.57636C15.1013 1.7053 15.1737 1.88016 15.1737 2.0625C15.1737 2.24484 15.1013 2.4197 14.9723 2.54864C14.8434 2.67757 14.6685 2.75 14.4862 2.75H7.61121C7.42887 2.75 7.254 2.67757 7.12507 2.54864C6.99614 2.4197 6.92371 2.24484 6.92371 2.0625Z"
            fill="#9E78CF" />
     </svg>
  `;

  todoHeader[0].innerText += " - " + getUnfinishedTasksCount();
  doneTodoHeader[0].innerText += " - " + getFinishedTasksCount();

  if (todoItemsCount > 0) {
    for (let i = 0; i < todoItemsCount; i++) {
      try {
        const todoItem = document.createElement("li");
        const todoParagraph = document.createElement("p");
        const key = window.localStorage.key(i);
        const item = JSON.parse(window.localStorage.getItem(key));

        if (!item.done) {
          todoParagraph.innerText = item.textValue;
          todoItem.appendChild(todoParagraph);
          todoList[0].appendChild(todoItem);

          const buttonsDiv = document.createElement("div");
          const tickBtn = document.createElement("button");
          const deleteBtn = document.createElement("button");
          tickBtn.innerHTML = tickSVG;
          deleteBtn.innerHTML = deleteSVG;
          buttonsDiv.appendChild(tickBtn);
          buttonsDiv.appendChild(deleteBtn);
          todoItem.appendChild(buttonsDiv);

          tickBtn.addEventListener("click", (e) => {
            e.preventDefault();
            item.done = true;
            window.localStorage.setItem(key, JSON.stringify(item));
            todoList[0].removeChild(todoItem);

            todoItem.removeChild(buttonsDiv);
            doneTodoList[0].appendChild(todoItem);

            todoHeader[0].innerText =
              "Tasks to do - " + getUnfinishedTasksCount();
            doneTodoHeader[0].innerText = "Done - " + getFinishedTasksCount();
          });

          deleteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.localStorage.removeItem(key);
            todoList[0].removeChild(todoItem);
            todoHeader[0].innerText =
              "Tasks to do - " + getUnfinishedTasksCount();
          });
        } else {
          todoParagraph.innerText = item.textValue;
          todoItem.appendChild(todoParagraph);
          doneTodoList[0].appendChild(todoItem);
        }
      } catch {
        console.log("An error has occurred parsing an item from local storage");
      }
    }
  }

  const todoSubmitBtn = document.getElementById("new-task-form");
  todoSubmitBtn.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = document.getElementById("new-task");
    window.localStorage.setItem(
      newTask.value,
      JSON.stringify({ textValue: newTask.value, done: false }),
    );

    todoHeader[0].innerText = "Tasks to do - " + getUnfinishedTasksCount();

    const todoItem = document.createElement("li");
    const todoParagraph = document.createElement("p");
    const buttonsDiv = document.createElement("div");
    const tickBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    tickBtn.innerHTML = tickSVG;
    deleteBtn.innerHTML = deleteSVG;
    buttonsDiv.appendChild(tickBtn);
    buttonsDiv.appendChild(deleteBtn);

    tickBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const item = JSON.parse(window.localStorage.getItem(todoItem.innerText));

      item.done = true;
      window.localStorage.setItem(todoItem.innerText, JSON.stringify(item));
      todoList[0].removeChild(todoItem);

      todoItem.removeChild(buttonsDiv);
      doneTodoList[0].appendChild(todoItem);

      todoHeader[0].innerText = "Tasks to do - " + getUnfinishedTasksCount();
      doneTodoHeader[0].innerText = "Done - " + getFinishedTasksCount();
    });

    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.localStorage.removeItem(todoItem.innerText);
      todoList[0].removeChild(todoItem);
      todoHeader[0].innerText = "Tasks to do - " + getUnfinishedTasksCount();
    });

    todoParagraph.innerText = newTask.value;
    todoItem.appendChild(todoParagraph);
    todoItem.appendChild(buttonsDiv);
    todoList[0].appendChild(todoItem);
    newTask.value = "";
  });
} else {
  alert("Couldn't access local storage");
}
