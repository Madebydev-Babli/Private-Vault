async function request(path: string, options?: RequestInit) {
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(body.error ?? "Unable to reach the private vault.");
  return body as { authenticated: boolean };
}

export const authApi = {
  session: () => request("/api/auth/session"),
  login: (email: string, password: string) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request("/api/auth/logout", {
      method: "POST",
    }),
};
