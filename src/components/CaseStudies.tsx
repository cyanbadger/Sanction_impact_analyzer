import { caseStudies } from "@/lib/sanctionData";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const sectorColors: Record<string, string> = {
  Defence: "text-red-400 bg-red-500/10",
  Energy: "text-amber-400 bg-amber-500/10",
  Finance: "text-blue-400 bg-blue-500/10",
  Technology: "text-violet-400 bg-violet-500/10",
};

const loadingMessages = [
  "Loading case studies… may the data be with you.",
  "Digging through history… we’ll be back.",
  "Reviewing sanctions… that’s what she said.",
  "Consulting archives… one does not simply skip due diligence.",
  "Compiling insights… it’s not a bug, it’s a feature.",
];

interface CommentType {
  text: string;
  likes: number;
  liked: boolean;
}

const CaseStudies = () => {
  const [loading, setLoading] = useState(true);

  const [loadingText] = useState(
    loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  );

  // Comment state
  const [comments, setComments] = useState<Record<number, CommentType[]>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Add Comment
  const handleAddComment = (index: number) => {
    if (!newComment[index]?.trim()) return;

    const newEntry: CommentType = {
      text: newComment[index],
      likes: 0,
      liked: false,
    };

    setComments((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), newEntry],
    }));

    setNewComment((prev) => ({
      ...prev,
      [index]: "",
    }));
  };

  // Toggle Like
  const toggleLike = (caseIndex: number, commentIndex: number) => {
    setComments((prev) => {
      const updated = [...(prev[caseIndex] || [])];

      const comment = updated[commentIndex];

      if (comment.liked) {
        comment.likes -= 1;
        comment.liked = false;
      } else {
        comment.likes += 1;
        comment.liked = true;
      }

      return {
        ...prev,
        [caseIndex]: updated,
      };
    });
  };

  if (loading) {
    return (
      <div className="mt-14 text-sm text-muted-foreground animate-pulse">
        {loadingText}
      </div>
    );
  }

  return (
    <div className="mt-14 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        Real-World <span className="text-gradient-gold">Case Studies</span>
      </h2>

      <p className="text-sm text-muted-foreground mb-6">
        Major sanctions events and their documented impact on India's economy,
        trade, and strategic interests.
      </p>

      <div className="space-y-4">
        {caseStudies.map((cs, i) => {
          const sectorStyle =
            sectorColors[cs.sector] || "text-primary bg-primary/10";

          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {cs.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${sectorStyle}`}
                  >
                    {cs.sector}
                  </span>

                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {cs.year}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cs.summary}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Impact */}
                  <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                        Impact
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cs.impact}
                    </p>
                  </div>

                  {/* Outcome */}
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                        Outcome
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cs.outcome}
                    </p>
                  </div>
                </div>

                {/* COMMENT SECTION WITH LIKE */}
                <div className="mt-4 border-t border-border pt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Comments
                  </h4>

                  <div className="space-y-3 mb-3">
                    {(comments[i] || []).map((comment, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-muted/50 rounded-md px-3 py-2"
                      >
                        <p className="text-muted-foreground mb-2">
                          {comment.text}
                        </p>

                        <button
                          onClick={() => toggleLike(i, idx)}
                          className={`flex items-center gap-1 text-xs transition ${
                            comment.liked
                              ? "text-blue-400"
                              : "text-muted-foreground hover:text-blue-400"
                          }`}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {comment.likes}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment[i] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          [i]: e.target.value,
                        }))
                      }
                      className="flex-1 rounded-md bg-muted border border-border px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />

                    <button
                      onClick={() => handleAddComment(i)}
                      className="px-3 py-1.5 text-xs rounded-md bg-primary text-white hover:bg-primary/80 transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
                {/* END COMMENT SECTION */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseStudies;