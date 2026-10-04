function getInitials(name) {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function ProfileAvatar({ name, avatarUrl, size = "medium" }) {
  const initials = getInitials(name);

  const sizeClasses = {
    small: "h-9 w-9 text-xs",
    medium: "h-12 w-12 text-sm",
    large: "h-24 w-24 text-2xl",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-950 font-semibold tracking-tight text-white shadow-sm ring-1 ring-gray-950/5 ${sizeClasses[size]} `}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`${name || "User"} avatar`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default ProfileAvatar;
