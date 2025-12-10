import { authUtils } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";


interface FetchOptions extends RequestInit {
    requiresAuth?: boolean;
}

export const api = {
    // Generic fetch wrapper with auth handling
    fetch: async (endpoint: string, options: FetchOptions = {}) => {
        const { requiresAuth = true, ...fetchOptions } = options;

        // Check authentication if required
        if (requiresAuth && !authUtils.checkAuthAndRedirect()) {
            throw new Error('Authentication required');
        }

        // Prepare headers
        const headers: HeadersInit = {
            ...fetchOptions.headers,
        };

        // Only set Content-Type for non-FormData requests
        // FormData will set its own Content-Type with boundary
        if (!(fetchOptions.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        // Add auth header if required
        if (requiresAuth) {
            Object.assign(headers, authUtils.getAuthHeader());
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...fetchOptions,
                headers,
            });

            // Handle 401 Unauthorized
            if (response.status === 401) {
                authUtils.logout();
                throw new Error('Session expired. Please login again.');
            }

            // Handle 503 Maintenance Mode
            if (response.status === 503) {
                window.location.href = '/maintenance';
                throw new Error('Platform is under maintenance');
            }

            // Handle other errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // GET request
    get: async (endpoint: string, requiresAuth = true) => {
        const response = await api.fetch(endpoint, {
            method: 'GET',
            requiresAuth
        });
        return response.json();
    },

    // POST request
    post: async (endpoint: string, data: any, requiresAuth = true) => {
        const response = await api.fetch(endpoint, {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
            requiresAuth,
        });
        return response.json();
    },

    // PUT request
    put: async (endpoint: string, data: any, requiresAuth = true) => {
        const response = await api.fetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            requiresAuth,
        });
        return response.json();
    },

    // DELETE request
    delete: async (endpoint: string, requiresAuth = true) => {
        const response = await api.fetch(endpoint, {
            method: 'DELETE',
            requiresAuth,
        });
        return response.json();
    },

    // Upload file (FormData)
    upload: async (endpoint: string, formData: FormData, requiresAuth = true) => {
        const response = await api.fetch(endpoint, {
            method: 'POST',
            body: formData,
            requiresAuth,
        });
        return response.json();
    },
};
