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

    const combinedClassNameText = `text-form-field ${className || ''}`;
    const combinedClassNameSelect = `select-form-field ${className || ''}`;
    if (type === 'select') {
        return (
            <div>
            <div className={combinedClassNameSelect}>
                <label htmlFor={id}>{label}</label>
                <select id={id} name={name} {...register(name, validation)} defaultValue="">
                    <option value="" disabled>{defaultName}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>

            </div>
        {errors[name] && <p className="error-message">{errors[name].message}</p>}
            </div>
        );
    }

    return (
        <div>
            <div className={combinedClassNameText}>
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
            {errors[name] && <p className="error-message">{errors[name].message}</p>}

        </div>
    );
}

export default FormInputField;