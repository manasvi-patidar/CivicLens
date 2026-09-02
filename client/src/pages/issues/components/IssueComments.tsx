import type { FormEvent } from "react";
import type { Comment } from "../../../types/comment";

interface IssueCommentsProps {
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string;
  commentContent: string;
  postingComment: boolean;
  commentFormError: string;

  editingCommentId: string | null;
  editingCommentContent: string;
  updatingComment: boolean;
  commentEditError: string;

  userId: string | null;
  userRole: string | null;

  onCommentContentChange: (content: string) => void;
  onCommentSubmit: (event: FormEvent<HTMLFormElement>) => void;

  canDeleteComment: (comment: Comment) => boolean;

  onEditComment: (comment: Comment) => void;
  onCancelEditComment: () => void;
  onEditingCommentContentChange: (content: string) => void;
  onUpdateComment: (commentId: string) => void;

  onDeleteComment: (commentId: string) => void;
}

function IssueComments({
  comments,
  commentsLoading,
  commentsError,
  commentContent,
  postingComment,
  commentFormError,
  editingCommentId,
  editingCommentContent,
  updatingComment,
  commentEditError,
  userId,
  userRole,
  onCommentContentChange,
  onCommentSubmit,
  canDeleteComment,
  onEditComment,
  onCancelEditComment,
  onEditingCommentContentChange,
  onUpdateComment,
  onDeleteComment,
}: IssueCommentsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Comments</h2>

          <p className="mt-1 text-sm text-slate-500">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </p>
        </div>
      </div>

      {/* Add Comment */}
      <form onSubmit={onCommentSubmit} className="mt-6">
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Add a comment
        </label>

        <textarea
          id="comment"
          value={commentContent}
          onChange={(event) => onCommentContentChange(event.target.value)}
          placeholder="Share an update or useful information..."
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        {commentFormError && (
          <p className="mt-2 text-sm text-red-600">{commentFormError}</p>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={postingComment}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {postingComment ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-8">
        {commentsLoading ? (
          <p className="text-sm text-slate-500">Loading comments...</p>
        ) : commentsError ? (
          <p className="text-sm text-red-600">{commentsError}</p>
        ) : comments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">
              No comments yet. Be the first to comment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        {comment.user.name}
                      </p>

                      {comment.user.role && (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {comment.user.role}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {(comment.user.id === userId || userRole === "ADMIN") && (
                      <button
                        type="button"
                        onClick={() => onEditComment(comment)}
                        className="text-xs font-semibold text-teal-600 transition hover:text-teal-700"
                      >
                        Edit
                      </button>
                    )}

                    {/* Delete button is visible only to the
                        comment owner or an ADMIN. */}
                    {canDeleteComment(comment) && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="mt-3">
                    <textarea
                      value={editingCommentContent}
                      onChange={(event) =>
                        onEditingCommentContentChange(event.target.value)
                      }
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />

                    {commentEditError && (
                      <p className="mt-2 text-sm text-red-600">
                        {commentEditError}
                      </p>
                    )}

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={onCancelEditComment}
                        disabled={updatingComment}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdateComment(comment.id)}
                        disabled={updatingComment}
                        className="rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingComment ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {comment.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default IssueComments;
