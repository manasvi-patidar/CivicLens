import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { IssueCategory } from "../../types/issue";
import { createIssue } from "../../services/issue.service";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function CreateIssuePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "">("");

  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
    latitude?: string;
    longitude?: string;
    image?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Please enter an issue title.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title cannot exceed 100 characters.";
    }

    if (!description.trim()) {
      newErrors.description = "Please describe the civic issue.";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    } else if (description.trim().length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters.";
    }

    if (!category) {
      newErrors.category = "Please select an issue category.";
    }

    if (!priority) {
      newErrors.priority = "Please select a priority.";
    }

    if (!latitude.trim()) {
      newErrors.latitude = "Latitude is required.";
    } else if (Number.isNaN(Number(latitude))) {
      newErrors.latitude = "Latitude must be a valid number.";
    }

    if (!longitude.trim()) {
      newErrors.longitude = "Longitude is required.";
    } else if (Number.isNaN(Number(longitude))) {
      newErrors.longitude = "Longitude must be a valid number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setErrors((current) => ({
      ...current,
      image: undefined,
    }));

    if (!file) {
      setImage(null);
      setImagePreview("");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImage(null);
      setImagePreview("");

      setErrors((current) => ({
        ...current,
        image: "Please select a JPG, PNG, or WebP image.",
      }));

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImage(null);
      setImagePreview("");

      setErrors((current) => ({
        ...current,
        image: "Image size must be less than 5 MB.",
      }));

      event.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");

    const input = document.getElementById("image") as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  const handleUseMyLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Location is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location permission was denied. You can enter the coordinates manually.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Your location could not be determined. Please enter the coordinates manually.",
            );
            break;

          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;

          default:
            setLocationError("Unable to determine your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError("");
    setSubmitSuccess("");

    if (!validate()) {
      return;
    }

    if (!category || !priority) {
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("priority", priority);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (address.trim()) {
        formData.append("address", address.trim());
      }

      if (image) {
        formData.append("image", image);
      }

      const response = await createIssue(formData);

      setSubmitSuccess("Issue created successfully!");

      setTimeout(() => {
        navigate(`/issues/${response.data.id}`);
      }, 700);
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

        setSubmitError(
          response?.data?.message ||
            "Unable to create the issue. Please try again.",
        );
      } else {
        setSubmitError("Unable to create the issue. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
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
              {description.length}/1000
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
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

          <div>
            <label htmlFor="priority" className="label">
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as "LOW" | "MEDIUM" | "HIGH" | "",
                )
              }
              className="input"
            >
              <option value="">Select priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="label">
            Address
          </label>

          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="e.g. MG Road, near City Mall"
            className="input"
          />

          <p className="mt-1 text-xs text-slate-400">Optional</p>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="label">Location</p>

            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locationLoading}
              className="text-sm font-medium text-teal-700 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {locationLoading ? "Getting location..." : "Use my location"}
            </button>
          </div>

          <p className="mb-4 text-xs text-slate-400">
            Automatically detect your current coordinates or enter them
            manually.
          </p>

          {locationError && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {locationError}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="latitude" className="text-sm text-slate-600">
                Latitude
              </label>

              <input
                id="latitude"
                type="text"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="e.g. 28.6139"
                className="input mt-1"
              />

              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
              )}
            </div>

            <div>
              <label htmlFor="longitude" className="text-sm text-slate-600">
                Longitude
              </label>

              <input
                id="longitude"
                type="text"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="e.g. 77.2090"
                className="input mt-1"
              />

              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="label">Evidence image</p>

          {!imagePreview ? (
            <label
              htmlFor="image"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-teal-300 hover:bg-teal-50/30"
            >
              <span className="text-sm font-medium text-slate-700">
                Choose an image
              </span>

              <span className="mt-1 text-xs text-slate-400">
                JPG, PNG or WebP · Maximum 5 MB
              </span>

              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="rounded-lg border border-slate-200 p-3">
              <img
                src={imagePreview}
                alt="Selected issue"
                className="mx-auto max-h-72 rounded-lg object-contain"
              />

              <div className="mt-3 flex items-center justify-between">
                <p className="truncate text-sm text-slate-500">{image?.name}</p>

                <button
                  type="button"
                  onClick={removeImage}
                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        {submitSuccess && (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
            {submitSuccess}
          </div>
        )}

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <Link to="/issues" className="btn btn-secondary">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating issue..." : "Create Issue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateIssuePage;
