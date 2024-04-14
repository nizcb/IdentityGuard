export const Input = ({ type, name, label, value, onChange, ...rest }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={value || ""}
        onChange={onChange}
        aria-describedby="emailHelp"
        {...rest}
      />
    </div>
  );
};
