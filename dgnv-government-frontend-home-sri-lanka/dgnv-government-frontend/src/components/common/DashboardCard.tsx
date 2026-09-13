import type { IconType } from "react-icons";

type DashboardCardProps = {
  title: string;
  value: number | string;
  icon: IconType;
  tone?: string;
};

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  tone = "primary",
}: DashboardCardProps) => (
  <div className="glass-card metric-card">
    <div className={`metric-icon text-bg-${tone}`}>
      <Icon />
    </div>
    <div>
      <p className="metric-label">{title}</p>
      <h3>{value}</h3>
    </div>
  </div>
);

export default DashboardCard;
