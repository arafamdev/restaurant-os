import Input from "../../../ui/Input";
import Select from "../../../ui/Select";

function formatGroupLabel(group) {
  return group
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function MenuFilters({
  search,
  group,
  categoryId,
  status,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}) {
  const categoryOptions = [
    {
      value: "all",
      label:
        group === "all"
          ? "All categories"
          : `All ${formatGroupLabel(group).toLowerCase()} categories`,
    },
    ...categories
      .filter((category) => group === "all" || category.group_type === group)
      .map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
  ];

  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Input
        type="search"
        placeholder="Search menu..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <Select
        value={categoryId}
        onChange={onCategoryChange}
        options={categoryOptions}
      />

      <Select
        value={status}
        onChange={onStatusChange}
        options={statusOptions}
      />
    </div>
  );
}

export default MenuFilters;
