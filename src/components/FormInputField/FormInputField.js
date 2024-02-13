import React from 'react';
import "./FormInputField.css"

function FormInputField( {name, checked, type, id, label, defaultValue ,placeholder, register, errors, validation, readOnly, className, disabled, children, onInput} ) {
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
                    disabled={disabled}
                    className={className}
                    {...register(name, validation)}
                    onInput={onInput}
                    checked={checked}
                />
            </label>
            {children}
            <p className="form-error-message">{errors[name] && errors[name].message}</p>
        </div>
    );
}

export default FormInputField;