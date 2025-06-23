import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Task as TaskType, Priority } from '../../types';
import PriorityBadge from '../UI/PriorityBadge';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import TaskForm from './TaskForm';
import { useAppDispatch } from '../../store/hooks';
import { deleteTaskAsync, moveTask } from '../../store/slices/taskSlice';

// Define the drag item type
interface DragItem {
  id: string;
  sourceColumnId: string;
  index: number;
}

// Define collected props for useDrag
interface DragCollectedProps {
  isDragging: boolean;
}

interface TaskProps {
  task: TaskType;
  index: number;
  columnId: string;
}

const ItemTypes = {
  TASK: 'task',
};

const Task: React.FC<TaskProps> = ({ task, index, columnId }) => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, DragCollectedProps>({
    type: ItemTypes.TASK,
    item: { id: task.id, sourceColumnId: columnId, index },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ destColumnId: string; destIndex: number }>();
      if (item && dropResult) {
        dispatch(
          moveTask({
            taskId: item.id,
            destColumnId: dropResult.destColumnId,
            destIndex: dropResult.destIndex,
          })
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  const handleDelete = () => {
    dispatch(deleteTaskAsync(task.id));
    setIsViewOpen(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <div
        ref={ref}
        style={{ opacity: isDragging ? 0.5 : 1 }}
        className={`bg-white p-3 mb-2 rounded shadow-sm border-l-4 ${
          task.priority === Priority.HIGH
            ? 'border-red-500'
            : task.priority === Priority.MEDIUM
            ? 'border-yellow-500'
            : 'border-green-500'
        } cursor-grab`}
        onClick={() => setIsViewOpen(true)}
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-gray-800">{task.title}</h4>
          <PriorityBadge priority={task.priority} />
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {task.description}
        </p>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>Due: {formatDate(task.dueDate)}</span>
          <span>
            {task.assignedTo ? `Assigned: ${task.assignedTo.name}` : 'Unassigned'}
          </span>
        </div>
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Task Details"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">{task.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <PriorityBadge priority={task.priority} />
              <span className="text-sm text-gray-500">
                Due: {formatDate(task.dueDate)}
              </span>
            </div>
          </div>

          <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Created By</p>
              <p>{task.createdBy.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assigned To</p>
              <p>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created On</p>
              <p>{formatDate(task.createdAt)}</p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
            <Button variant="primary" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Task Edit Modal */}
      {isEditOpen && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Task"
        >
          <TaskForm
            columnId={columnId}
            existingTask={task}
            onClose={() => {
              setIsEditOpen(false);
              setIsViewOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default Task;