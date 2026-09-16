const STATUS_CLASS = {
  Pending: "badge-status-pending",
  "In Progress": "badge-status-progress",
  Completed: "badge-status-completed",
};

const PRIORITY_CLASS = {
  Low: "badge-priority-low",
  Medium: "badge-priority-medium",
  High: "badge-priority-high",
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "Completed") return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
};

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const dueLabel = formatDate(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-badges">
          <span className={`badge ${STATUS_CLASS[task.status]}`}>{task.status}</span>
          <span className={`badge ${PRIORITY_CLASS[task.priority]}`}>{task.priority}</span>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        {dueLabel && (
          <span className={`task-due ${overdue ? "task-due-overdue" : ""}`}>
            Due {dueLabel} {overdue && "(overdue)"}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button
          className="btn btn-sm btn-outline"
          onClick={() => onToggleComplete(task)}
          title={task.status === "Completed" ? "Mark as pending" : "Mark as completed"}
        >
          {task.status === "Completed" ? "Undo" : "Complete"}
        </button>
        <button className="btn btn-sm btn-ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
