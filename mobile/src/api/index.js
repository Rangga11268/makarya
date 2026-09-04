import { Platform } from "react-native";
import Constants from "expo-constants";
import api from "./axiosInstance";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  registerUmkm: (data) => api.post("/auth/register/umkm", data),
  getMe: () => api.get("/auth/me"),
};

export const projectApi = {
  create: (data) => api.post("/projects", data),
  browse: (params) => api.get("/projects", { params }),
  getDetail: (id) => api.get(`/projects/${id}`),
  getMyProjects: (params) => api.get("/projects/my-projects", { params }),
  updateStatus: (id, data) => api.patch(`/projects/${id}/status`, data),
};

export const proposalApi = {
  getByProject: (projectId) => api.get(`/proposals/project/${projectId}`),
  getMyProposals: () => api.get("/proposals/my"),
  submit: (data) => api.post("/proposals", data),
  accept: (id) => api.patch(`/proposals/${id}/accept`),
  reject: (id) => api.patch(`/proposals/${id}/reject`),
};

export const walletApi = {
  getMe: () => api.get("/wallet/me"),
  getHistory: () => api.get("/wallet/history"),
  topUp: (nominal) => api.post("/wallet/topup", { nominal }),
  withdraw: (data) => api.post("/wallet/withdraw", data),
};

export const submissionApi = {
  submitWork: (data) => api.post("/submissions", data),
  getByProject: (projectId) => api.get(`/submissions/project/${projectId}`),
  requestRevision: (submissionId, data) =>
    api.patch(`/submissions/${submissionId}/request-revision`, data),
  approve: (submissionId) => api.patch(`/submissions/${submissionId}/approve`),
};

export const ratingApi = {
  create: (data) => api.post("/ratings", data),
};

export const chatApi = {
  getMessages: (projectId) => api.get(`/chat/project/${projectId}/messages`),
  sendMessage: (projectId, data) =>
    api.post(`/chat/project/${projectId}/messages`, data),
  markRead: (projectId) => api.patch(`/chat/project/${projectId}/read`),
};

export const getChatWsUrl = (projectId, token) => {
  let host = Platform.OS === "android" ? "10.0.2.2:8000" : "localhost:8000";
  const debuggerHost =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(":")[0];
    if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
      host = `${ip}:8000`;
    }
  }
  return `ws://${host}/v1/chat/ws/project/${projectId}?token=${token}`;
};
