import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteIssue, getIssueById } from "../../services/issue.service";
import { getIssueComments } from "../../services/comment.service";
import { useAuth } from "../../hooks/useAuth";
import type { Issue } from "../../types/issue";
import type { Comment } from "../../types/comment";

function IssueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [error, setError] = useState("");
  const [commentsError, setCommentsError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadIssue = async () => {
      if (!id) {
        setError("Invalid issue.");
        setLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getIssueById(id);
        setIssue(data);
      } catch {
        setError("Unable to load this issue.");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  useEffect(() => {
    const loadComments = async () => {
      if (!id) {
        return;
      }

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

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteIssue(id);

      window.location.href = "/issues";
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const response = (
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        setError(response?.data?.message || "Unable to delete this issue.");
      } else {
        setError("Unable to delete this issue.");
      }
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-8">
        <p className="text-muted">Loading issue...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="card p-8">
        <h1 className="text-xl font-semibold text-slate-900">
          Issue not found
        </h1>

        <p className="text-muted mt-2">
          {error || "This issue could not be found."}
        </p>

        <Link to="/issues" className="btn btn-secondary mt-6">
          Back to Issues
        </Link>
      </div>
    );
  }

  const canDelete =
    user?.role === "ADMIN" ||
    (user?.id === issue.createdById && issue.status === "OPEN");

  const canEdit =
    user?.role === "ADMIN" ||
    (user?.id === issue.createdById && issue.status === "OPEN");

  return (
    <div className="space-y-6">
      <Link
        to="/issues"
        className="inline-flex items-center text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        ← Back to Issues
      </Link>

      <div className="card overflow-hidden">
        {issue.imageUrl && (
          <div className="flex justify-center bg-slate-50 p-4">
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="max-h-80 max-w-full rounded-lg object-contain"
            />
          </div>
        )}

        <div className="p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
              {issue.category.replace("_", " ")}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {issue.status.replace("_", " ")}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {issue.priority}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            {issue.title}
          </h1>

          <p className="text-muted mt-4 leading-7">{issue.description}</p>

          <div className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-500">Location</p>

              <p className="mt-1 text-sm text-slate-900">
                {issue.address || "Location not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Reported on</p>

              <p className="mt-1 text-sm text-slate-900">
                {new Date(issue.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Last updated</p>

              <p className="mt-1 text-sm text-slate-900">
                {new Date(issue.updatedAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Coordinates</p>

              <p className="mt-1 text-sm text-slate-900">
                {issue.latitude}, {issue.longitude}
              </p>
            </div>
          </div>

          {(canEdit || canDelete) && (
            <div className="mt-7 flex justify-end gap-3 border-t border-slate-100 pt-6">
              {canEdit && (
                <Link
                  to={`/issues/${issue.id}/edit`}
                  className="btn btn-secondary"
                >
                  Edit Issue
                </Link>
              )}

              {canDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                  className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Issue"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Comments</h2>

            <p className="mt-1 text-sm text-slate-500">
              Community discussion about this issue.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {comments.length}
          </span>
        </div>

        <div className="mt-6">
          {commentsLoading ? (
            <p className="text-sm text-slate-500">Loading comments...</p>
          ) : commentsError ? (
            <p className="text-sm text-red-600">{commentsError}</p>
          ) : comments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-600">
                No comments yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Be the first person to comment on this issue.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {comment.user.name}
                      </p>

                      <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {comment.user.role}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete Issue?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete this issue? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Issue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueDetailsPage;
