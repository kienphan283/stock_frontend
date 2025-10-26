/**
 * Utility functions for company data and logos
 */

import { getCompanyData, hasCompanyData } from "@/data/companies";

/**
 * Get the logo URL for a company ticker
 * Returns the logo path from company data or a fallback
 *
 * @param ticker - Stock ticker symbol
 * @returns Logo path or fallback emoji
 */
export function getCompanyLogo(ticker: string): string {
    const companyData = getCompanyData(ticker);

    if (companyData?.logo) {
        return companyData.logo;
    }

    // Fallback to default emoji
    return "🏢";
}

/**
 * Get the first letter of company name for logo fallback
 *
 * @param companyName - Full company name
 * @returns First letter in uppercase
 */
export function getCompanyInitial(companyName: string): string {
    return companyName.charAt(0).toUpperCase();
}

/**
 * Check if a logo is a URL/path (not an emoji)
 *
 * @param logo - Logo string (URL or emoji)
 * @returns True if it's a URL/path
 */
export function isLogoImage(logo: string): boolean {
    return logo.startsWith("/") || logo.startsWith("http");
}

/**
 * Get company description by ticker
 *
 * @param ticker - Stock ticker symbol
 * @returns Company description or undefined
 */
export function getCompanyDescription(ticker: string): string | undefined {
    return getCompanyData(ticker)?.description;
}

/**
 * Get company FAQs by ticker
 *
 * @param ticker - Stock ticker symbol
 * @returns Array of FAQs or empty array
 */
export function getCompanyFAQs(ticker: string) {
    return getCompanyData(ticker)?.faqs || [];
}

/**
 * Get complete company information
 *
 * @param ticker - Stock ticker symbol
 * @returns Company data or undefined
 */
export function getCompanyInfo(ticker: string) {
    return getCompanyData(ticker);
}

export { hasCompanyData };

