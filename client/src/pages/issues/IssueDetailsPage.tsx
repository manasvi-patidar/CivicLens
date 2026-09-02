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
import ConfirmationModal from "./components/ConfirmationModal";
import { canDeleteIssue, canEditIssue } from "./utils/issue-permissions";

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
      <IssueHeader
        issue={issue}
        canEditIssue={canEditIssue(user, issue)}
        canDeleteIssue={canDeleteIssue(user, issue)}
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

      {/* Delete Issue Confirmation */}
      {showDeleteConfirm && (
        <ConfirmationModal
          title="Delete issue?"
          message="This action cannot be undone. The issue and its related data will be permanently deleted."
          confirmText="Delete Issue"
          loadingText="Deleting..."
          loading={deleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}

      {/* Delete Comment Confirmation */}
      {commentToDelete && (
        <ConfirmationModal
          title="Delete comment?"
          message="This comment will be permanently deleted. This action cannot be undone."
          confirmText="Delete Comment"
          loadingText="Deleting..."
          loading={deletingCommentId !== null}
          onCancel={() => setCommentToDelete(null)}
          onConfirm={() => {
            if (commentToDelete) {
              handleDeleteComment(commentToDelete);
            }
          }}
        />
      )}
    </div>
  );
}

export default IssueDetailsPage;
