interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://volta-ai-backend.vercel.app/api";

export async function api<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const {headers, ...rest} = options;

        // Don't set Content-Type for FormData - let browser handle it
        const defaultHeaders: Record<string, string> = {};
        if (!(options.body instanceof FormData)) {
            defaultHeaders["Content-Type"] = "application/json";
        }

        // Ensure endpoint starts with / and doesn't end with / (we'll add it)
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const cleanEndpoint = normalizedEndpoint.endsWith('/') ? normalizedEndpoint.slice(0, -1) : normalizedEndpoint;
        const response = await fetch(`${API_BASE_URL}${cleanEndpoint}/`, {
            ...rest,
            headers: {
                ...defaultHeaders,
                ...(headers || {}),
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

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
        // Provide more descriptive error messages
        let errorMessage = "Network error occurred";
        
        if (error instanceof TypeError) {
            if (error.message.includes("fetch")) {
                errorMessage = `Unable to connect to the server. Please check if the API server is running at ${API_BASE_URL}`;
            } else {
                errorMessage = error.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        console.error("API call failed:", error);
        return {
            success: false,
            error: errorMessage,
        };
    }
}
