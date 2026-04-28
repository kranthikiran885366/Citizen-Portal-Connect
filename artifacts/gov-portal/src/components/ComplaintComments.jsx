import { useState, useEffect } from "react";
import { MessageSquare, Send, Lock, User } from "lucide-react";
import { advancedApi } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function ComplaintComments({ complaintId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      fetchComments();
    }
  }, [expanded, complaintId]);

  const fetchComments = async () => {
    try {
      const response = await advancedApi.getComments(complaintId);
      setComments(response.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await advancedApi.addComment(complaintId, newComment, isInternal);
      setNewComment("");
      setIsInternal(false);
      await fetchComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="font-bold text-slate-950">💬 Comments & Updates</h3>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">
            {comments.length}
          </span>
        </div>
        <span className="text-slate-500">{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div className="space-y-4">
          {/* Comments List */}
          <div className="max-h-64 overflow-y-auto space-y-3 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-start gap-2 mb-2">
                    <User className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-950">{comment.author_name}</p>
                        {comment.is_internal && (
                          <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                            <Lock className="h-3 w-3" /> Internal
                          </span>
                        )}
                        <p className="text-xs text-slate-500 ml-auto">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="space-y-3 border-t border-slate-200 pt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment... (min 5 characters)"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
              rows="3"
            />

            {(user?.role === "officer" || user?.role === "admin") && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-red-600"
                />
                <Lock className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-slate-700 font-medium">Internal note (citizens won't see this)</span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
