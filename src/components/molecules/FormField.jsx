import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  type = "input", 
  label, 
  value, 
  onChange, 
  error,
  options = [],
  ...props 
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  if (type === "select") {
    return (
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  if (type === "textarea") {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        {...props}
      />
    );
  }

  return (
    <Input
      type={type}
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      {...props}
    />
  );
};

export default FormField;