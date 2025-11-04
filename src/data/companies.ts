/**
 * Company data including descriptions, FAQs, and metadata
 * This file contains detailed information about each company
 */

import type { CompanyData } from "@/types/company";

export type { CompanyData, CompanyFAQ } from "@/types/company";

export const companiesData: Record<string, CompanyData> = {
    AAPL: {
        ticker: "AAPL",
        name: "Apple Inc.",
        description:
            "Apple Inc. is an American multinational technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company is best known for its iPhone, iPad, Mac, Apple Watch, and AirPods products.",
        logo: "/logos/apple.png",
        sector: "Technology",
        industry: "Consumer Electronics",
        founded: "1976",
        headquarters: "Cupertino, California, USA",
        website: "https://www.apple.com",
        faqs: [
            {
                question: "What products does Apple sell?",
                answer:
                    "Apple sells a range of consumer electronics including iPhone, iPad, Mac computers, Apple Watch, AirPods, and various accessories. They also offer services like Apple Music, iCloud, and Apple TV+.",
            },
            {
                question: "When does Apple typically release new products?",
                answer:
                    "Apple typically announces new iPhones in September, with releases in late September or early October. Mac and iPad updates usually come in the spring and fall events.",
            },
            {
                question: "Does Apple pay dividends?",
                answer:
                    "Yes, Apple pays quarterly dividends to shareholders. The company initiated its dividend program in 2012.",
            },
            {
                question: "What is Apple's main source of revenue?",
                answer:
                    "iPhone sales represent the largest portion of Apple's revenue, followed by services, Mac computers, wearables (Apple Watch and AirPods), and iPad.",
            },
        ],
    },
    MSFT: {
        ticker: "MSFT",
        name: "Microsoft Corporation",
        description:
            "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through Productivity and Business Processes, Intelligent Cloud, and More Personal Computing segments. It is known for Windows OS, Office suite, Azure cloud platform, Xbox gaming, and LinkedIn.",
        logo: "/logos/microsoft.png",
        sector: "Technology",
        industry: "Software—Infrastructure",
        founded: "1975",
        headquarters: "Redmond, Washington, USA",
        website: "https://www.microsoft.com",
        faqs: [
            {
                question: "What are Microsoft's main products?",
                answer:
                    "Microsoft's main products include Windows operating system, Office 365, Azure cloud services, Xbox gaming console, Surface devices, and LinkedIn professional network.",
            },
            {
                question: "What is Azure?",
                answer:
                    "Azure is Microsoft's cloud computing platform offering services like virtual machines, databases, AI, and analytics. It's one of the leading cloud platforms alongside AWS and Google Cloud.",
            },
            {
                question: "Does Microsoft pay dividends?",
                answer:
                    "Yes, Microsoft has a strong history of paying quarterly dividends and has increased its dividend for many consecutive years.",
            },
            {
                question: "What is Microsoft's growth strategy?",
                answer:
                    "Microsoft focuses on cloud computing (Azure), AI integration, gaming (Xbox and Game Pass), and productivity tools (Office 365). The company is also investing heavily in AI through partnerships like OpenAI.",
            },
        ],
    },
    GOOGL: {
        ticker: "GOOGL",
        name: "Alphabet Inc.",
        description:
            "Alphabet Inc. is the parent company of Google and several other businesses. Google operates the world's largest search engine and provides a wide range of internet products and services including advertising, Android OS, YouTube, Google Cloud, and hardware products.",
        logo: "/logos/google.png",
        sector: "Technology",
        industry: "Internet Content & Information",
        founded: "1998 (Google), 2015 (Alphabet)",
        headquarters: "Mountain View, California, USA",
        website: "https://www.abc.xyz",
        faqs: [
            {
                question: "What's the difference between GOOGL and GOOG?",
                answer:
                    "GOOGL represents Class A shares with voting rights, while GOOG represents Class C shares without voting rights. Both track similar prices but GOOGL typically trades at a small premium.",
            },
            {
                question: "What are Alphabet's main revenue sources?",
                answer:
                    "Google Search advertising is the primary revenue source, followed by YouTube ads, Google Cloud, Google Play, and hardware sales.",
            },
            {
                question: "Does Alphabet pay dividends?",
                answer:
                    "As of now, Alphabet does not pay regular dividends, preferring to reinvest profits into growth opportunities and share buybacks.",
            },
            {
                question: "What other businesses does Alphabet own besides Google?",
                answer:
                    "Alphabet owns several 'Other Bets' including Waymo (self-driving cars), Verily (life sciences), Wing (drone delivery), and Calico (biotech).",
            },
        ],
    },
    AMZN: {
        ticker: "AMZN",
        name: "Amazon.com Inc.",
        description:
            "Amazon.com Inc. is a multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence. It's one of the Big Five companies in the U.S. information technology industry. Amazon Web Services (AWS) is a major profit driver.",
        logo: "/logos/amazon.png",
        sector: "Consumer Cyclical",
        industry: "Internet Retail",
        founded: "1994",
        headquarters: "Seattle, Washington, USA",
        website: "https://www.amazon.com",
        faqs: [
            {
                question: "What is AWS?",
                answer:
                    "Amazon Web Services (AWS) is Amazon's cloud computing platform, offering services like computing power, storage, and databases. It's the market leader in cloud infrastructure.",
            },
            {
                question: "Does Amazon pay dividends?",
                answer:
                    "No, Amazon does not currently pay dividends. The company reinvests its profits into business expansion and innovation.",
            },
            {
                question: "What are Amazon's main business segments?",
                answer:
                    "Amazon's main segments include North America e-commerce, International e-commerce, and AWS. The company also has growing advertising and subscription businesses.",
            },
            {
                question: "What is Amazon Prime?",
                answer:
                    "Amazon Prime is a subscription service offering free shipping, streaming video/music, exclusive deals, and other benefits. It has over 200 million subscribers worldwide.",
            },
        ],
    },
    TSLA: {
        ticker: "TSLA",
        name: "Tesla Inc.",
        description:
            "Tesla Inc. designs, develops, manufactures, and sells electric vehicles and energy generation and storage systems. The company is a pioneer in electric vehicles and sustainable energy, offering products like Model S, Model 3, Model X, Model Y, Cybertruck, and energy storage solutions.",
        logo: "/logos/tesla.png",
        sector: "Consumer Cyclical",
        industry: "Auto Manufacturers",
        founded: "2003",
        headquarters: "Austin, Texas, USA",
        website: "https://www.tesla.com",
        faqs: [
            {
                question: "What vehicles does Tesla produce?",
                answer:
                    "Tesla produces Model S (luxury sedan), Model 3 (affordable sedan), Model X (luxury SUV), Model Y (compact SUV), and has the Cybertruck in production. The Roadster and Semi are in development.",
            },
            {
                question: "Does Tesla pay dividends?",
                answer:
                    "No, Tesla does not pay dividends. The company focuses on reinvesting profits into expansion, R&D, and building new factories.",
            },
            {
                question: "What is Tesla's Full Self-Driving (FSD)?",
                answer:
                    "FSD is Tesla's advanced driver assistance system. It's a software upgrade that adds autonomous driving features, though it still requires active driver supervision.",
            },
            {
                question: "What other products does Tesla offer besides cars?",
                answer:
                    "Tesla offers energy storage products (Powerwall, Powerpack, Megapack) and solar panels/Solar Roof for residential and commercial applications.",
            },
        ],
    },
    NVDA: {
        ticker: "NVDA",
        name: "NVIDIA Corporation",
        description:
            "NVIDIA Corporation is a leading designer of graphics processing units (GPUs) for gaming, professional visualization, data centers, and automotive markets. The company has become crucial in AI and machine learning applications, with its GPUs powering most AI training and inference workloads.",
        logo: "/logos/nvidia.png",
        sector: "Technology",
        industry: "Semiconductors",
        founded: "1993",
        headquarters: "Santa Clara, California, USA",
        website: "https://www.nvidia.com",
        faqs: [
            {
                question: "What products does NVIDIA sell?",
                answer:
                    "NVIDIA sells GPUs for gaming (GeForce), professional visualization (Quadro), data centers (A100, H100), and AI applications. They also offer software platforms like CUDA and gaming services.",
            },
            {
                question: "Why is NVIDIA important for AI?",
                answer:
                    "NVIDIA's GPUs are the gold standard for training large AI models due to their parallel processing capabilities. Most AI companies rely on NVIDIA's H100 and A100 chips.",
            },
            {
                question: "Does NVIDIA pay dividends?",
                answer:
                    "Yes, NVIDIA pays a small quarterly dividend, though the yield is typically low as the company focuses on growth.",
            },
            {
                question: "What is CUDA?",
                answer:
                    "CUDA is NVIDIA's parallel computing platform and programming model that allows developers to use GPUs for general purpose computing, particularly useful for AI and scientific computing.",
            },
        ],
    },
    META: {
        ticker: "META",
        name: "Meta Platforms Inc.",
        description:
            "Meta Platforms Inc. (formerly Facebook) operates social networking platforms and develops technologies for connecting people through mobile devices and computers. The company owns Facebook, Instagram, WhatsApp, and Messenger, and is investing heavily in virtual reality and the metaverse.",
        logo: "/logos/meta.png",
        sector: "Communication Services",
        industry: "Internet Content & Information",
        founded: "2004 (as Facebook)",
        headquarters: "Menlo Park, California, USA",
        website: "https://www.meta.com",
        faqs: [
            {
                question: "What platforms does Meta own?",
                answer:
                    "Meta owns Facebook, Instagram, WhatsApp, Messenger, and Threads. The company also develops virtual reality hardware through its Reality Labs division.",
            },
            {
                question: "What is the Metaverse?",
                answer:
                    "The metaverse is Meta's vision for the future of the internet as immersive virtual and augmented reality experiences. The company is investing billions in developing this technology.",
            },
            {
                question: "How does Meta make money?",
                answer:
                    "Meta generates revenue primarily through advertising on its platforms. Advertisers pay to show targeted ads to Meta's billions of users across Facebook, Instagram, and other properties.",
            },
            {
                question: "Does Meta pay dividends?",
                answer:
                    "Meta initiated its first dividend in 2024. Prior to this, the company focused on share buybacks and reinvesting in growth.",
            },
        ],
    },
    IBM: {
        ticker: "IBM",
        name: "International Business Machines Corporation",
        description:
            "IBM is a multinational technology company offering a comprehensive portfolio of enterprise solutions including cloud computing, artificial intelligence, quantum computing, and business consulting services. The company has transformed from a hardware manufacturer to a hybrid cloud and AI-focused enterprise, with its Red Hat acquisition strengthening its position in the cloud infrastructure market.",
        logo: "/logos/ibm.png",
        sector: "Technology",
        industry: "Information Technology Services",
        founded: "1911",
        headquarters: "Armonk, New York, USA",
        website: "https://www.ibm.com",
        faqs: [
            {
                question: "What are IBM's main business segments?",
                answer:
                    "IBM operates through Software (including Red Hat), Consulting, Infrastructure (hybrid cloud and IT infrastructure), and Financing segments. The company focuses on hybrid cloud and AI solutions for enterprise clients.",
            },
            {
                question: "What is IBM's Red Hat acquisition?",
                answer:
                    "In 2019, IBM acquired Red Hat for $34 billion, making it IBM's largest acquisition. Red Hat's open-source enterprise software, especially Red Hat OpenShift, is central to IBM's hybrid cloud strategy.",
            },
            {
                question: "Does IBM pay dividends?",
                answer:
                    "Yes, IBM has a long history of paying dividends and is known as a dividend aristocrat, having increased its dividend for many consecutive years. The company typically offers an attractive dividend yield.",
            },
            {
                question: "What is IBM Watson?",
                answer:
                    "IBM Watson is the company's AI platform offering natural language processing, machine learning, and data analytics capabilities. It's used across industries for applications like healthcare diagnostics, customer service automation, and business intelligence.",
            },
            {
                question: "What is IBM's quantum computing initiative?",
                answer:
                    "IBM is a leader in quantum computing research and development. The company offers cloud-based access to quantum computers through IBM Quantum Experience and is developing practical quantum applications for optimization, cryptography, and scientific research.",
            },
        ],
    },
};

/**
 * Get company data by ticker symbol
 * @param ticker - Stock ticker symbol (e.g., 'AAPL', 'MSFT')
 * @returns Company data or undefined if not found
 */
export function getCompanyData(ticker: string): CompanyData | undefined {
    return companiesData[ticker.toUpperCase()];
}

/**
 * Get all available company tickers
 * @returns Array of ticker symbols
 */
export function getAvailableTickers(): string[] {
    return Object.keys(companiesData);
}

/**
 * Check if company data exists for a ticker
 * @param ticker - Stock ticker symbol
 * @returns True if company data exists
 */
export function hasCompanyData(ticker: string): boolean {
    return ticker.toUpperCase() in companiesData;
}

