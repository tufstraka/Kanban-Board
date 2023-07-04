import { Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import "./Task.css";

const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task ${snapshot.isDragging ? "dragging" : ""}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
    
          {task.content}
          
        </div>
      )}
    </Draggable>
  );
};

Task.propTypes = {
  task: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default Task;
