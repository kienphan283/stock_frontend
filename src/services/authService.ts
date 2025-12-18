import { apiRequest, BACKEND_URL } from "./apiBase";

const AUTH_API_URL = "/api/auth";
export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: any;
}

export const authService = {
    async register(data: any) {
        return apiRequest(`${AUTH_API_URL}/register`, {
            method: "POST",
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                full_name: data.fullName,
            }),
        });
    },

    async resendOtp(email: string) {
        const response = await fetch(`${BACKEND_URL}/api/auth/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Failed to resend OTP");
        }
        return response.json();
    },

    async verifyOtp(email: string, otp: string) {
        // Uses BACKEND_URL to ensure consistency
        const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Verification failed");
        }

        return response.json();
    },

    async login(data: any): Promise<LoginResponse> {
        const formData = new URLSearchParams();
        formData.append("username", data.email);
        formData.append("password", data.password);

        // Uses BACKEND_URL to ensure consistency (127.0.0.1)
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Login failed");
        }

        return response.json();
    },

    async loginWithOAuth(provider: string, token: string): Promise<LoginResponse> {
        return apiRequest<LoginResponse>(`${AUTH_API_URL}/oauth/login`, {
            method: "POST",
            body: JSON.stringify({
                provider,
                token,
            }),
        });
    },
};
