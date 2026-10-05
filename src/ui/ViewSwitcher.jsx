import {
  HiOutlineListBullet,
  HiOutlineSquares2X2,
  HiOutlineViewColumns,
} from "react-icons/hi2";

const defaultOptions = [
  {
    value: "list",
    label: "List",
    icon: HiOutlineListBullet,
  },
  {
    value: "compact",
    label: "Compact",
    icon: HiOutlineSquares2X2,
  },
  {
    value: "large",
    label: "Large",
    icon: HiOutlineViewColumns,
  },
];

function ViewSwitcher({ value, onChange, options = defaultOptions }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
      {options.map(({ value: optionValue, label, icon: Icon }) => {
        const isActive = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            title={`${label} view`}
            aria-label={`${label} view`}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4" />

            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ViewSwitcher;
