interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
}

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
        ? "https://volta-ai-backend.vercel.app/api"
        : "http://localhost:8000/api");

export async function api<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const { headers, ...rest } = options;

        // Don't set Content-Type for FormData - let browser handle it
        const defaultHeaders: Record<string, string> = {};
        if (!(options.body instanceof FormData)) {
            defaultHeaders["Content-Type"] = "application/json";
        }

        let fetchUrl = `${API_BASE_URL}${endpoint}`;
        // Ensure trailing slash comes before query params
        if (fetchUrl.includes('?')) {
            const [base, query] = fetchUrl.split('?');
            fetchUrl = `${base.endsWith('/') ? base : base + '/'}?${query}`;
        } else {
            fetchUrl = fetchUrl.endsWith('/') ? fetchUrl : fetchUrl + '/';
        }

        const response = await fetch(fetchUrl, {
            ...rest,
            headers: {
                ...defaultHeaders,
                ...(headers || {}),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log(errorData);

            return {
                success: false,
                error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        const data = await response.json();
        return {
            success: true,
            data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error occurred",
        };
    }
}
