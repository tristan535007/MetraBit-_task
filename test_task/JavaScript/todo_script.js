const toDoBox = document.querySelector(".content_box"); //main ToDo container
const counterArr = document.querySelectorAll(".counterBar"); //get entire counter bar
// var for edit
let tagIdP,
  newText,
  prevText = "";

//var for empty list
const li = document.createElement("li");
li.setAttribute("id", "emptyList");
li.innerHTML = "<h2>Create your first To Do.</h2>";
//---------------counter var
let amountToDoLists = 0; // make dinamic counter
let active = localStorage.length; // dinamic counter
let successful = 0; // dinamic counter
let idMarker = "id_item_";
//localStorage func
function getStorageValues() {
  for (const toDo of Object.values(localStorage)) {
    const tagP = document.createElement("p");
    const { id, myToDo, time } = JSON.parse(toDo); // get localStorage data and destruct it
    getDomTodoTags(tagP, toDoBox, myToDo, time, id);
  }
}

function getDomTodoTags(tag, parent, text = "", time, storageId) {
  let checked = true; //closure variable for check box
  let editChecked = true;
  // create new DOM elements
  const checkBox = document.createElement("input");
  const divHeaderListItem = document.createElement("div");
  const spanCurrTime = document.createElement("span");
  const buttonDelete = document.createElement("button");
  const editButton = document.createElement("button");
  const wrapper = document.createElement("div");
  const wrapper_2 = document.createElement("div");
  const toDoItem = document.createElement("li");
  const imgDelete = document.createElement("img");
  const imgEdit = document.createElement("img");

  divHeaderListItem.classList.add("list_header");
  wrapper.classList.add("wrapper");
  wrapper_2.classList.add("wrapper_2");
  toDoItem.classList.add("toDoItem");

  //Add to DOM
  //check box + data + button delete
  wrapper.append(checkBox);
  spanCurrTime.append(time);
  wrapper.append(spanCurrTime);
  buttonDelete.append(imgDelete);
  editButton.append(imgEdit);
  divHeaderListItem.append(wrapper);

  wrapper_2.append(editButton);
  wrapper_2.append(buttonDelete);

  divHeaderListItem.append(wrapper_2);
  //-------
  toDoItem.append(divHeaderListItem);
  if (tag.tagName === "p".toLocaleUpperCase()) {
    tag.innerText = text;
    storageId && tag.setAttribute("id", storageId);
  }
  toDoItem.append(tag);
  parent.append(toDoItem);

  //set atr into new elements
  imgDelete.setAttribute("src", "img/delete.png");
  imgEdit.setAttribute("src", "img/edit.png");
  checkBox.setAttribute("type", "checkbox");
  if (tag.tagName === "textarea".toLocaleUpperCase()) {
    tag.setAttribute("name", "comment");
    //add autofocus after creating todo item
    document.querySelector("textarea").focus();
    //hide check box and delete button
    checkBox.style.display = "none";
    wrapper_2.style.display = "none";
  }
  // event func
  checkBox.onclick = () => {
    if (checked) {
      tag.style.textDecoration = "line-through";
      successful += 1;
      active === 0 ? null : (active -= 1);
      active
        ? (counterArr[1].innerText = active)
        : (counterArr[1].innerText = 0);
    } else {
      tag.style.textDecoration = "";
      successful -= 1;
      active += 1;
      counterArr[1].innerText = active;
    }
    checked = !checked;
    counterArr[2].innerText = successful;
  };
  buttonDelete.onclick = () => {
    toDoItem.remove(); //delete from DOM
    //  {block if} for delete key from localStorage
    if (localStorage.length > 0) {
      for (const key of Object.keys(localStorage)) {
        const { myToDo } = JSON.parse(localStorage[key]);
        if (myToDo === tag.innerText) {
          localStorage.removeItem(key);
          break; //close cicle if we have a match
        }
      }
    }
    //counters logic
    active === 0 || !checked ? null : (active -= 1);
    amountToDoLists -= 1;
    checked ? null : (successful -= 1);
    active = counterArr[1].innerText = active;
    amountToDoLists
      ? (counterArr[0].innerText = amountToDoLists)
      : (counterArr[0].innerText = 0);
    successful
      ? (counterArr[2].innerText = successful)
      : (counterArr[2].innerText = 0);

    //show that user dose not have any to do
    if (localStorage.length === 0) {
      toDoBox.append(li);
    }
    //enable addNewToDo
    addNewToDo.disabled = false;
    //when we use delete when edit to do show another functionality
    const headerList_Arr = document.getElementsByClassName("toDoItem"); // when edit to do => visibility  another functionality
    Object.values(headerList_Arr).forEach(
      (el) => (el.children[0].lastChild.style.visibility = "visible")
    );
  };
  editButton.onclick = () => {
    const tempTextArea = document.createElement("textarea");
    const tempP = document.createElement("p");

    addNewToDo.disabled = true;

    editChecked
      ? imgEdit.setAttribute("src", "img/onEdit.png")
      : imgEdit.setAttribute("src", "img/edit.png");

    if (editChecked) {
      const headerList_Arr = document.getElementsByClassName("toDoItem"); // when edit to do => hidden another functionality
      prevText = toDoItem.children[1].innerText;
      tagIdP = toDoItem.children[1].getAttribute("id"); //we need this id to localStorage key for rewrite (tagIdP - global var)
      Object.values(headerList_Arr).forEach((el) =>
        el.lastChild.getAttribute("id") === tagIdP
          ? null
          : (el.children[0].lastChild.style.visibility = "hidden")
      );
      toDoItem.children[1].remove();
      tempTextArea.value = prevText;
      toDoItem.append(tempTextArea);
      tempTextArea.select();
      tempTextArea.oninput = (e) => {
        newText = e.target.value;
      };
    }

    if (!editChecked) {
      const headerList_Arr = document.getElementsByClassName("toDoItem"); // when edit to do => visibility  another functionality
      Object.values(headerList_Arr).forEach(
        (el) => (el.children[0].lastChild.style.visibility = "visible")
      );
      toDoItem.remove(); //remove old To do
      //-----work with LS and create new To Do item
      const editedToDo = JSON.parse(localStorage[tagIdP]);
      editedToDo.myToDo = newText || prevText;
      localStorage[tagIdP] = JSON.stringify(editedToDo);
      //new to do item
      getDomTodoTags(
        tempP,
        toDoBox,
        newText || prevText,
        editedToDo.time,
        tagIdP
      );
      addNewToDo.disabled = false;
    }
    editChecked = !editChecked;
  };
}

