const statusLabels: Record<string, string> = {
  PENDING: "NEW",
  CLAIMED: "UNDER REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SENT_TO_NGO: "SENT TO NGO",
  COMPLETED: "COMPLETED",
};

export const statusLabel = (status?: string) =>
  status ? statusLabels[status] || status : "NOT SET";

export const statusTone = (status?: string) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    case "SENT_TO_NGO":
      return "info";
    case "COMPLETED":
      return "primary";
    case "CLAIMED":
      return "warning";
    default:
      return "secondary";
  }
};

export const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};
