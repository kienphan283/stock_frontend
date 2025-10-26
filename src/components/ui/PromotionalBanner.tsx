'use client'

export default function PromotionalBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 border border-purple-200 dark:border-gray-600 rounded-lg p-4 lg:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-base">📈</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Start your journey to financial independence</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Snowball will help you to track your portfolio, plan checklist for your investment and support your passive income investing with tools and community of investors.</p>
        </div>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap self-start sm:self-auto transition-colors">
        Start for free
      </button>
    </div>
  )
}