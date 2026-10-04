import { useState } from "react";
import { Link } from "react-router-dom";

import {
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown,
} from "react-icons/hi2";

import useAuth from "../../auth/hooks/useAuth";

import { useProfile } from "../hooks/useProfile";
import { useAvatarUrl } from "../hooks/useAvatarUrl";

import ProfileAvatar from "./ProfileAvatar";

function formatRole(roleName) {
  if (!roleName) {
    return "";
  }

  return roleName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const { logout, isLoading: isLogoutLoading } = useAuth();

  const { profile, isLoading: isProfileLoading } = useProfile();

  const { avatarUrl, isLoading: isAvatarLoading } = useAvatarUrl(
    profile?.avatar_path,
  );

  const isLoading = isProfileLoading || isAvatarLoading;

  const displayName = profile?.full_name || "User";

  const roleLabel = formatRole(profile?.role_name);

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
    <div className="relative">
      {/* Profile trigger */}
      <button
        type="button"
        onClick={toggleMenu}
        disabled={isLogoutLoading}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        className={`group flex items-center gap-2 rounded-xl p-1.5 transition-all ${
          isOpen ? "bg-gray-100" : "hover:bg-gray-100"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {/* Avatar */}
        {isLoading ? (
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
        ) : (
          <div className="relative">
            <ProfileAvatar
              name={displayName}
              avatarUrl={avatarUrl}
              size="small"
            />

            {/* Online indicator */}
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
        )}

        {/* User information */}
        <div className="hidden max-w-32 text-left sm:block">
          <p className="truncate text-sm font-semibold text-gray-900">
            {isLoading ? "Loading..." : displayName}
          </p>

          <p className="truncate text-xs text-gray-500">
            {isLoading ? "" : roleLabel}
          </p>
        </div>

        <HiOutlineChevronDown
          className={`hidden h-4 w-4 text-gray-400 transition-transform sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl shadow-gray-950/10">
          {/* Profile summary */}
          <div className="bg-gray-50/80 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ProfileAvatar
                  name={displayName}
                  avatarUrl={avatarUrl}
                  size="medium"
                />

                <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-950">
                  {displayName}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {profile?.email}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-gray-900 px-2.5 py-1 text-[10px] font-semibold text-white">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-white group-hover:text-gray-950">
                <HiOutlineUserCircle className="h-5 w-5" />
              </span>

              <div>
                <p>My Profile</p>
                <p className="mt-0.5 text-xs font-normal text-gray-400">
                  Manage your personal information
                </p>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 p-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
              </span>

              <div className="text-left">
                <p>{isLogoutLoading ? "Logging out..." : "Logout"}</p>

                <p className="mt-0.5 text-xs font-normal text-red-400">
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
