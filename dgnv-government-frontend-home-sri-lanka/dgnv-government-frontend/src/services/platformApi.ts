import api from "../api/axios";
import type {
  CitizenProfile,
  DashboardSummary,
  DisasterRequest,
  OfficerProfile,
} from "../types/platform";

export const getDashboardSummary = async () => {
  const response = await api.get<DashboardSummary>("/requests/dashboard-summary");
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get<DisasterRequest[]>("/requests");
  return response.data;
};

export const getRequest = async (id: string | number) => {
  const response = await api.get<DisasterRequest>(`/requests/${id}`);
  return response.data;
};

export const createRequest = async (request: Partial<DisasterRequest>) => {
  const response = await api.post<DisasterRequest>("/requests", request);
  return response.data;
};

export const reviewRequest = async (
  id: string | number,
  review: { category: string; priority: string; officerNote: string }
) => {
  const response = await api.post<DisasterRequest>(
    `/requests/${id}/review`,
    review
  );
  return response.data;
};

export const approveRequest = async (id: string | number) => {
  const response = await api.post<DisasterRequest>(`/requests/${id}/approve`);
  return response.data;
};

export const rejectRequest = async (id: string | number) => {
  const response = await api.post<DisasterRequest>(`/requests/${id}/reject`);
  return response.data;
};

export const sendRequestToNgo = async (id: string | number) => {
  const response = await api.post<DisasterRequest>(`/requests/${id}/ngo`);
  return response.data;
};

export const getRequestsByCitizen = async (citizenId: number) => {
  const response = await api.get<DisasterRequest[]>(
    `/requests/citizen/${citizenId}`
  );
  return response.data;
};

export const getRequestsByOfficer = async (officerUserId: number) => {
  const response = await api.get<DisasterRequest[]>(
    `/requests/officer/${officerUserId}`
  );
  return response.data;
};

export const getOfficers = async () => {
  const response = await api.get<OfficerProfile[]>("/officers");
  return response.data;
};

export const updateOfficer = async (
  officerId: number,
  officer: Partial<OfficerProfile>
) => {
  const response = await api.put<OfficerProfile>(`/officers/${officerId}`, officer);
  return response.data;
};

export const disableOfficer = async (officerId: number) => {
  const response = await api.delete<string>(`/officers/${officerId}`);
  return response.data;
};

export const getCitizens = async () => {
  const response = await api.get<CitizenProfile[]>("/citizens");
  return response.data;
};

export const getCitizenByUserId = async (userId: number) => {
  const response = await api.get<CitizenProfile>(`/citizens/user/${userId}`);
  return response.data;
};

export const updateCitizen = async (
  citizenId: number,
  citizen: Partial<CitizenProfile>
) => {
  const response = await api.put<CitizenProfile>(`/citizens/${citizenId}`, citizen);
  return response.data;
};

export const registerOfficer = async (payload: {
  fullName: string;
  email: string;
  password: string;
  nicNumber: string;
  district: string;
  dsDivision: string;
  gsDivision: string;
}) => {
  const response = await api.post<string>("/auth/admin/register-officer", payload);
  return response.data;
};


export const claimRequest = async (requestId: string | number, officerId: number) => {
  const response = await api.post<DisasterRequest>(`/requests/${requestId}/claim/${officerId}`);
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await api.get<DisasterRequest[]>("/requests/pending");
  return response.data;
};

export const getPendingCount = async () => {
  const response = await api.get<number>("/requests/stats/pending");
  return response.data;
};

export const getClaimedCount = async () => {
  const response = await api.get<number>("/requests/stats/claimed");
  return response.data;
};

export const getApprovedCount = async () => {
  const response = await api.get<number>("/requests/stats/approved");
  return response.data;
};

export const getRejectedCount = async () => {
  const response = await api.get<number>("/requests/stats/rejected");
  return response.data;
};

export const getNgoCount = async () => {
  const response = await api.get<number>("/requests/stats/ngo");
  return response.data;
};

export const getRequestCategories = async () => {
  const response = await api.get<string[]>("/requests/categories");
  return response.data;
};

export const getRequestPriorities = async () => {
  const response = await api.get<string[]>("/requests/priorities");
  return response.data;
};

export type RequestHistory = {
  id: number;
  requestId: number;
  officerId?: number;
  action: string;
  createdAt?: string;
};

export const getRequestHistory = async (requestId: string | number) => {
  const response = await api.get<RequestHistory[]>(`/requests/${requestId}/history`);
  return response.data;
};

export const getOfficerById = async (officerId: number) => {
  const response = await api.get<OfficerProfile>(`/officers/${officerId}`);
  return response.data;
};

export const searchMatchingOfficers = async (params: {
  district: string;
  dsDivision: string;
  gsDivision: string;
}) => {
  const response = await api.get<OfficerProfile[]>("/officers/search", { params });
  return response.data;
};

export const createOfficer = async (officer: Partial<OfficerProfile>) => {
  const response = await api.post<OfficerProfile>("/officers", officer);
  return response.data;
};

export const getCitizenById = async (citizenId: number) => {
  const response = await api.get<CitizenProfile>(`/citizens/${citizenId}`);
  return response.data;
};

export const createCitizen = async (citizen: Partial<CitizenProfile>) => {
  const response = await api.post<CitizenProfile>("/citizens", citizen);
  return response.data;
};

export const disableCitizen = async (citizenId: number) => {
  const response = await api.delete<string>(`/citizens/${citizenId}`);
  return response.data;
};
