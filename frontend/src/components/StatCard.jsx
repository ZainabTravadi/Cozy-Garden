function StatCard({ icon, label, value }) {
  return (
    <article className="stat-card">
      <img src={icon} alt="" />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export default StatCard;
