import { supabase } from "../../../services/supabase";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 512;

// GET AVATAR PATH
function getAvatarPath(userId) {
  return `${userId}/avatar.webp`;
}

// COMPRESS AND RESIZE AVATAR
async function processAvatar(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");

      const { width, height } = image;

      const scale = Math.min(
        MAX_AVATAR_SIZE / width,
        MAX_AVATAR_SIZE / height,
        1,
      );

      const newWidth = Math.round(width * scale);
      const newHeight = Math.round(height * scale);

      canvas.width = newWidth;
      canvas.height = newHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Unable to process the avatar image."));

        return;
      }

      context.drawImage(image, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Unable to compress the avatar image."));

            return;
          }

          resolve(blob);
        },
        "image/webp",
        0.85,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(new Error("Unable to read the selected image."));
    };

    image.src = objectUrl;
  });
}

// UPLOAD AVATAR
export async function uploadAvatar(userId, file) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!file) {
    throw new Error("Avatar file is required.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed.");
  }

  const processedAvatar = await processAvatar(file);

  const filePath = getAvatarPath(userId);

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, processedAvatar, {
      upsert: true,
      contentType: "image/webp",
      cacheControl: "3600",
    });

  if (error) {
    throw new Error(error.message);
  }

  return filePath;
}

// GET AVATAR URL
export async function getAvatarUrl(filePath) {
  if (!filePath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    throw new Error(error.message);
  }

  return data?.signedUrl ?? null;
}

// DELETE AVATAR
export async function deleteAvatar(filePath) {
  if (!filePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove([filePath]);

  if (error) {
    throw new Error(error.message);
  }
}

// UPDATE PROFILE
export async function updateProfile({ fullName, phone, avatarPath }) {
  const { data, error } = await supabase.rpc("update_my_profile", {
    p_full_name: fullName,
    p_phone: phone,
    p_avatar_path: avatarPath,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
