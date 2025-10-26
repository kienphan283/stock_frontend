"use client";

import { useState } from "react";
import { getCompanyInfo } from "@/utils/company";

interface CompanyInfoProps {
    ticker: string;
}

export default function CompanyInfo({ ticker }: CompanyInfoProps) {
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const companyData = getCompanyInfo(ticker);

    if (!companyData) {
        return null;
    }

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    return (
        <div className="space-y-6">
            {/* Company Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    About {companyData.name}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                    {companyData.description}
                </p>

                {/* Company Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Sector</div>
                        <div className="font-medium text-gray-900">{companyData.sector}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Industry</div>
                        <div className="font-medium text-gray-900">
                            {companyData.industry}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Founded</div>
                        <div className="font-medium text-gray-900">{companyData.founded}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Headquarters</div>
                        <div className="font-medium text-gray-900">
                            {companyData.headquarters}
                        </div>
                    </div>
                </div>

                {/* Website Link */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                        href={companyData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Visit official website
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                </div>
            </div>

            {/* FAQs Section */}
            {companyData.faqs && companyData.faqs.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {companyData.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${expandedFAQ === index ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {expandedFAQ === index && (
                                    <div className="px-4 pb-4 text-gray-700 leading-relaxed bg-gray-50 border-t border-gray-200">
                                        <div className="pt-3">{faq.answer}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

