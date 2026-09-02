import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { deleteIssue, getIssueById } from "../../services/issue.service";
import {
  createComment,
  deleteComment,
  getIssueComments,
} from "../../services/comment.service";

import { AuthContext } from "../../context/auth-context";

import type { Issue } from "../../types/issue";
import type { Comment } from "../../types/comment";

import IssueHeader from "./components/IssueHeader";

function IssueDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);

  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");

  const [commentContent, setCommentContent] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [commentFormError, setCommentFormError] = useState("");

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Load issue
  useEffect(() => {
    const loadIssue = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const data = await getIssueById(id);
        setIssue(data);
      } catch {
        setError("Unable to load issue.");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;

      try {
        setCommentsLoading(true);
        setCommentsError("");

        const data = await getIssueComments(id);
        setComments(data);
      } catch {
        setCommentsError("Unable to load comments.");
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [id]);

  // Delete issue
  const handleDelete = async () => {
    if (!issue) return;

    try {
      setDeleting(true);

      await deleteIssue(issue.id);

      // Return to the issues list after successful deletion.
      window.location.href = "/issues";
    } catch (error: unknown) {
      const response =
        typeof error === "object" && error !== null && "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response
          : undefined;

      setError(response?.data?.message || "Unable to delete this issue.");

      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Add comment
  const handleCommentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!id) return;

    const trimmedContent = commentContent.trim();

    if (!trimmedContent) {
      setCommentFormError("Comment cannot be empty.");
      return;
    }

    try {
      setPostingComment(true);
      setCommentFormError("");

      const response = await createComment(id, trimmedContent);

      setComments((currentComments) => [...currentComments, response.data]);

      setCommentContent("");
    } catch (error: unknown) {
      const response =
        typeof error === "object" && error !== null && "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response
          : undefined;

      setCommentFormError(response?.data?.message || "Unable to post comment.");
    } finally {
      setPostingComment(false);
    }
  };

  // Issue permissions
  const canDeleteIssue =
    user &&
    issue &&
    (user.role === "ADMIN" ||
      (issue.createdById === user.id && issue.status === "OPEN"));

  const canEditIssue =
    user &&
    issue &&
    (user.role === "ADMIN" ||
      (issue.createdById === user.id && issue.status === "OPEN"));

  // Comment permissions
  const canDeleteComment = (comment: Comment) => {
    if (!user) return false;

    return user.role === "ADMIN" || comment.user.id === user.id;
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);

      // Remove any previous comment error before trying again.
      setCommentsError("");

      await deleteComment(commentId);

      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== commentId),
      );

      // Close the confirmation dialog after successful deletion.
      setCommentToDelete(null);

      setCommentsError("");
    } catch (error: unknown) {
      const response =
        typeof error === "object" && error !== null && "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response
          : undefined;

      setCommentsError(response?.data?.message || "Unable to delete comment.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading issue...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error || "Issue not found."}
          </p>

          <Link
            to="/issues"
            className="mt-4 inline-block text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            ← Back to issues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Issue Header */}
      <IssueHeader
        issue={issue}
        canEditIssue={Boolean(canEditIssue)}
        canDeleteIssue={Boolean(canDeleteIssue)}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      {/*Issue Details*/}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {issue.imageUrl && (
          <div className="border-b border-slate-200 bg-slate-50 p-4">
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="max-h-[420px] w-full rounded-lg object-contain"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              {issue.category}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {issue.status}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {issue.priority}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Description
            </h2>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {issue.description}
            </p>
          </div>

          {issue.address && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Location
              </h2>

              <p className="mt-2 text-sm text-slate-700">{issue.address}</p>
            </div>
          )}

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Latitude
              </p>

              <p className="mt-1 text-sm text-slate-700">{issue.latitude}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Longitude
              </p>

              <p className="mt-1 text-sm text-slate-700">{issue.longitude}</p>
            </div>
          </div>
        </div>
      </div>

      {/*Comments*/}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Comments</h2>

            <p className="mt-1 text-sm text-slate-500">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </p>
          </div>
        </div>

        {/*Add Comment*/}
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Add a comment
          </label>

          <textarea
            id="comment"
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
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

        {/*Comments List*/}
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

                    {/* Delete button is visible only to the
                        comment owner or an ADMIN. */}
                    {canDeleteComment(comment) && (
                      <button
                        type="button"
                        onClick={() => setCommentToDelete(comment.id)}
                        className="shrink-0 text-xs font-semibold text-red-600 transition hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/*Delete Issue Confirmation*/}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">Delete issue?</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action cannot be undone. The issue and its related data will
              be permanently deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Issue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*Delete Comment Confirmation*/}
      {commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">
              Delete comment?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This comment will be permanently deleted. This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCommentToDelete(null)}
                disabled={deletingCommentId !== null}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (commentToDelete) {
                    handleDeleteComment(commentToDelete);
                  }
                }}
                disabled={deletingCommentId !== null}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingCommentId !== null ? "Deleting..." : "Delete Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueDetailsPage;
