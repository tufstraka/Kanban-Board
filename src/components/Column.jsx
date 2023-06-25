import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";
import "./Column.css";

const Column = ({
  name,
  onRename,
  onDelete,
  tasks,
  id,
  newTaskContent,
  setNewTaskContent,
  addTask,
  clearAllTasks,
  onMouseEnter
}) => {
  const [newName, setNewName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRename = () => {
    if (newName.trim() !== "") {
      onRename(newName);
      setIsEditing(false);
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="column-input"
            />
            <button className="save-button" onClick={handleRename}>
              Save
            </button>
          </>
        ) : (
          <>
            <h2>{name}</h2>
            <div className="column-menu" onClick={handleMenuToggle}>
              <div className="dots">. . .</div>
              {isMenuOpen && (
                <ul className="menu-options">
                  <li onClick={() => setIsEditing(true)}>Rename</li>
                  <li onClick={clearAllTasks}>Clear</li>
                  <li onClick={onDelete}>Delete</li>
                </ul>
              )}
            </div>
          </>
        )}
      </div>
      <hr />
      <div className="column-content">
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={snapshot.isDraggingOver ? "dragging-over" : ""}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <hr />
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter task content"
          className="add-card-input"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          onMouseEnter={onMouseEnter}
        />
        <div className="add-task-buttons">
          <button
            className="add-task-cancel"
            onClick={() => setNewTaskContent("")}
          >
            Cancel
          </button>
          <button className="add-task-button" onClick={addTask}>
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default Column;
