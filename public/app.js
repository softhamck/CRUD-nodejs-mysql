document.addEventListener("DOMContentLoaded", () => {
    const addTaskForm = document.getElementById("addTaskForm");
    const editTaskForm = document.getElementById("editTaskForm");
    const taskList = document.getElementById("taskList");
  
    // Evento para agregar una nueva tarea
    addTaskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
  
      // Hacer la solicitud POST al servidor para agregar la tarea
      const response = await fetch("/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
  
      const result = await response.json();
  
      // Recargar la lista de tareas después de agregar una nueva tarea
      fetchTasks();
  
      // Limpiar el formulario de agregar
      addTaskForm.reset();
    });
  
    // Función para obtener y mostrar todas las tareas
    const fetchTasks = async () => {
      const response = await fetch("/tasks");
      const tasks = await response.json();
  
      // Limpiar la lista antes de agregar tareas
      taskList.innerHTML = "";
  
      tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.classList.add("border", "p-2", "mb-2", "flex", "justify-between", "items-center");
  
        listItem.innerHTML = `
          <div>
            <h3 class="text-lg font-semibold">${task.title}</h3>
            <p class="text-gray-600">${task.description}</p>
          </div>
          <div>
            <button onclick="editTask(${task.id}, '${task.title}', '${task.description}')" class="bg-blue-500 text-white p-2 rounded">Editar</button>
            <button onclick="deleteTask(${task.id})" class="bg-red-500 text-white p-2 rounded">Eliminar</button>
          </div>
        `;
  
        taskList.appendChild(listItem);
      });
    };
  
    // Función para cargar los datos de una tarea en el formulario de edición
    window.editTask = (taskId, title, description) => {
      // Restablecer el formulario de edición
      editTaskForm.reset();
  
      document.getElementById("editTaskId").value = taskId;
      document.getElementById("editTitle").value = title;
      document.getElementById("editDescription").value = description;
  
      // Mostrar el formulario de edición y ocultar el formulario de agregar
      addTaskForm.style.display = "none";
      editTaskForm.style.display = "block";
    };
  
    // Evento para cancelar la edición y volver al formulario de agregar
    editTaskForm.addEventListener("reset", () => {
      addTaskForm.style.display = "block";
      editTaskForm.style.display = "none";
    });
  
    // Evento para editar una tarea
    editTaskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const taskId = document.getElementById("editTaskId").value;
      const title = document.getElementById("editTitle").value;
      const description = document.getElementById("editDescription").value;
  
      // Hacer la solicitud PUT al servidor para editar la tarea
      const response = await fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
  
      const result = await response.json();
  
      // Recargar la lista de tareas después de editar una tarea
      fetchTasks();
  
      // Limpiar el formulario de edición y volver al formulario de agregar
      editTaskForm.reset();
      addTaskForm.style.display = "block";
      editTaskForm.style.display = "none";
    });
  
    // Función para eliminar una tarea
    window.deleteTask = async (taskId) => {
      // Hacer la solicitud DELETE al servidor para eliminar la tarea
      const response = await fetch(`/tasks/${taskId}`, {
        method: "DELETE",
      });
  
      const result = await response.json();
  
      // Recargar la lista de tareas después de eliminar una tarea
      fetchTasks();
    };
  
    // Inicializar la lista de tareas al cargar la página
    fetchTasks();
  });
  