import React from 'react';
import "./FormInputField.css"

function FormInputField( {name, options, checked, type, id, label, defaultValue ,placeholder, register, errors, validation, readOnly, className, disabled, children, onInput} ) {
    // Inside your FormInputField component
    if (type === 'select') {
        return (
            <div>
                <label htmlFor={id}>{label}</label>
                <select id={id} name={name} {...register(name, validation)}>
                    <option value="" disabled selected>team</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {errors[name] && <p>{errors[name].message}</p>}
            </div>
        );
    } // continue with other input types handling

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