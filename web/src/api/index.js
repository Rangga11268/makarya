import api from "./axiosInstance";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  registerMhs: (data) => api.post("/auth/register/mahasiswa", data),
  registerUmkm: (data) => api.post("/auth/register/umkm", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const projectApi = {
  create: (data) => api.post("/projects", data),
  browse: (params) => api.get("/projects", { params }),
  getDetail: (id) => api.get(`/projects/${id}`),
  getMyProjects: () => api.get("/projects/my-projects"),
};

export const proposalApi = {
  submit: (data) => api.post("/proposals", data),
  getMyProposals: () => api.get("/proposals/my"),
  getByProject: (projectId) => api.get(`/proposals/project/${projectId}`),
  accept: (id) => api.patch(`/proposals/${id}/accept`),
  reject: (id) => api.patch(`/proposals/${id}/reject`),
};

export const submissionApi = {
  submitWork: (data) => api.post("/submissions", data),
  getByProject: (projectId) => api.get(`/submissions/project/${projectId}`),
  approve: (id) => api.patch(`/submissions/${id}/approve`),
  requestRevision: (id, data) =>
    api.patch(`/submissions/${id}/request-revision`, data),
};

export const walletApi = {
  getMe: () => api.get("/wallet/me"),
  getHistory: () => api.get("/wallet/history"),
  requestTopUp: (data) => api.post("/wallet/topup", data),
  withdraw: (data) => api.post("/wallet/withdraw", data),
};

export const ratingApi = {
  giveRating: (data) => api.post("/ratings", data),
  getByUser: (userId) => api.get(`/ratings/user/${userId}`),
  getByProject: (projectId) => api.get(`/ratings/project/${projectId}`),
};

export const disputeApi = {
  fileDispute: (data) => api.post("/disputes", data),
  getAll: () => api.get("/disputes"),
  resolve: (id, data) => api.patch(`/disputes/${id}/resolve`, data),
};

export const chatApi = {
  getMessages: (projectId) => api.get(`/chat/project/${projectId}/messages`),
  sendMessage: (projectId, data) =>
    api.post(`/chat/project/${projectId}/messages`, data),
  markRead: (projectId) => api.patch(`/chat/project/${projectId}/read`),
};

export const getChatWsUrl = (projectId, token) => {
  const isHttps = window.location.protocol === "https:";
  const wsProto = isHttps ? "wss:" : "ws:";
  const host =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "localhost:8000"
      : window.location.host;
  return `${wsProto}//${host}/v1/chat/ws/project/${projectId}?token=${token}`;
};
