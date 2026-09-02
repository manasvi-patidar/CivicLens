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
import IssueInfo from "./components/IssueInfo";
import IssueComments from "./components/IssueComments";

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

      {/* Issue Information */}
      <IssueInfo issue={issue} />

      {/*Comments*/}
      <IssueComments
        comments={comments}
        commentsLoading={commentsLoading}
        commentsError={commentsError}
        commentContent={commentContent}
        postingComment={postingComment}
        commentFormError={commentFormError}
        onCommentContentChange={setCommentContent}
        onCommentSubmit={handleCommentSubmit}
        canDeleteComment={canDeleteComment}
        onDeleteComment={setCommentToDelete}
      />

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
