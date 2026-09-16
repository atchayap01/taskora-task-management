import { ListIcon, ClockIcon, ProgressIcon, CheckCircleIcon, FlameIcon } from "./icons";

const StatCard = ({ label, value, accent, icon }) => (
  <div className={`stat-card stat-card-${accent}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-text">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

// `tasks` here should always be the FULL list of the user's tasks (not the
// filtered/displayed list), so these counts stay stable while the user
// searches or filters the task grid below.
const StatsBar = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const highPriority = tasks.filter((t) => t.priority === "High").length;

  return (
    <div className="stats-bar">
      <StatCard label="Total Tasks" value={total} accent="total" icon={<ListIcon />} />
      <StatCard label="Pending" value={pending} accent="pending" icon={<ClockIcon />} />
      <StatCard label="In Progress" value={inProgress} accent="progress" icon={<ProgressIcon />} />
      <StatCard label="Completed" value={completed} accent="completed" icon={<CheckCircleIcon />} />
      <StatCard label="High Priority" value={highPriority} accent="high" icon={<FlameIcon />} />
    </div>
  );
};

export default StatsBar;
