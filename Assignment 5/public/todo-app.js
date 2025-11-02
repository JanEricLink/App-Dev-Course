document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("dynamic-list");
    const input = document.getElementById("new-item");
    const addBtn = document.getElementById("add-btn");

    addBtn.addEventListener("click", () => {
        const value = input.value.trim();
        if (!value) return;

        // Neues Listenelement erstellen
        const li = document.createElement("li");
        li.textContent = value;

        // Entfernen-Button hinzufügen
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.addEventListener("click", () => li.remove());

        li.appendChild(removeBtn);
        list.appendChild(li);

        input.value = "";
    });
});