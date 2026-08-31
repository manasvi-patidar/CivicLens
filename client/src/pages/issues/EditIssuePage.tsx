import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getIssueById, updateIssue } from "../../services/issue.service";
import type { Issue, IssueCategory } from "../../types/issue";

const categories: IssueCategory[] = [
  "ROAD",
  "WATER",
  "ELECTRICITY",
  "GARBAGE",
  "STREETLIGHT",
  "DRAINAGE",
  "PUBLIC_PROPERTY",
  "OTHER",
];

const priorities = ["LOW", "MEDIUM", "HIGH"] as const;

function EditIssuePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<Issue | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory>("OTHER");
  const [priority, setPriority] =
    useState<(typeof priorities)[number]>("MEDIUM");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setPriority(data.priority);
        setAddress(data.address || "");
        setLatitude(String(data.latitude));
        setLongitude(String(data.longitude));
      } catch {
        setError("Unable to load this issue.");
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setError("Invalid issue.");
      return;
    }

    if (!title.trim() || title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }

    const latitudeNumber = Number(latitude);
    const longitudeNumber = Number(longitude);

    if (!Number.isFinite(latitudeNumber) || !Number.isFinite(longitudeNumber)) {
      setError("Latitude and longitude must be valid numbers.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateIssue(id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        address: address.trim(),
        latitude: latitudeNumber,
        longitude: longitudeNumber,
      });

      navigate(`/issues/${id}`);
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

        setError(response?.data?.message || "Unable to update this issue.");
      } else {
        setError("Unable to update this issue.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="card p-8">
          <p className="text-muted">Loading issue...</p>
        </div>
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="card p-8">
          <h1 className="text-xl font-semibold text-slate-900">
            Unable to edit issue
          </h1>

          <p className="text-muted mt-2">{error}</p>

          <Link to="/issues" className="btn btn-secondary mt-6">
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to={`/issues/${id}`}
          className="inline-flex items-center text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to Issue
        </Link>

        <p className="mt-5 text-sm font-medium text-teal-700">
          Issue Management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Edit Issue
        </h1>

        <p className="text-muted mt-2">
          Update the details of your civic issue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-7">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700"
            >
              Issue title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="input mt-2 w-full"
              placeholder="Enter issue title"
              disabled={saving}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              className="input mt-2 w-full resize-none"
              placeholder="Describe the civic issue"
              disabled={saving}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as IssueCategory)
                }
                className="input mt-2 w-full"
                disabled={saving}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as (typeof priorities)[number])
                }
                className="input mt-2 w-full"
                disabled={saving}
              >
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <input
              id="address"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="input mt-2 w-full"
              placeholder="Enter location address"
              disabled={saving}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-slate-700"
              >
                Latitude
              </label>

              <input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                className="input mt-2 w-full"
                placeholder="e.g. 28.6139"
                disabled={saving}
              />
            </div>

            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-slate-700"
              >
                Longitude
              </label>

              <input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                className="input mt-2 w-full"
                placeholder="e.g. 77.2090"
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <Link
            to={`/issues/${id}`}
            className="btn btn-secondary justify-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditIssuePage;
