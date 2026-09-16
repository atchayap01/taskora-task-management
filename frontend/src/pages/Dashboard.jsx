import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import * as taskService from "../services/taskService";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import ConfirmDialog from "../components/ConfirmDialog";
import StatsBar from "../components/StatsBar";
import Logo from "../components/Logo";
import { SearchIcon } from "../components/icons";

const Dashboard = () => {
  const { user, logout } = useAuth();

  // `tasks` always holds ALL of the user's tasks, unfiltered. This is the
  // single source of truth for both the stats bar and the task grid, so
  // stats never change when the user searches or filters - only the grid
  // (via `filteredTasks` below) does. Search/filtering is done client-side
  // so we don't need a new API call on every keystroke or filter change.
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskPendingDelete, setTaskPendingDelete] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await taskService.getTasks(); // no filters - fetch everything once
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Derived, not stored - recomputed instantly from `tasks` whenever the
  // search term or filters change. Stats always read from `tasks` (full
  // list), never from this.
  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      if (statusFilter && task.status !== statusFilter) return false;
      if (priorityFilter && task.priority !== priorityFilter) return false;
      if (term) {
        const inTitle = task.title?.toLowerCase().includes(term);
        const inDescription = task.description?.toLowerCase().includes(term);
        if (!inTitle && !inDescription) return false;
      }
      return true;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (formData) => {
    if (editingTask) {
      const data = await taskService.updateTask(editingTask._id, formData);
      setTasks((prev) => prev.map((t) => (t._id === data.task._id ? data.task : t)));
    } else {
      const data = await taskService.createTask(formData);
      setTasks((prev) => [data.task, ...prev]);
    }
  };

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    try {
      const data = await taskService.updateTaskStatus(task._id, newStatus);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data.task : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRequestDelete = (task) => {
    setTaskPendingDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskPendingDelete) return;
    try {
      await taskService.deleteTask(taskPendingDelete._id);
      setTasks((prev) => prev.filter((t) => t._id !== taskPendingDelete._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskPendingDelete(null);
    }
  };

  const hasActiveFilters = searchTerm || statusFilter || priorityFilter;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <div className="brand">
            <Logo />
            <div className="brand-text">
              <span className="brand-name">Taskora</span>
              <span className="brand-tagline">Plan. Prioritize. Get things done.</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-menu">
  <div className="user-avatar">
    {user?.name?.charAt(0).toUpperCase()}
  </div>
  <span className="welcome-text">
    {user?.name?.split(" ")[0]}
  </span>
</div>
            <button className="btn btn-outline btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-hero">
  <div className="hero-content">
    <span className="hero-eyebrow">YOUR PRODUCTIVITY SPACE</span>

    <h1 className="page-title">
      Good evening, {user?.name?.split(" ")[0]} 👋
    </h1>

    <p className="page-subtitle">
      Here's what's happening with your tasks today.
    </p>
  </div>

  <button className="btn btn-primary btn-lg" onClick={handleOpenAddModal}>
    + Add Task
  </button>
</div>

        <StatsBar tasks={tasks} />
        <div className="tasks-heading">
  <div>
    <h2>Your Tasks</h2>
    <p>
      {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
    </p>
  </div>
</div>

        <div className="toolbar">
          <div className="search-field">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            {hasActiveFilters ? (
              <>
                <h3>No tasks match your filters</h3>
                <p>Try adjusting your search or filters.</p>
              </>
            ) : (
              <>
                <h3>No tasks yet. Create your first task!</h3>
                <button className="btn btn-primary" onClick={handleOpenAddModal}>
                  + Add Task
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="task-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={handleRequestDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        initialTask={editingTask}
      />

      <ConfirmDialog
        isOpen={Boolean(taskPendingDelete)}
        title="Delete this task?"
        message={`"${taskPendingDelete?.title}" will be permanently deleted. This can't be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskPendingDelete(null)}
      />
    </div>
  );
};

export default Dashboard;
