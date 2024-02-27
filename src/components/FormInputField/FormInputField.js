import React from 'react';
import "./FormInputField.css"

function FormInputField( {name, options, checked, type, id, label, defaultValue ,placeholder, register, errors, validation, readOnly, className, children, onInput,  defaultName, disabled} ) {

    if (type === 'select') {
        return (
            <div>
                <label htmlFor={id}>{label}</label>
                <select id={id} name={name} {...register(name, validation)}>
                    <option value="" disabled selected>{defaultName}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {errors[name] && <p>{errors[name].message}</p>}
            </div>
        );
    }

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
                    className={className}
                    {...register(name, validation)}
                    onInput={onInput}
                    checked={checked}
                    disabled={disabled}

                />
            </label>

            {children}
            <p className="error-message">{errors[name] && errors[name].message}</p>
        </div>
    );
}

export default FormInputField;