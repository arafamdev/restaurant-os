import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";

import Modal from "../../../ui/Modal";

function AvatarCropModal({ image, onClose, onCrop }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  function handleSave() {
    if (!croppedAreaPixels) return;
    onCrop(croppedAreaPixels);
  }

  return (
    <Modal
      onClose={onClose}
      size="medium"
      closeOnOverlayClick={false}
      closeOnEscape={false}
    >
      <div className="space-y-5 text-gray-900 dark:text-gray-100">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Adjust profile photo
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Drag the photo and zoom to choose exactly what you want to show.
          </p>
        </div>

        <div className="relative h-[320px] overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-gray-700">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            minZoom={1}
            maxZoom={3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="flex items-center gap-3">
          <HiOutlineMinus className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full cursor-pointer accent-emerald-600 dark:accent-emerald-500"
            aria-label="Zoom"
          />
          <HiOutlinePlus className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!croppedAreaPixels}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Use photo
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AvatarCropModal;
