import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    id: number;
    email: string;
    role: string;
    exp: number;
    iat: number;
}

export const authUtils = {
    // Get token from localStorage
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    // Set token in localStorage
    setToken: (token: string): void => {
        localStorage.setItem('token', token);
    },

    // Remove token from localStorage
    removeToken: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Decode JWT token
    decodeToken: (token: string): DecodedToken | null => {
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    // Check if token is expired
    isTokenExpired: (token: string): boolean => {
        const decoded = authUtils.decodeToken(token);
        if (!decoded) return true;

        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        const token = authUtils.getToken();
        if (!token) return false;
        return !authUtils.isTokenExpired(token);
    },

    // Get user info from token
    getUserInfo: (): DecodedToken | null => {
        const token = authUtils.getToken();
        if (!token) return null;
        return authUtils.decodeToken(token);
    },

    // Logout user
    logout: (): void => {
        authUtils.removeToken();
        window.location.href = '/login';
    },

    // Get authorization header
    getAuthHeader: (): { Authorization: string } | {} => {
        const token = authUtils.getToken();
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    },

    // Check token and redirect if expired
    checkAuthAndRedirect: (): boolean => {
        if (!authUtils.isAuthenticated()) {
            authUtils.logout();
            return false;
        }
        return true;
    }
};
