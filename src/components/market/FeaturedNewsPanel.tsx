"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FeaturedNews } from "@/types/market";
import { getNews } from "@/services/newsService";

/**
 * FeaturedNewsPanel - Hiển thị bài nổi bật
 *
 * Design theo FireAnt với:
 * - Tiêu đề "Bài nổi bật"
 * - Danh sách bài viết với thumbnail bên trái
 * - Tiêu đề và thời gian đăng
 */
export default function FeaturedNewsPanel() {
  const [news, setNews] = useState<FeaturedNews[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial news
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await getNews(6);
      setNews(data);
      setLoading(false);
    };

    loadNews();
  }, []);

  // Auto-refresh news every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getNews(6);
      if (data.length > 0) {
        setNews(data);
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút`;
    if (diffHours < 24) return `Khoảng ${diffHours} tiếng`;
    return `${Math.floor(diffHours / 24)} ngày`;
  };

  const getCategoryColor = (category: FeaturedNews["category"]): string => {
    const colors = {
      market: "text-blue-500",
      economy: "text-green-500",
      stock: "text-purple-500",
      commodity: "text-yellow-500",
      crypto: "text-orange-500",
    };
    return colors[category];
  };

  return (
    <div className="bg-[#1a1d29] rounded-lg shadow-lg p-4 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100">Bài nổi bật</h2>
        {loading && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* News List */}
      {loading && news.length === 0 ? (
        // Loading skeleton
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-24 h-20 bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {news.map((article) => (
            <div
              key={article.id}
              className="group cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors"
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <h3 className="text-sm text-gray-200 font-medium line-clamp-2 group-hover:text-blue-400 transition-colors mb-1">
                    {article.title}
                  </h3>

                  {/* Meta info */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={getCategoryColor(article.category)}>
                      {article.source}
                    </span>
                    <span>•</span>
                    <span>{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          Tin tức được cập nhật tự động
        </p>
      </div>
    </div>
  );
}
