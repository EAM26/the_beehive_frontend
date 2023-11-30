import React from 'react';


function FormInputField( {name, type, id, label, defaultValue ,placeholder, register, errors, validation} ) {
    return (
        <div>
            <label htmlFor={id}>
                {label}
                <input
                    type={type}
                    id={id}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    {...register(name, validation)}
                />
            </label>
            <p className="form-error-message">{errors[name] && errors[name].message}</p>
        </div>
    );
}

export default FormInputField;