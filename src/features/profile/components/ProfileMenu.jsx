import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown,
} from "react-icons/hi2";

import useAuth from "../../auth/hooks/useAuth";
import { useCurrentUserContext } from "../../auth/hooks/useCurrentUserContext";
import { useProfile } from "../hooks/useProfile";
import { useAvatarUrl } from "../hooks/useAvatarUrl";
import ProfileAvatar from "./ProfileAvatar";
import useOutsideClick from "../../../hooks/useOutsideClick";

function formatRole(roleName) {
  if (!roleName) return "";

  return roleName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const { logout, isLoading: isLogoutLoading } = useAuth();

  const { userContext, isLoading: isUserContextLoading } =
    useCurrentUserContext();

  const { profile, isLoading: isProfileLoading } = useProfile();

  const { avatarUrl, isLoading: isAvatarLoading } = useAvatarUrl(
    profile?.avatar_path,
  );

  const menuRef = useOutsideClick(() => {
    setIsOpen(false);
  });

  const isLoading = isUserContextLoading || isProfileLoading || isAvatarLoading;

  const displayName = userContext?.full_name || profile?.full_name || "User";

  const email = userContext?.email || profile?.email || "";

  const isPlatformAdmin = Boolean(
    userContext?.is_platform_admin || profile?.is_platform_admin,
  );

  const roleLabel = isPlatformAdmin
    ? "Platform Admin"
    : formatRole(userContext?.role_name || profile?.role_name);

  function toggleMenu() {
    setIsOpen((open) => !open);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  async function handleLogout() {
    closeMenu();
    await logout();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={toggleMenu}
        disabled={isLogoutLoading}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        className={`group flex items-center gap-2 rounded-xl p-1.5 transition-colors ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isLoading ? (
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        ) : (
          <div className="relative">
            <ProfileAvatar
              name={displayName}
              avatarUrl={avatarUrl}
              size="small"
            />
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#111827]" />
          </div>
        )}

        <div className="hidden max-w-40 text-left sm:block">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {isLoading ? "Loading..." : displayName}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {isLoading ? "" : roleLabel}
          </p>
        </div>

        <HiOutlineChevronDown
          className={`hidden h-4 w-4 text-gray-500 transition-transform sm:block dark:text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-3 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-950/10 dark:border-gray-700 dark:bg-[#111827] dark:shadow-black/30">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-[#1F2937]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ProfileAvatar
                  name={displayName}
                  avatarUrl={avatarUrl}
                  size="medium"
                />
                <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#1F2937]" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  {email}
                </p>

                {roleLabel && (
                  <span className="mt-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {roleLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-white group-hover:text-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-gray-700 dark:group-hover:text-gray-100">
                <HiOutlineUserCircle className="h-5 w-5" />
              </span>

              <div>
                <p>My Profile</p>
                <p className="mt-0.5 text-xs font-normal text-gray-500 dark:text-gray-400">
                  Manage your personal information
                </p>
              </div>
            </Link>
          </div>

          <div className="border-t border-gray-200 p-2 dark:border-gray-700">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
              </span>

              <div className="text-left">
                <p>{isLogoutLoading ? "Logging out..." : "Logout"}</p>
                <p className="mt-0.5 text-xs font-normal text-red-500/70 dark:text-red-400/70">
                  End your current session
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
