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
  getMyProjects: (params) => api.get("/projects/my", { params }),
  updateStatus: (id, data) => api.patch(`/projects/${id}/status`, data),
};

export const proposalApi = {
  getByProject: (projectId) => api.get(`/proposals/project/${projectId}`),
  getMyProposals: () => api.get("/proposals/my"),
  submit: (data) => api.post("/proposals", data),
  accept: (id) => api.post(`/proposals/${id}/accept`),
  reject: (id) => api.post(`/proposals/${id}/reject`),
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
    api.post(`/submissions/${submissionId}/request-revision`, data),
  approve: (submissionId) => api.post(`/submissions/${submissionId}/approve`),
};

export const ratingApi = {
  create: (data) => api.post("/ratings", data),
};
