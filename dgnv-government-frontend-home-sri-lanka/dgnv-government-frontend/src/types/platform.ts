export type Role = "ADMIN" | "OFFICER" | "CITIZEN";

export type RequestStatus =
  | "PENDING"
  | "CLAIMED"
  | "APPROVED"
  | "REJECTED"
  | "SENT_TO_NGO"
  | "COMPLETED";

export type DisasterRequest = {
  id: number;
  citizenId?: number;
  title: string;
  description?: string;
  contactNumber?: string;
  whatsappNumber?: string;
  category?: string;
  district?: string;
  dsDivision?: string;
  gsDivision?: string;
  status?: RequestStatus | string;
  claimedByOfficerId?: number;
  createdAt?: string;
  priority?: string;
  officerNote?: string;
};

export type OfficerProfile = {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  nicNumber: string;
  district: string;
  dsDivision: string;
  gsDivision: string;
  active: boolean;
};

export type CitizenProfile = {
  id: number;
  userId: number;
  fullName?: string;
  email?: string;
  district?: string;
  dsDivision?: string;
  gsDivision?: string;
  active: boolean;
};

export type DashboardSummary = {
  totalRequests: number;
  pending: number;
  claimed: number;
  approved: number;
  rejected: number;
  sentToNgo: number;
};
