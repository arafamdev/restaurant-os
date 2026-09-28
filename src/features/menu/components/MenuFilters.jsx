import Select from "../../../ui/Select";

function MenuFilters({
  group,
  categoryId,
  status,
  categories,
  onGroupChange,
  onCategoryChange,
  onStatusChange,
}) {
  const categoryOptions = [
    {
      value: "all",
      label: "All categories",
    },
    ...categories
      .filter((category) =>
        group === "all" ? true : category.group_type === group,
      )
      .map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Select
        value={group}
        onChange={onGroupChange}
        options={[
          { value: "all", label: "All" },
          { value: "food", label: "Food" },
          { value: "drink", label: "Drinks" },
        ]}
      />

      <Select
        value={categoryId}
        onChange={onCategoryChange}
        options={categoryOptions}
      />

      <Select
        value={status}
        onChange={onStatusChange}
        options={[
          { value: "all", label: "All statuses" },
          { value: "available", label: "Available" },
          { value: "unavailable", label: "Unavailable" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </div>
  );
}

export default MenuFilters;
