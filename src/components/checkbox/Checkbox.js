// In Checkbox.js
import React from 'react';

const Checkbox = React.forwardRef(({ label, name, defaultChecked, onChange }, ref) => {
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    name={name}
                    defaultChecked={defaultChecked}
                    onChange={onChange}
                    ref={ref}
                />
                {label}
            </label>
        </div>
    );
});

export default Checkbox;
