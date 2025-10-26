/**
 * Type definitions for company data
 */

export interface CompanyFAQ {
    question: string;
    answer: string;
}

export interface CompanyData {
    ticker: string;
    name: string;
    description: string;
    logo: string;
    sector: string;
    industry: string;
    founded: string;
    headquarters: string;
    website: string;
    faqs: CompanyFAQ[];
}

export type CompanyTicker = string;

export interface CompanyLogoProps {
    ticker: string;
    size?: number;
    className?: string;
}

