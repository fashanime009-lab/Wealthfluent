import PropTypes from "prop-types";
import { useId } from "react";

export default function NumberField({
  label,
  value,
  onChange,
  placeholder = "",
  min = 0,
  required = false,
}) {
  const inputId = useId();
  return (
    <div className="space-y-3">
      <label
  htmlFor={inputId}
  className="block text-sm font-medium text-[var(--text)]"
>
        {label}
      </label>

      <input
       
        id={inputId}
name={inputId}
 type="number"
inputMode="decimal"
autoComplete="off"
        min={min}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="
          w-full
          border
          border-[#111814]/15
          bg-transparent
          px-5
          py-4
          font-mono-tech
          text-lg
          text-[var(--text)]
          outline-none
          transition
          focus:border-[#047857]
          dark:border-[#eef1ec]/15
          dark:focus:border-[#34d399]
        "
      />
    </div>
  );
}

NumberField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  min: PropTypes.number,
  required: PropTypes.bool,
};