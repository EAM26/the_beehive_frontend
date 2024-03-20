import React from 'react';
import "./FormInputField.css"


function FormInputField({
                            name,
                            options,
                            checked,
                            type,
                            id,
                            label,
                            defaultValue,
                            placeholder,
                            register,
                            errors,
                            validation,
                            readOnly,
                            className,
                            children,
                            onInput,
                            defaultName,
                            disabled
                        }) {

    const combinedClassName = `text-form-field ${className || ''}`;
    if (type === 'select') {
        return (
            <div className={className}>
                <label htmlFor={id}>{label}</label>
                <select id={id} name={name} {...register(name, validation)}>
                    <option value="" disabled selected>{defaultName}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {errors[name] && <p className="error-message">{errors[name].message}</p>}
            </div>
        );
    }

    return (
        <div>
            <div className={combinedClassName}>
                <label htmlFor={id}>
                    {label}
                </label>
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
                {children}
            </div>
            {errors ? <p className="error-message">{errors[name] && errors[name].message}</p>: null}

        </div>
    );
}

export default FormInputField;