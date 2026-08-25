import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getIssues } from "../../services/issue.service";
import type { Issue } from "../../types/issue";

function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesError, setIssuesError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadMyIssues = async () => {
      try {
        setIssuesLoading(true);
        setIssuesError("");

        const response = await getIssues({
          page: 1,
          limit: 100,
        });

        const userIssues = response.data.filter(
          (issue) => issue.createdBy?.id === user.id,
        );

        setMyIssues(userIssues);
      } catch {
        setIssuesError("Unable to load your reported issues.");
      } finally {
        setIssuesLoading(false);
      }
    };

    loadMyIssues();
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card p-8">
          <p className="text-sm text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please sign in again to view your profile.
          </p>

          <Link to="/login" className="btn btn-primary mt-5 inline-flex">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const roleLabel = user.role.charAt(0) + user.role.slice(1).toLowerCase();

  const handleEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setEditError("");
    setEditSuccess("");
    setEditing(true);
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setEditError("");
    setEditSuccess("");
    setEditing(false);
  };

  const handleSaveProfile = async () => {
    setEditError("");
    setEditSuccess("");

    if (name.trim().length < 3) {
      setEditError("Name must be at least 3 characters.");
      return;
    }

    if (!email.trim()) {
      setEditError("Email address is required.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile({
        name: name.trim(),
        email: email.trim(),
      });

      setEditSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        setEditError(
          response?.data?.message || "Unable to update your profile.",
        );
      } else {
        setEditError("Unable to update your profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatusLabel = (status: Issue["status"]) => {
    switch (status) {
      case "IN_PROGRESS":
        return "In Progress";

      case "RESOLVED":
        return "Resolved";

      case "REJECTED":
        return "Rejected";

      default:
        return "Open";
    }
  };

  const getCategoryLabel = (category: Issue["category"]) => {
    return category
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Account</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>

        <p className="text-muted mt-2">
          Manage your CivicLens identity and view your community contribution
          details.
        </p>
      </div>

      {editSuccess && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
          {editSuccess}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-7 py-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
              {initials}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900">
                {user.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">{user.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {roleLabel}
                </span>

                {user.isVerified && (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="btn btn-secondary sm:ml-auto"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-px bg-slate-100 sm:grid-cols-3">
          <div className="bg-white p-6">
            <p className="text-sm text-slate-500">Reputation</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {user.reputation ?? 0}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Community contribution
            </p>
          </div>

          <div className="bg-white p-6">
            <p className="text-sm text-slate-500">Account role</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {roleLabel}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              CivicLens access level
            </p>
          </div>

          <div className="bg-white p-6">
            <p className="text-sm text-slate-500">Member since</p>

            <p className="mt-2 text-lg font-semibold text-slate-900">
              {memberSince}
            </p>

            <p className="mt-1 text-xs text-slate-400">CivicLens member</p>
          </div>
        </div>
      </div>

      {editing && (
        <div className="card p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Edit Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your basic account information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={saving}
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={saving}
                className="input"
              />
            </div>

            {editError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {editError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              My Reported Issues
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Issues you have reported through CivicLens.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {myIssues.length}
          </span>
        </div>

        {issuesLoading && (
          <div className="mt-6 rounded-lg bg-slate-50 px-4 py-5 text-center">
            <p className="text-sm text-slate-500">
              Loading your reported issues...
            </p>
          </div>
        )}

        {issuesError && !issuesLoading && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-4">
            <p className="text-sm text-red-600">{issuesError}</p>
          </div>
        )}

        {!issuesLoading && !issuesError && myIssues.length === 0 && (
          <div className="mt-6 rounded-lg bg-slate-50 px-5 py-8 text-center">
            <h3 className="text-sm font-semibold text-slate-800">
              No reported issues yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              When you report a civic issue, it will appear here.
            </p>

            <Link
              to="/issues/create"
              className="btn btn-primary mt-4 inline-flex"
            >
              Report an Issue
            </Link>
          </div>
        )}

        {!issuesLoading && myIssues.length > 0 && (
          <div className="mt-6 space-y-3">
            {myIssues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/30"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-slate-900">
                      {issue.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {getCategoryLabel(issue.category)}
                      </span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {issue.priority}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      issue.status === "RESOLVED"
                        ? "bg-teal-50 text-teal-700"
                        : issue.status === "IN_PROGRESS"
                          ? "bg-amber-50 text-amber-700"
                          : issue.status === "REJECTED"
                            ? "bg-red-50 text-red-700"
                            : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {getStatusLabel(issue.status)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Reported{" "}
                  {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card p-7">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Information
        </h2>

        <div className="mt-5 space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Full name</span>

            <span className="text-sm font-medium text-slate-800">
              {user.name}
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Email address</span>

            <span className="text-sm font-medium text-slate-800">
              {user.email}
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">Verification</span>

            <span className="text-sm font-medium text-slate-800">
              {user.isVerified ? "Verified account" : "Not verified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
