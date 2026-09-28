import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

import Button from "./Button";

function BackButton({ label = "Go back", to }) {
  const navigate = useNavigate();

  function handleClick() {
    if (to) {
      navigate(to);
      return;
    }

    navigate(-1);
  }

  return (
    <Button variation="secondary" size="small" onClick={handleClick}>
      <IoMdArrowBack className="mr-1 h-5 w-5" /> {label}{" "}
    </Button>
  );
}
export default BackButton;
