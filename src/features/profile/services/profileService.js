import { supabase } from "../../../services/supabase";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_SIZE = 512;

function getAvatarPath(userId) {
  return `${userId}/avatar.webp`;
}

function processAvatar(file) {
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

// GET MY PROFILE
export async function getMyProfile() {
  const { data, error } = await supabase.rpc("get_my_profile");

  if (error) {
    throw new Error(error.message);
  }

  return data;
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

// GET SIGNED AVATAR URL
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

// DELETE AVATAR FROM STORAGE
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
export async function updateProfile({
  fullName = null,
  phone = null,
  avatarPath = null,
  removeAvatar = false,
}) {
  const { data, error } = await supabase.rpc("update_my_profile", {
    p_full_name: fullName,
    p_phone: phone,
    p_avatar_path: avatarPath,
    p_remove_avatar: removeAvatar,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// REMOVE PROFILE AVATAR
export async function removeProfileAvatar(avatarPath) {
  if (!avatarPath) {
    throw new Error("Avatar not found.");
  }

  // Primeiro removemos a referência do avatar na base de dados.
  await updateProfile({
    removeAvatar: true,
  });

  // Depois removemos o ficheiro do Storage.
  await deleteAvatar(avatarPath);

  return true;
}

// UPDATE PASSWORD
export async function updatePassword(password) {
  if (!password) {
    throw new Error("Password is required.");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message);
  }
}


export function createCroppedImage(imageSrc, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");

      const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);

      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Unable to process the cropped image."));
        return;
      }

      context.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        size,
        size,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Unable to create the cropped image."));
            return;
          }

          resolve(blob);
        },
        "image/webp",
        0.85,
      );
    };

    image.onerror = () => {
      reject(new Error("Unable to load the image."));
    };

    image.src = imageSrc;
  });
}
