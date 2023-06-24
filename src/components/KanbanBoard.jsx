import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const columnsJson = localStorage.getItem("columns");
    if (columnsJson) {
      const savedColumns = JSON.parse(columnsJson);
      setColumns(savedColumns);
    }
  }, []);

  const addColumn = () => {
    if (columns.length >= 5) {
      return alert("You can't add more than 5 columns");
    }

    const columnName = prompt("Enter column name");
    if (columnName && columnName.trim() !== "") {
      const updatedColumns = [...columns, columnName];
      setColumns(updatedColumns);

      //Update on Local Storage
      const updatedColumnsJson = JSON.stringify(updatedColumns);
      localStorage.setItem("columns", updatedColumnsJson);
    }
  };

  const renameColumn = (index, newName) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = newName;
    setColumns(updatedColumns);

    //Update on Local Storage
    const updatedColumnsJson = JSON.stringify(updatedColumns);
    localStorage.setItem("columns", updatedColumnsJson);
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
    <DragDropContext>
      <div className="app">
        <h1 className="app-heading">Kanban Board</h1>

        <div className="columns">
          {columns.map((column, index) => (
            <Column
              key={index}
              name={column}
              onRename={(newName) => renameColumn(index, newName)}
              onDelete={() => deleteColumn(index)}
            />
          ))}
          {columns.length < 5 && (
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
