import { HiOutlineExclamationCircle } from "react-icons/hi2";

import BackButton from "./BackButton";

function ErrorMessage({
  message = "Something went wrong.",
  backLabel = "Go back",
  backTo,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
      <HiOutlineExclamationCircle className="mt-0.5 h-5 w-5 shrink-0" />

      <div>
        <p className="font-medium">Something went wrong</p>

        <p className="mt-1 text-sm text-red-600">{message}</p>

        <div className="mt-4">
          <BackButton label={backLabel} to={backTo} />
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
