import React from 'react';


function FormInputField( {name, type, id, label, defaultValue ,placeholder, register, errors, validation, readOnly, children} ) {
    return (
        <div>
            <label htmlFor={id}>
                {label}
                <input
                    type={type}
                    id={id}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    {...register(name, validation)}
                />
            </label>
            {children}
            <p className="form-error-message">{errors[name] && errors[name].message}</p>
        </div>
    );
}

export default FormInputField;