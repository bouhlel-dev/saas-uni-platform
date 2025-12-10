import { useEffect } from 'react';
import { authUtils } from '@/lib/auth';

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];
const CHECK_INTERVAL = 60000; // Check every minute
const STORAGE_KEY = 'lastActivity';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export function useSessionTimeout() {
    useEffect(() => {
        let checkInterval: NodeJS.Timeout;

        const updateActivity = () => {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        };

        const checkSession = async () => {
            try {
                // Fetch session settings
                const response = await fetch(`${API_BASE_URL}/super-admin/settings`, {
                    headers: authUtils.getAuthHeader()
                });

                if (!response.ok) return;

                const settings = await response.json();

                if (!settings.sessionTimeout) return;

                const lastActivity = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
                const now = Date.now();
                const inactiveTime = now - lastActivity;
                const maxInactiveTime = settings.sessionDuration * 60 * 1000; // Convert minutes to ms

                if (inactiveTime > maxInactiveTime) {
                    authUtils.logout();
                    window.location.href = '/login?timeout=true';
                }
            } catch (error) {
                console.error('Session check error:', error);
            }
        };

        // Initialize last activity
        updateActivity();

        // Add activity listeners
        ACTIVITY_EVENTS.forEach(event => {
            window.addEventListener(event, updateActivity);
        });

        // Start checking session
        checkInterval = setInterval(checkSession, CHECK_INTERVAL);

        return () => {
            // Cleanup
            ACTIVITY_EVENTS.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });
            clearInterval(checkInterval);
        };
    }, []);
}
