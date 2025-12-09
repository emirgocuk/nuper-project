"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminSettingsContextType {
    isDevMode: boolean;
    toggleDevMode: () => void;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export function AdminSettingsProvider({ children }: { children: React.ReactNode }) {
    const [isDevMode, setIsDevMode] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("devMode");
        if (stored) {
            setIsDevMode(stored === "true");
        }
    }, []);

    const toggleDevMode = () => {
        setIsDevMode((prev) => {
            const newVal = !prev;
            localStorage.setItem("devMode", String(newVal));
            return newVal;
        });
    };

    return (
        <AdminSettingsContext.Provider value={{ isDevMode, toggleDevMode }}>
            {children}
        </AdminSettingsContext.Provider>
    );
}

export function useAdminSettings() {
    const context = useContext(AdminSettingsContext);
    if (!context) {
        throw new Error("useAdminSettings must be used within an AdminSettingsProvider");
    }
    return context;
}
