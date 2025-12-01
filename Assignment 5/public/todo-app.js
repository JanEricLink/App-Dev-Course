document.addEventListener("DOMContentLoaded", async () => {
//#region Overlays and Overlay Event Listeners
    // Wait for the Edit ToDo Overlay HTML to be fully loaded
    const editToDoContainer = document.getElementById('edit-ToDo-Overlay-Container');
    const ToDohtml = await (await fetch('/edit-ToDo-Overlay.html')).text();
    editToDoContainer.innerHTML = ToDohtml;
    // Wait for the Edit Group Overlay HTML to be fully loaded
    const editGroupContainer = document.getElementById('edit-Group-Overlay-Container');
    const Grouphtml = await (await fetch('/edit-Group-Overlay.html')).text();
    editGroupContainer.innerHTML = Grouphtml;



    // Fetch the todo items from the server
    const response = await fetch('/todo-items');
    console.log(response);
    const responsejson = await response.json();
    console.log(responsejson);

    // Populate the group selector with the fetched groups
    const groupSelector = document.getElementById('ToDo-Group-Input');
    for (const group of responsejson) {
        const groupSelectorOption = document.createElement('option');
        groupSelectorOption.textContent = group.name;
        groupSelectorOption.value = group.name;
        groupSelector.appendChild(groupSelectorOption);
    }



    // Now set up the event listeners for the ToDo overlay
    const ToDoOverlay = document.getElementById('edit-ToDo-Overlay');
    const AddToDoButton = document.getElementById('Add-ToDo-Button');
    const EditToDoButton = document.getElementById('Edit-ToDo-Button');
    const CancelToDoButton = document.getElementById('Cancel-Edit-ToDo-Button');
    const CreateToDoButton = document.getElementById('Create-Todo-Button');
    const ToDoOverlayTitle = document.getElementById('ToDo-Overlay-Title');

    ToDoOverlay.addEventListener('click', (e) => {
    if (e.target === ToDoOverlay) {
        ToDoOverlay.style.display = 'none';
    }
    });

    CancelToDoButton.addEventListener('click', () => {
        ToDoOverlay.style.display = 'none';
    });

    AddToDoButton.addEventListener('click', () => {
        ToDoOverlayTitle.textContent = "Add New To-Do Item";
        ToDoOverlay.style.display = 'flex';
    });

    if(EditToDoButton){
        EditToDoButton.addEventListener('click', () => {
            ToDoOverlayTitle.textContent = "Add New To-Do Item";
            ToDoOverlay.style.display = 'flex';
        });
    };

    CreateToDoButton.addEventListener('click', async () => {
        await fetch('/add-todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: document.getElementById('ToDo-Title-Input').value,
                description: document.getElementById('ToDo-Description-Input').value,
                group: document.getElementById('ToDo-Group-Input').value
            }
        )
        });
        ToDoOverlay.style.display = 'none';
        console.log("Todo created");
        console.log(document.getElementById('ToDo-Title-Input').value);
    });



    //Now set up the event listeners for the Group overlay
    const GroupOverlay = document.getElementById('edit-Group-Overlay');
    const AddGroupButton = document.getElementById('Add-Group-Button');
    const EditGroupButton = document.getElementById('Edit-Group-Button');
    const CancelGroupButton = document.getElementById('Cancel-Edit-Group-Button');
    const CreateGroupButton = document.getElementById('Create-Group-Button');
    const GroupOverlayTitle = document.getElementById('Group-Overlay-Title');

    GroupOverlay.addEventListener('click', (e) => {
    if (e.target === GroupOverlay) {
        GroupOverlay.style.display = 'none';
    }
    });

    CancelGroupButton.addEventListener('click', () => {
        GroupOverlay.style.display = 'none';
    });

    AddGroupButton.addEventListener('click', () => {
        GroupOverlayTitle.textContent = "Add New Group";
        GroupOverlay.style.display = 'flex';
    });
    if(EditGroupButton){
        EditGroupButton.addEventListener('click', () => {
            GroupOverlayTitle.textContent = "Edit Group";
            GroupOverlay.style.display = 'flex';
        });
    };

    CreateGroupButton.addEventListener('click', async () => {
        await fetch('/add-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('Group-Name-Input').value,
                description: document.getElementById('Group-Description-Input').value,
                color: document.getElementById('Group-Color-Input').value
            })
        });
        GroupOverlay.style.display = 'none';
    });
