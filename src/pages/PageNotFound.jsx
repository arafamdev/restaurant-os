import { Link } from "react-router-dom";
import BackButton from "../ui/BackButton";

function PageNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold tracking-wide text-emerald-600 uppercase">
        Error 404
      </p>

      <h1 className="mt-2 text-4xl font-semibold text-gray-900">
        Page not found
      </h1>

      <p className="mt-3 mb-5 max-w-md text-sm text-gray-500">
        The page you are looking for does not exist or may have been moved.
      </p>

      <BackButton />

      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default PageNotFound;
