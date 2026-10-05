import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import CountrySelect from "./CountrySelect";

function ProfilePhoneInput({
  value,
  onChange,
  disabled = false,
  defaultCountry = "PT",
}) {
  return (
    <div className="profile-phone-input">
      <PhoneInput
        international
        defaultCountry={defaultCountry}
        countryCallingCodeEditable={false}
        value={value || undefined}
        onChange={onChange}
        disabled={disabled}
        placeholder="Phone number"
        countrySelectComponent={CountrySelect}
      />
    </div>
  );
}

export default ProfilePhoneInput;
