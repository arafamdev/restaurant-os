import { useEffect, useRef, useState } from "react";

import { HiOutlineCamera, HiOutlinePhoto } from "react-icons/hi2";

import ProfileAvatar from "./ProfileAvatar";
import { useUploadAvatar } from "../hooks/useUploadAvatar";

function AvatarUpload({ profile, avatarUrl }) {
  const inputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { uploadAvatar, isPending, error } = useUploadAvatar();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPEG, PNG, or WebP image.");

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
  }

  function handleSelectPhoto() {
    if (isPending) {
      return;
    }

    inputRef.current?.click();
  }

  function handleUpload() {
    if (!selectedFile || isPending) {
      return;
    }

    uploadAvatar({
      userId: profile.user_id,
      file: selectedFile,
      profile,
    });
  }

  const displayedAvatarUrl = previewUrl || avatarUrl;

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative">
          <ProfileAvatar
            name={profile?.full_name}
            avatarUrl={displayedAvatarUrl}
            size="large"
          />

          <button
            type="button"
            onClick={handleSelectPhoto}
            disabled={isPending}
            aria-label="Change profile photo"
            className="absolute right-0 bottom-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiOutlineCamera className="h-4 w-4" />
          </button>
        </div>

        {/* Information */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Profile photo</h3>

          <p className="mt-1 text-sm text-gray-500">
            Upload a photo that will be used across RestaurantOS.
          </p>

          <p className="mt-2 text-xs text-gray-400">JPEG, PNG or WebP</p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSelectPhoto}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <HiOutlinePhoto className="h-5 w-5" />

              {selectedFile ? "Choose another" : "Choose photo"}
            </button>

            {selectedFile && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={isPending}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Uploading..." : "Save photo"}
              </button>
            )}
          </div>

          {/* Selected file */}
          {selectedFile && (
            <p className="mt-3 text-xs text-gray-500">
              Selected: {selectedFile.name}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="mt-3 text-sm text-red-600">{error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvatarUpload;
