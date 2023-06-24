import { Draggable } from "react-beautiful-dnd";
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

export default Task;
