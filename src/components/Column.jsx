import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import "./Column.css";

const Column = ({ name, onRename, onDelete }) => {
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
    //To DO - Work on Draggables and Droppables

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
              <div className="dots" >
                . . .
              </div>
              {isMenuOpen && (
                <ul className="menu-options">
                  <li onClick={() => setIsEditing(true)}>Rename</li>
                  <li onClick={onDelete}>Delete</li>
                </ul>
              )}
            </div>
          </>
        )}
      </div>
      <hr />
      <div className="column-content">
        {/* Render cards or other content for the column */}
      </div>
    </div>
  );
};

export default Column;
