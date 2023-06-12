import React, { useState } from "react";

const InputComponent = ({
  validate,
}: {
  validate: (value: string) => string;
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: any) => {
    setValue(event.target.value);
    setError("");
  };

  const handleBlur = () => {
    const validationError = validate(value);
    setError(validationError);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default InputComponent;
