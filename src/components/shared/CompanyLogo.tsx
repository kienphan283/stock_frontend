"use client";

import Image from "next/image";
import { getCompanyLogo, isLogoImage, getCompanyInitial } from "@/utils/company";

interface CompanyLogoProps {
    ticker: string;
    companyName?: string;
    size?: number;
    className?: string;
    showFallback?: boolean;
}

/**
 * CompanyLogo component displays a company's logo
 * Falls back to emoji or company initial if logo is not available
 */
export default function CompanyLogo({
    ticker,
    companyName,
    size = 48,
    className = "",
    showFallback = true,
}: CompanyLogoProps) {
    const logo = getCompanyLogo(ticker);
    const isImage = isLogoImage(logo);

    const containerClasses = `
    flex items-center justify-center 
    bg-gradient-to-br from-blue-50 to-indigo-50 
    rounded-xl shadow-sm border border-gray-100 
    overflow-hidden
    ${className}
  `.trim();

    if (isImage) {
        return (
            <div className={containerClasses} style={{ width: size, height: size }}>
                <Image
                    src={logo}
                    alt={`${companyName || ticker} logo`}
                    width={size - 8}
                    height={size - 8}
                    className="object-contain p-1"
                    onError={(e) => {
                        if (showFallback) {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            if (target.parentElement) {
                                const fallbackText = companyName
                                    ? getCompanyInitial(companyName)
                                    : ticker.charAt(0);
                                target.parentElement.innerHTML = `<span class="text-2xl font-bold text-gray-700">${fallbackText}</span>`;
                            }
                        }
                    }}
                />
            </div>
        );
    }

    // Display emoji or text fallback
    return (
        <div className={containerClasses} style={{ width: size, height: size }}>
            <span className="text-2xl">{logo}</span>
        </div>
    );
}

