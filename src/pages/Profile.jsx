import { HiOutlineCheckCircle } from "react-icons/hi2";

import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

import AvatarUpload from "../features/profile/components/AvatarUpload";
import ProfileAvatar from "../features/profile/components/ProfileAvatar";
import ProfileInformation from "../features/profile/components/ProfileInformation";
import PasswordForm from "../features/profile/components/PasswordForm";

import { useProfile } from "../features/profile/hooks/useProfile";
import { useAvatarUrl } from "../features/profile/hooks/useAvatarUrl";

function formatRole(roleName, isPlatformAdmin) {
  if (isPlatformAdmin) {
    return "Platform Admin";
  }

  if (!roleName) {
    return "Not assigned";
  }

  return roleName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function Profile() {
  const { profile, isLoading, error } = useProfile();

  const { avatarUrl, isLoading: isAvatarLoading } = useAvatarUrl(
    profile?.avatar_path,
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message}
        backLabel="Back to Dashboard"
        backTo="/dashboard"
      />
    );
  }

  const isPlatformAdmin = Boolean(profile?.is_platform_admin);

  const roleLabel = formatRole(profile?.role_name, isPlatformAdmin);

  const restaurantLabel =
    profile?.restaurant_name ||
    (isPlatformAdmin ? "Platform Account" : "Not assigned");

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-xl font-medium text-gray-400">Account</p>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          Manage your personal information, profile photo and account security.
        </p>
      </div>

      {/* Profile hero */}
      <section className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm">
        <div className="h-24 bg-gray-900" />

        <div className="px-6 pb-6 md:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="rounded-full bg-white p-1.5 shadow-md">
              <div className="relative">
                <ProfileAvatar
                  name={profile?.full_name}
                  avatarUrl={isAvatarLoading ? null : avatarUrl}
                  size="large"
                />

                <span className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
              </div>
            </div>

            <div className="pb-1">
              <h3 className="text-xl font-bold tracking-tight text-gray-950">
                {profile?.full_name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">{profile?.email}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                  {roleLabel}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile photo */}
      {!isAvatarLoading && (
        <AvatarUpload profile={profile} avatarUrl={avatarUrl} />
      )}

      {/* Personal information */}
      <ProfileInformation
        profile={profile}
        roleLabel={roleLabel}
        restaurantLabel={restaurantLabel}
      />

      {/* Account */}
      <section className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm md:p-8">
        <div className="border-b border-gray-100 pb-5">
          <h3 className="text-lg font-semibold tracking-tight text-gray-950">
            Account
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Information about your RestaurantOS account.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Account status
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your account is currently active.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <HiOutlineCheckCircle className="h-4 w-4" />
              Active
            </span>
          </div>

          {/* Workspace */}
          <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Workspace</p>

              <p className="mt-1 text-xs text-gray-500">
                Your current RestaurantOS workspace.
              </p>
            </div>

            <span className="max-w-48 truncate text-sm font-medium text-gray-700">
              {restaurantLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Security */}
      <PasswordForm />
    </div>
  );
}

export default Profile;
