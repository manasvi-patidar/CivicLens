import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import type { IssueCategory } from "../../types/issue";

function CreateIssuePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Please enter an issue title.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    }

    if (!description.trim()) {
      newErrors.description = "Please describe the civic issue.";
    } else if (description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters.";
    }

    if (!category) {
      newErrors.category = "Please select an issue category.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    // Backend integration will be added in Segment 5B.
  };

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <Link
          to="/issues"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Back to Issues
        </Link>

        <p className="mt-6 text-sm font-medium text-teal-700">
          Community reporting
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Report an Issue
        </h1>

        <p className="text-muted mt-2">
          Help your community by reporting a civic issue that needs attention.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-7">
        <div>
          <label htmlFor="title" className="label">
            Issue title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Large pothole near main road"
            className="input"
          />

          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the issue clearly so that others can understand what is happening..."
            rows={6}
            className="input resize-none"
          />

          <div className="mt-1 flex justify-between">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <span />
            )}

            <span className="text-xs text-slate-400">
              {description.length} characters
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="label">
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as IssueCategory | "")
            }
            className="input"
          >
            <option value="">Select a category</option>
            <option value="ROAD">Road</option>
            <option value="WATER">Water</option>
            <option value="ELECTRICITY">Electricity</option>
            <option value="GARBAGE">Garbage</option>
            <option value="STREETLIGHT">Streetlight</option>
            <option value="DRAINAGE">Drainage</option>
            <option value="PUBLIC_PROPERTY">Public Property</option>
            <option value="OTHER">Other</option>
          </select>

          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Location</p>

          <p className="mt-1 text-sm text-slate-500">
            Location selection will be added in the next part of the reporting
            workflow.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Evidence image</p>

          <p className="mt-1 text-sm text-slate-500">
            Image upload will be connected after the basic form is working.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <Link to="/issues" className="btn btn-secondary">
            Cancel
          </Link>

          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateIssuePage;
