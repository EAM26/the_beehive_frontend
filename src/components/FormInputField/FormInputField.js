import React from 'react';

function FormInputField( {name, type, id, label, placeholder, register} ) {
    return (
        <div>
            <label htmlFor={id}>
                {label}
                <input
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    {...register(name)}
                />
            </label>
        </div>
    );
}

export default FormInputField;