export interface Review {
  id: number;
  authorName: string;
  authorTitle?: string | null;
  content: string;
  rating: number;
  photoUrl?: string | null;
  createdAt: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  imageUrl?: string | null;
  publishedAt: string;
  createdAt: string;
}

export interface Achievement {
  id: number;
  title: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  year: number;
  category?: string | null;
  mainImageUrl?: string | null;
  additionalImages: string[];
  taggedPlayerIds: number[];
  createdAt: string;
}

export interface Player {
  id: number;
  name: string;
  district?: string | null;
  state?: string | null;
  districtRank?: string | null;
  stateRank?: string | null;
  nationalRank?: string | null;
  internationalRank?: string | null;
  photoUrl?: string | null;
  blade?: string | null;
  fhRubber?: string | null;
  bhRubber?: string | null;
  achievementIds: number[];
  createdAt: string;
}

export interface CommitteeMember {
  id: number;
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  order: number;
  createdAt: string;
}

function getToken(): string | null {
  try {
    return sessionStorage.getItem("jpotta_token");
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? data.message ?? `HTTP ${res.status}`);
  return data as T;
}

export const adminApi = {
  login: (username: string, password: string) =>
    request<{ success: boolean; message: string; token?: string }>(
      "/api/admin/login",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) }
    ),
  check: () =>
    request<{ authenticated: boolean }>("/api/admin/me", { headers: authHeaders() }),
  logout: async () => {
    await fetch("/api/admin/logout", { method: "POST", headers: authHeaders() }).catch(() => {});
    try { sessionStorage.removeItem("jpotta_token"); } catch {}
  },
  setToken: (token: string) => { try { sessionStorage.setItem("jpotta_token", token); } catch {} },
  isLoggedIn: () => { try { return !!sessionStorage.getItem("jpotta_token"); } catch { return false; } },
};

export const playersApi = {
  list: () => request<Player[]>("/api/players"),
  create: (data: Partial<Player>) =>
    request<Player>("/api/players", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Player>) =>
    request<Player>(`/api/players/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/api/players/${id}`, { method: "DELETE", headers: authHeaders() }),
};

export const newsApi = {
  list: () => request<NewsArticle[]>("/api/news"),
  create: (data: Partial<NewsArticle>) =>
    request<NewsArticle>("/api/news", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  update: (id: number, data: Partial<NewsArticle>) =>
    request<NewsArticle>(`/api/news/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/api/news/${id}`, { method: "DELETE", headers: authHeaders() }),
};

export const achievementsApi = {
  list: () => request<Achievement[]>("/api/achievements"),
  create: (data: Partial<Achievement>) =>
    request<Achievement>("/api/achievements", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Achievement>) =>
    request<Achievement>(`/api/achievements/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/api/achievements/${id}`, { method: "DELETE", headers: authHeaders() }),
};

export const committeeApi = {
  list: () => request<CommitteeMember[]>("/api/committee"),
  create: (data: Partial<CommitteeMember>) =>
    request<CommitteeMember>("/api/committee", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  update: (id: number, data: Partial<CommitteeMember>) =>
    request<CommitteeMember>(`/api/committee/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/api/committee/${id}`, { method: "DELETE", headers: authHeaders() }),
};

export const reviewsApi = {
  list: () => request<Review[]>("/api/reviews"),
  create: (data: Partial<Review>) =>
    request<Review>("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Review>) =>
    request<Review>(`/api/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<void>(`/api/reviews/${id}`, { method: "DELETE", headers: authHeaders() }),
};
