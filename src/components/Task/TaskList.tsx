import React, { useRef } from 'react';
import { useDrop } from 'react-dnd'; // FIX: DropTargetMonitor is no longer needed
import { XYCoord } from 'dnd-core';
import { useAppDispatch } from '../../store/hooks';
import { reorderTasks } from '../../store/slices/taskSlice';
import Task from './Task';
import { Task as TaskType } from '../../types';

interface TaskListProps {
  tasks: TaskType[];
  columnId: string;
}

const ItemTypes = {
  TASK: 'task',
};

interface DragItem {
  id: string;
  sourceColumnId: string;
  index: number;
}

// FIX: Define types for useDrop generics
interface CollectedProps {
  isOver: boolean;
}
interface DropResult {
  destColumnId: string;
  destIndex: number;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, columnId }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  // FIX: Provide the generic types to useDrop
  const [{ isOver }, drop] = useDrop<DragItem, DropResult, CollectedProps>({
    accept: ItemTypes.TASK,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
    }),
    // The `drop` function now returns data that the Task's `end` function will use.
    drop: (_item: DragItem, monitor) => { // FIX: Prefix unused 'item' with an underscore
      const hoverIndex = tasks.findIndex(t => {
          const clientOffset = monitor.getClientOffset();
          const taskNode = document.getElementById(t.id);
          if (!taskNode || !clientOffset) return false;
          const hoverBoundingRect = taskNode.getBoundingClientRect();
          return clientOffset.y < hoverBoundingRect.bottom;
      });

      return {
        destColumnId: columnId,
        destIndex: hoverIndex === -1 ? tasks.length : hoverIndex,
      };
    },
    // Hover is used for optimistic updates
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const sourceColumnId = item.sourceColumnId;

      let hoverIndex = tasks.length;
      for (let i = 0; i < tasks.length; i++) {
          const taskNode = document.getElementById(tasks[i].id);
          if (taskNode) {
              const hoverBoundingRect = taskNode.getBoundingClientRect();
              const clientOffset = monitor.getClientOffset() as XYCoord;
              if (clientOffset.y < hoverBoundingRect.bottom) {
                  hoverIndex = i;
                  break;
              }
          }
      }

      if (item.id === tasks[hoverIndex]?.id) return;
      if (sourceColumnId === columnId && dragIndex === hoverIndex) return;

      dispatch(reorderTasks({
          taskId: item.id,
          sourceColumnId: sourceColumnId,
          destColumnId: columnId,
          destIndex: hoverIndex,
      }));

      item.index = hoverIndex;
      item.sourceColumnId = columnId;
    },
  });

  drop(ref);

  return (
    <div ref={ref} className={`flex-grow min-h-[100px] p-1 transition-colors ${isOver ? 'bg-blue-100' : ''}`}>
      {tasks.map((task, index) => (
        <div id={task.id} key={task.id}>
            <Task task={task} index={index} columnId={columnId} />
        </div>
      ))}
      {tasks.length === 0 && isOver && (
        <div className="h-16 bg-gray-200 rounded-md border-2 border-dashed border-gray-400 m-2"></div>
      )}
    </div>
  );
};

export default TaskList;