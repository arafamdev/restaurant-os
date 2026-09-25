import { NavLink } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

import Button from "./Button";

const BackButton = () => {
  return (
    <NavLink to="/tables">
      <Button variation="secondary" size="small">
        <IoMdArrowBack className="mr-1 h-5 w-5" /> Back to tables
      </Button>
    </NavLink>
  );
};

export default BackButton;
