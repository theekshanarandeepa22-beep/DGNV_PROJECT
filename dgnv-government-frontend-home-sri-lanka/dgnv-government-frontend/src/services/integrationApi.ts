import axios from "axios";

const integrationApi = axios.create({
  baseURL: "/integration-api",
  headers: {
    "Content-Type": "application/json",
  },
});

export type ForwardResult = {
  governmentRequestId: number;
  status: string;
  message: string;
  forwardedAt?: string;
};

export type RequestTracking = {
  id: number;
  governmentRequestId: number;
  ngoName?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  volunteerWhatsapp?: string;
  status: string;
  updatedAt?: string;
};

export type IntegrationLog = {
  id: number;
  requestId: number;
  sourceSystem: string;
  destinationSystem: string;
  status: string;
  message: string;
  action: string;
  createdAt?: string;
};

export const forwardRequestToNgo = async (governmentRequestId: string | number) => {
  const response = await integrationApi.post<ForwardResult>(
    `/api/integration/requests/${governmentRequestId}/forward-to-ngo`
  );
  return response.data;
};

export const getRequestTracking = async (governmentRequestId: string | number) => {
  const response = await integrationApi.get<RequestTracking>(
    `/api/integration/requests/${governmentRequestId}/tracking`
  );
  return response.data;
};

export const getIntegrationLogs = async (governmentRequestId: string | number) => {
  const response = await integrationApi.get<IntegrationLog[]>(
    `/api/integration/requests/${governmentRequestId}/logs`
  );
  return response.data;
};