//localStorage values starts if page refreshed
if (localStorage.length > 0 && performance.navigation.type === 1) {
  amountToDoLists = localStorage.length;
  // get active to do
  counterArr[0].innerText = amountToDoLists;
  counterArr[1].innerText = active;
  getStorageValues();
}

// func for adding a new list
addNewToDo.onclick = () => {
  const wrapper_Arr = document.getElementsByClassName("wrapper_2");
  const textToDoField = document.createElement("textarea");
  button_to_do.disabled = false; // take off disabled for button below
  //make hidden class wrapper_2
  Object.values(wrapper_Arr).forEach((el) => (el.style.visibility = "hidden"));

  if (document.getElementById("emptyList")) {
    emptyList.remove();
  }
  getDomTodoTags(
    textToDoField,
    toDoBox,
    "",
    new Date().toString().slice(4, 15)
  );
  //------

  //increase global variable amountToDoLists
  amountToDoLists += 1;
  counterArr[0].innerText = amountToDoLists;
  //button disabled
  addNewToDo.disabled = true;
  // wrapperStyle.style.visibility = "visible";
};
//------------apply note------------
button_to_do.onclick = () => {
  let index = 1;
  const wrapper_Arr = document.getElementsByClassName("wrapper_2");
  //make sort for avoid overwrite
  Object.keys(localStorage)
    .sort()
    .forEach((el) => (+el.slice(8) === index ? (index += 1) : null));
  //make visible class wrapper_2
  Object.values(wrapper_Arr).forEach((el) => (el.style.visibility = "visible"));
  const uniqueId = idMarker + index;
  const tagP = document.createElement("p");
  const toDoTextValue = document.querySelector("textarea");
  tagP.setAttribute("id", uniqueId);
  if (toDoTextValue) {
    //
    if (toDoTextValue.value === "") {
      toDoTextValue.value = "You did write nothing, please use edit";
    }
    // delete previous container and create new one with tag <p></p> inside
    toDoBox.children[toDoBox.children.length - 1].remove();
    getDomTodoTags(
      tagP,
      toDoBox,
      toDoTextValue.value,
      new Date().toString().slice(4, 15)
    );
    localStorage[uniqueId] = JSON.stringify({
      id: uniqueId,
      myToDo: tagP.innerText,
      time: new Date().toString().slice(4, 15),
    });
  }
  addNewToDo.disabled = false;
  button_to_do.disabled = true;
  //counter active
  active += 1;
  counterArr[1].innerText = active;
};
//check for exist any To Do or show text "No any to do"
if (localStorage.length === 0) {
  toDoBox.append(li);
}
