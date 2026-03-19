"use client";
import {
  MessageSquare,
  Send,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { MOCK_REVIEWS } from "./data";

export default function ReviewsTab() {
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Rating stats
  const totalReviews = MOCK_REVIEWS.length;
  const avgRating = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1);
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: MOCK_REVIEWS.filter((r) => r.rating === stars).length,
  }));

  const sortedReviews = [...MOCK_REVIEWS]
    .filter((r) => !filterRating || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Rating Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-40">
            <div className="text-center mb-6">
              <p className="text-5xl font-extrabold text-gray-900">{avgRating}</p>
              <div className="flex items-center justify-center gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    className={s <= Math.round(Number(avgRating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">Based on {totalReviews} reviews</p>
            </div>

            {/* Distribution */}
            <div className="space-y-2">
              {distribution.map(({ stars, count }) => (
                <button
                  key={stars}
                  onClick={() => setFilterRating(filterRating === stars ? null : stars)}
                  className={`w-full flex items-center gap-2 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                    filterRating === stars ? "bg-emerald-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xs font-semibold text-gray-600 w-3">{stars}</span>
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${totalReviews ? (count / totalReviews) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-5 text-right">{count}</span>
                </button>
              ))}
            </div>

            {filterRating && (
              <button
                onClick={() => setFilterRating(null)}
                className="mt-3 w-full text-xs text-emerald-600 font-medium hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 space-y-4">
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Sort by:</span>
            {[
              { value: "recent", label: "Most Recent" },
              { value: "highest", label: "Highest Rated" },
              { value: "lowest", label: "Lowest Rated" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  sortBy === opt.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Review Cards */}
          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                  {review.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.customer}</p>
                      <p className="text-xs text-gray-500">{review.service} • {review.date}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.text}</p>

                  {/* Existing Reply */}
                  {review.reply && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-xs font-semibold text-emerald-700 mb-1">Your Reply</p>
                      <p className="text-sm text-gray-700">{review.reply}</p>
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === review.id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="p-2 bg-primary text-white rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  ) : (
                    !review.reply && (
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        <MessageSquare size={14} />
                        Reply to review
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {sortedReviews.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <ThumbsUp size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No reviews match your filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
