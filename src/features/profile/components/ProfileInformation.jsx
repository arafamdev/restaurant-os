import { useState } from "react";

import {
  HiOutlineBuildingStorefront,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlineUser,
} from "react-icons/hi2";

import Modal from "../../../ui/Modal";

import { useUpdateProfile } from "../hooks/useUpdateProfile";

import ProfilePhoneInput from "./PhoneInput";

function ProfileInformation({ profile, roleLabel, restaurantLabel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullName, setFullName] = useState(profile?.full_name || "");

  const [phone, setPhone] = useState(profile?.phone || "");

  const { updateProfile, isPending } = useUpdateProfile();

  function handleOpenModal() {
    setFullName(profile?.full_name || "");
    setPhone(profile?.phone || "");
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    if (isPending) return;

    setIsModalOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      return;
    }

    updateProfile(
      {
        fullName: trimmedName,
        phone: phone || null,
        avatarPath: profile?.avatar_path || null,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      },
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-gray-950">
              Personal information
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your personal information associated with RestaurantOS.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
            Edit
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InfoItem
            icon={HiOutlineUser}
            label="Full name"
            value={profile?.full_name}
          />

          <InfoItem
            icon={HiOutlineEnvelope}
            label="Email"
            value={profile?.email}
          />

          <InfoItem
            icon={HiOutlinePhone}
            label="Phone"
            value={profile?.phone}
          />

          <InfoItem icon={HiOutlineUser} label="Role" value={roleLabel} />

          <InfoItem
            icon={HiOutlineBuildingStorefront}
            label="Restaurant"
            value={restaurantLabel}
          />
        </div>
      </section>

      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          size="medium"
          closeOnOverlayClick={!isPending}
          closeOnEscape={!isPending}
        >
          <div>
            <div className="flex items-start justify-between border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-gray-950">
                  Edit personal information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your name and phone number.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isPending}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 py-6">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="edit-full-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <HiOutlineUser className="pointer-events-none absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="edit-full-name"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      disabled={isPending}
                      required
                      autoFocus
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 transition outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:bg-gray-50"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="edit-phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>

                  <ProfilePhoneInput
                    value={phone}
                    onChange={setPhone}
                    disabled={isPending}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="edit-email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <HiOutlineEnvelope className="pointer-events-none absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="edit-email"
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm text-gray-500"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Email cannot be changed from this page.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isPending}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending || !fullName.trim()}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400">{label}</p>

        <p className="mt-1 truncate text-sm font-medium text-gray-900">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default ProfileInformation;
