import { useEffect, useRef, useState } from "react";
import {
  HiOutlineCamera,
  HiOutlinePhoto,
  HiOutlineTrash,
} from "react-icons/hi2";
import toast from "react-hot-toast";

import ConfirmModal from "../../../ui/ConfirmModal";
import ProfileAvatar from "./ProfileAvatar";
import AvatarCropModal from "./AvatarCropModal";
import { useUploadAvatar } from "../hooks/useUploadAvatar";
import { useRemoveAvatar } from "../hooks/useRemoveAvatar";
import { createCroppedImage } from "../services/profileService";

function AvatarUpload({ profile, avatarUrl }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cropImageUrl, setCropImageUrl] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const { uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { removeAvatar, isPending: isRemoving } = useRemoveAvatar();

  const isPending = isUploading || isRemoving;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (cropImageUrl) URL.revokeObjectURL(cropImageUrl);
    };
  }, [cropImageUrl]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    setCropImageUrl(URL.createObjectURL(file));
  }

  function handleSelectPhoto() {
    if (isPending) return;
    inputRef.current?.click();
  }

  async function handleCrop(croppedAreaPixels) {
    if (!cropImageUrl) return;

    try {
      const croppedBlob = await createCroppedImage(
        cropImageUrl,
        croppedAreaPixels,
      );

      const croppedFile = new File([croppedBlob], "profile-avatar.webp", {
        type: "image/webp",
      });

      setSelectedFile(croppedFile);
      setPreviewUrl(URL.createObjectURL(croppedBlob));
      setCropImageUrl(null);
    } catch (error) {
      toast.error(error.message || "Unable to crop this photo.");
    }
  }

  function handleCancelCrop() {
    setCropImageUrl(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleUpload() {
    if (!selectedFile || isPending) return;

    uploadAvatar(
      {
        userId: profile.user_id,
        file: selectedFile,
        profile,
      },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setPreviewUrl(null);

          if (inputRef.current) {
            inputRef.current.value = "";
          }
        },
      },
    );
  }

  function handleRemovePhoto() {
    if (isPending || !profile?.avatar_path) return;
    setIsRemoveModalOpen(true);
  }

  function handleConfirmRemove() {
    if (!profile?.avatar_path || isPending) return;

    removeAvatar(profile.avatar_path, {
      onSuccess: () => {
        setIsRemoveModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    });
  }

  const displayedAvatarUrl = previewUrl || avatarUrl;

  return (
    <>
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-700/80 dark:bg-[#111827]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative w-fit">
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
              className="absolute right-0 bottom-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#111827]"
            >
              <HiOutlineCamera className="h-4 w-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Profile photo
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Upload a photo that will be used across RestaurantOS.
            </p>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              JPEG, PNG or WebP
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSelectPhoto}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <HiOutlinePhoto className="h-5 w-5" />
                {selectedFile ? "Choose another" : "Choose photo"}
              </button>

              {selectedFile && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isPending}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Save photo"}
                </button>
              )}

              {profile?.avatar_path && !selectedFile && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <HiOutlineTrash className="h-5 w-5" />
                  {isRemoving ? "Removing..." : "Remove photo"}
                </button>
              )}
            </div>

            {selectedFile && (
              <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-400">
                Photo adjusted and ready to upload.
              </p>
            )}
          </div>
        </div>
      </section>

      {cropImageUrl && (
        <AvatarCropModal
          image={cropImageUrl}
          onClose={handleCancelCrop}
          onCrop={handleCrop}
        />
      )}

      <ConfirmModal
        open={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove profile photo?"
        description="Are you sure you want to remove your profile photo? Your avatar will be replaced by your initials."
        confirmText="Remove photo"
        cancelText="Cancel"
        isLoading={isRemoving}
      />
    </>
  );
}

export default AvatarUpload;
