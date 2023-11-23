import React from 'react';


function FormInputField( {name, type, id, label, placeholder, register, errors, validation} ) {
    return (
        <div>
            <label htmlFor={id}>
                {label}
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    {...register(name, validation)}
                />
            </label>
            <p className="form-error-message">{errors[name] && errors[name].message}</p>
        </div>
    );
}

export default FormInputField;