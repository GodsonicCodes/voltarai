interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function api<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
        const {headers, ...rest} = options;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...rest,
            headers: {
                "Content-Type": "application/json",
                ...(headers || {}),
            },
        });

        console.log(response);

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