//#endregion

//#region ToDo List
    // Function to create and display todo items
    async function displayTodosAndGroups (){
        if (await fetch('/session-status').then(res => res.status === 200)) {
            await fetch('/todo-items')
            .then(response => response.json())
            todoItems = responsejson;

            const todoListContainer = document.getElementById('group-container');
            todoListContainer.innerHTML = '';

            displayGroups(todoItems, todoListContainer);
        }
    }

    function displayGroups(todoItems, todoListContainer) {
        todoItems.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'todo-group';
            groupDiv.id = `group-${group.name}`;

            const groupTitle = document.createElement('h2');
            groupTitle.className = 'group-title';
            groupTitle.textContent = group.name;
            groupDiv.appendChild(groupTitle);

            const groupUUID = document.createElement('span');
            groupUUID.className = 'group-uuid';
            groupUUID.textContent = group.uuid;
            groupTitle.appendChild(groupUUID);

            const groupButtonContainer = document.createElement('div');
            groupButtonContainer.className = 'group-button-container';
            groupTitle.appendChild(groupButtonContainer);

            const editGroupButton = document.createElement('button');
            editGroupButton.textContent = '✎';
            editGroupButton.className = 'Group-Edit-Button';
            groupButtonContainer.appendChild(editGroupButton);

            const deleteGroupButton = document.createElement('button');
            deleteGroupButton.textContent = '✘';
            deleteGroupButton.className = 'Group-Delete-Button';
            groupButtonContainer.appendChild(deleteGroupButton);

            todoListContainer.appendChild(groupDiv);

            displayTodos(group, groupDiv);
        });
    }

    function displayTodos(group, groupDiv) {
        group.todos.forEach(todo => {
            const todoDiv = document.createElement('div');
            todoDiv.className = 'todo-item';
            todoDiv.id = `todo-${todo.title}`;

            const todoCheckbox = document.createElement('input');
            todoCheckbox.type = 'checkbox';
            todoCheckbox.className = 'todo-checkbox';
            todoDiv.appendChild(todoCheckbox);

            const todoTextContainer = document.createElement('div');
            todoTextContainer.className = 'todo-text-container';
            todoDiv.appendChild(todoTextContainer);

            const todoTitle = document.createElement('h3');
            todoTitle.className = 'todo-title';
            todoTitle.textContent = todo.title;
            todoTextContainer.appendChild(todoTitle);

            const todoDescription = document.createElement('p');
            if (todo.description!=''){todoDescription.textContent = todo.description};
            todoTextContainer.appendChild(todoDescription);

            const todoUUID = document.createElement('span');
            todoUUID.className = 'todo-uuid';
            todoUUID.textContent = todo.uuid;
            todoTextContainer.appendChild(todoUUID);

            const todoButtonContainer = document.createElement('div');
            todoButtonContainer.className = 'todo-button-container';
            todoDiv.appendChild(todoButtonContainer);

            const editToDoButton = document.createElement('button');
            editToDoButton.textContent = "✎";
            editToDoButton.className = 'ToDo-Edit-Button';
            todoButtonContainer.appendChild(editToDoButton);

            const deleteToDoButton = document.createElement('button');
            deleteToDoButton.textContent = '✘';
            deleteToDoButton.className = 'ToDo-Delete-Button';
            todoButtonContainer.appendChild(deleteToDoButton);

            groupDiv.appendChild(todoDiv);
        });
    }

    displayTodosAndGroups();

    const GroupContainer = document.getElementById('group-container');
    GroupContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('ToDo-Edit-Button')) {
            const todoName = e.target.parentElement.parentElement.querySelector('.todo-uuid').textContent;
            console.log(`Clicked Edit Button for the ToDo with the UUID: ${todoName}`);
            // Here you can add code to open the edit overlay for the clicked To-Do item


        }
        if (e.target.classList.contains('Group-Edit-Button')) {
            const groupName = e.target.parentElement.parentElement.querySelector('.group-uuid').textContent;
            console.log(`Clicked Edit Button for the Group with the UUID: ${groupName}`);
            // Here you can add code to open the edit overlay for the clicked Group


        }
    });
//#endregion
});
