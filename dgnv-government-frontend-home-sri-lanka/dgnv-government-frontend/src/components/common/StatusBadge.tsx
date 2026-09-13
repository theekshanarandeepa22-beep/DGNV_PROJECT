import { statusLabel, statusTone } from "../../utils/status";

type StatusBadgeProps = {
  status?: string;
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={`badge rounded-pill text-bg-${statusTone(status)}`}>
    {statusLabel(status)}
  </span>
);

export default StatusBadge;
