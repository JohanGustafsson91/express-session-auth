export async function request<T>(
  url: RequestInfo,
  init?: RequestInit
): Promise<T | never> {
  try {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      ...init,
    });

    const data = await response.json();

    if (response.status === 401) {
      window.location.assign("/login");
      throw new Error(data);
    }

    if (!response.ok) throw new Error(data);
    return data;
  } catch (error) {
    throw error;
  }
}
