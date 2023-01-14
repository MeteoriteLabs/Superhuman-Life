
const ToggleSwitchButton = ({
  id,
  name,
  value,
  onChange,
  disabled,
  label,
  defaultChecked,
}) => (
    <div className="mb-3 d-flex">
      <p className='mb-0 mr-3'>{label}</p>
      <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        value={value}
        disabled={disabled}
        name={name}
        onChange={onChange}
        defaultChecked={defaultChecked}
      />
      </div>
    </div>
);

export default ToggleSwitchButton;
