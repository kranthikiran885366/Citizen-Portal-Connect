import { useState } from "react";
import { Star, Send } from "lucide-react";
import { advancedApi } from "@/lib/api";

export default function ComplaintSurvey({ complaintId, complaintStatus }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please rate your experience");
      return;
    }

    setLoading(true);
    try {
      await advancedApi.submitSurvey(complaintId, rating, feedback, suggestions);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Survey submission failed:", err);
    }
    setLoading(false);
  };

  // Only show survey for resolved complaints
  if (complaintStatus !== "resolved") {
    return null;
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
      <h3 className="font-bold text-slate-950 mb-4">⭐ Rate Your Experience</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">How satisfied are you?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-slate-600 mt-1">
              {rating === 1 ? "Very Unsatisfied" :
               rating === 2 ? "Unsatisfied" :
               rating === 3 ? "Neutral" :
               rating === 4 ? "Satisfied" :
               "Very Satisfied"}
            </p>
          )}
        </div>

        {/* Feedback */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">What's your feedback?</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            rows="2"
          />
        </div>

        {/* Suggestions */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Suggestions for improvement?</label>
          <textarea
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="Help us serve you better..."
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
            rows="2"
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>

        {submitted && (
          <div className="text-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm font-semibold text-emerald-700">✓ Thank you for your feedback!</p>
          </div>
        )}
      </form>
    </div>
  );
}
