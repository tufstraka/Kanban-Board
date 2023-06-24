import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
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

  useEffect(() => {
    const columnsJson = localStorage.getItem("columns");
    if (columnsJson) {
      const savedColumns = JSON.parse(columnsJson);
      setColumns(savedColumns);
    }
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
  
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  

  const addColumn = () => {
    if (columns.length >= 5) {
      return alert("You can't add more than 5 columns");
    }

    setShowAddCard(true);
  };

  const saveColumn = () => {
    if (newColumnName.trim() !== "") {
      const updatedColumns = [...columns, newColumnName];
      setColumns(updatedColumns);
      const updatedColumnsJson = JSON.stringify(updatedColumns);
      localStorage.setItem("columns", updatedColumnsJson);
      setShowAddCard(false);
      setNewColumnName("");
    }
  };

  const cancelAdd = () => { 
    setShowAddCard(false);
    setNewColumnName("");
  };

  const renameColumn = (index, newName) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = newName;
    setColumns(updatedColumns);

    //Update on Local Storage
    const updatedColumnsJson = JSON.stringify(updatedColumns);
    localStorage.setItem("columns", updatedColumnsJson);
  };

  const handleDragEnd = (result) => {
    const { destination, source} = result;
  
    if (!destination) return;
  
    const sourceColumnId = source.droppableId;
    const destinationColumnId = destination.droppableId;
  
    // Check if the task is dropped in a different column
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
      saveTasksToLocalStorage(updatedTasks);
    } else {
      // Rearrange tasks within the same column
      const columnTasks = [...tasks[sourceColumnId]];
  
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);
  
      const updatedTasks = {
        ...tasks,
        [sourceColumnId]: columnTasks,
      };
  
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
    }
  };
  
  const saveTasksToLocalStorage = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };
  
  


  const deleteColumn = (index) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);

    //Update on Local Storage
    const updatedColumnsJson = JSON.stringify(updatedColumns);
    localStorage.setItem("columns", updatedColumnsJson);
  };

  

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app">
        <h1 className="app-heading">Kanban Board</h1>

        <div className="columns">
          {columns.map((column, index) => (
            <Column
              key={index}
              tasks={tasks[`column-${index + 1}`]}
              id={`column-${index + 1}`}
              name={column}
              onRename={(newName) => renameColumn(index, newName)}
              onDelete={() => deleteColumn(index)}
            />
          ))}
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

              <button className="add-card-input-button" onClick={saveColumn}>
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
