import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Column from "./Column";

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({
    "column-1": [
      { id: "task-1", content: "Task 1" },
      { id: "task-2", content: "Task 2" },
      { id: "task-3", content: "Task 3" },
    ],
    "column-2": [
      { id: "task-4", content: "Task 4" },
      { id: "task-5", content: "Task 5" },
      { id: "task-6", content: "Task 6" },
    ],
    "column-3": [
      { id: "task-7", content: "Task 7" },
      { id: "task-8", content: "Task 8" },
      { id: "task-9", content: "Task 9" },
    ],
    "column-4": [
      { id: "task-10", content: "Task 10" },
      { id: "task-11", content: "Task 11" },
      { id: "task-12", content: "Task 12" },
    ],
    "column-5": [
      { id: "task-13", content: "Task 13" },
      { id: "task-14", content: "Task 14" },
      { id: "task-15", content: "Task 15" },
    ],
  });
  const [showAddCard, setShowAddCard] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [activeColumn, setActiveColumn] = useState(null);
  const [newTaskContent, setNewTaskContent] = useState("");

  // Get saved columns from local storage

  useEffect(() => {
    const columnsJson = localStorage.getItem("columns");
    if (columnsJson) {
      const savedColumns = JSON.parse(columnsJson);
      setColumns(savedColumns);
      setActiveColumn(`column-${columns.length}`);
    }

   
  }, [columns.length]);

  
  // Get saved tasks from local storage

  useEffect(() => {
    const savedTasksJson = localStorage.getItem("tasks");

    if (savedTasksJson) {
      const savedTasks = JSON.parse(savedTasksJson);
      setTasks(savedTasks);
    }
  }, []);

  // Set new task content when user is typing in input
  const setTaskContent = (content, columnIndex) => {
    if (activeColumn === `column-${columnIndex + 1}`) {
      setNewTaskContent(content);
    }
  };

  // Add new column

  const addColumn = () => {
    if (columns.length >= 5) {
      return alert("You can't add more than 5 columns");
    }

    setShowAddCard(true);
    setActiveColumn(`column-${columns.length + 1}`);
  };

  const clearAllTasks = () => {
    setTasks({
      "column-1": [],
      "column-2": [],
      "column-3": [],
      "column-4": [],
      "column-5": [],
    });
    localStorage.removeItem("tasks");
  };

  //clears Tasks for specific column

  const clearTasks = (index) => {
    const columnId = `column-${index + 1}`;
    const updatedTasks = { ...tasks };
    updatedTasks[columnId] = [];
  
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  

  // Add new task to column and save to local storage when user clicks add button 
  const addTask = () => {
    if (newTaskContent.trim() !== "" && activeColumn) {
      const newTaskId = uuidv4();
      const newTask = { id: newTaskId, content: newTaskContent };

      const updatedTasks = {
        ...tasks,
        [activeColumn]: [...tasks[activeColumn], newTask],
      };

      setTasks(updatedTasks);

      console.log(updatedTasks);

      setNewTaskContent("");
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
    else {
      alert("Please enter a task");
    }

  };

  // Add new column to columns array and save to local storage when user clicks add button

  const addNewColumn = () => {
    if (newColumnName.trim() !== "") {
      const updatedColumns = [...columns, newColumnName];
      setColumns(updatedColumns);
      const updatedColumnsJson = JSON.stringify(updatedColumns);
      localStorage.setItem("columns", updatedColumnsJson);
      setShowAddCard(false);
      setNewColumnName("");
    }
  };

  // Cancel adding new column

  const cancelAdd = () => {
    setShowAddCard(false);
    setNewColumnName("");
  };

  // Rename column and save to local storage

  const renameColumn = (index, newName) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = newName;
    setColumns(updatedColumns);

    const updatedColumnsJson = JSON.stringify(updatedColumns);
    localStorage.setItem("columns", updatedColumnsJson);
  };

  // Handle drag and drop of tasks
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;

    if (sourceColumnId !== destinationColumnId) {
      const sourceColumnTasks = [...tasks[sourceColumnId]];
      const destinationColumnTasks = [...tasks[destinationColumnId]];

      const [movedTask] = sourceColumnTasks.splice(source.index, 1);
      destinationColumnTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = {
        ...tasks,
        [sourceColumnId]: sourceColumnTasks,
        [destinationColumnId]: destinationColumnTasks,
      };

      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } else {
      const columnTasks = [...tasks[sourceColumnId]];

      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = {
        ...tasks,
        [sourceColumnId]: columnTasks,
      };

      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };

  const deleteColumn = (index) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);

    const updatedColumnsJson = JSON.stringify(updatedColumns);
    localStorage.setItem("columns", updatedColumnsJson);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app">
        <h1 className="app-heading">Kanban Board</h1>
        <hr />
        <div className="columns">
          {columns.map((column, index) => {
          const columnId = `column-${index + 1}`;

          return (  
            <Column
              key={columnId}
              tasks={tasks[columnId]}
              id={columnId}
              name={column}
              onRename={(newName) => renameColumn(index, newName)}
              onDelete={() => deleteColumn(index)}
              newTaskContent={activeColumn === columnId ? newTaskContent : ""}
              setNewTaskContent={(content) => setTaskContent(content, index)}
              addTask={addTask}
              clearTasks={() => clearTasks(index)}
              clearAllTasks={clearAllTasks}
              onMouseEnter={() => setActiveColumn(columnId)}
            />
          )
          })}
          {showAddCard && (
            <div className="add-card">
              <input
                type="text"
                placeholder="Enter column name"
                className="add-card-input"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <div className="add-buttons">
                <button className="add-card-input-cancel" onClick={cancelAdd}>
                  Cancel
                </button>
                <button className="add-card-input-button" onClick={addNewColumn}>
                  Add
                </button>
              </div>
            </div>
          )}
          {!showAddCard && columns.length < 5 && (
            <button className="add-column-button" onClick={addColumn}>
              Add Column
            </button>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
