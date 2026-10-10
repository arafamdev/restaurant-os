const iconStyles = {
  maskImage: "url('/icons/food-menu.svg')",
  WebkitMaskImage: "url('/icons/food-menu.svg')",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
  maskSize: "contain",
  WebkitMaskSize: "contain",
};

function FoodMenuIcon({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={iconStyles}
    />
  );
}

export default FoodMenuIcon;
