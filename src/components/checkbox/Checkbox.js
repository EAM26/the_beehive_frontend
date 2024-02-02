const Checkbox = ({ label, checked, onChange, name }) => (
    <div><label>
        {label}:
        <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
        />
    </label></div>
);

export default Checkbox;
