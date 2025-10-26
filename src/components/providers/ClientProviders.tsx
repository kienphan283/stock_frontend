"use client";

import { ReactNode } from "react";
import { StealthProvider } from "@/contexts/StealthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <StealthProvider>
                {children}
            </StealthProvider>
        </ThemeProvider>
    );
}

