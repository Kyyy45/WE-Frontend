export async function fetchServer(endpoint: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`[Fetch Server Error] ${endpoint}:`, error);
    return null;
  }
}
