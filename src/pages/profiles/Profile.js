import React, {useEffect, useState} from 'react';
import {getSelf} from "../../service";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import Checkbox from "../../components/checkbox/Checkbox";

function Profile() {
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const [self, setSelf] = useState(null);
    // const [testBoolean, setTestBoolean] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchSelfData = async () => {
            try {
                const selfData = await getSelf(token);
                setSelf(selfData);
                // setTestBoolean(!selfData.isDeleted);
            } catch (e) {
                console.error(e);
            }
        };

        void fetchSelfData();
    }, []);

    useEffect(() => {
        if (self) {
            setIsDeleted(self.isDeleted);
            setIsActive(self.employee.isActive)
        }
    }, [self]);

    const handleIsDeletedChange = (event) => {
        setIsDeleted(!event.target.checked);
    };

    const handleIsActiveChange = (event) => {
        setIsActive(event.target.checked);
    };

    const handleFormSubmitUser = (formData) => {
        const dataToSubmit = {
            ...formData,
            isDeleted, // add isDeleted to the formData
            isActive, // add isActive to the formData
        };
        console.log("Form Data:", dataToSubmit);
        // Here you would send the dataToSubmit to the server
    };

    // const handleFormSubmitUser = (formData) => {
    //     const dataToSubmit = {
    //         ...formData,
    //         isActive, // add isActive to the formData
    //     };
    //     console.log("Form Data:", dataToSubmit);
    //     // Here you would send the dataToSubmit to the server
    // };

    if (!self) {
        return <div>Loading...</div>;
    }

    // function handleFormSubmitUser(formData) {
    //     console.log("Formdata")
    //     console.log(formData)
    // }

    return (
        <main>
            {/*<p>User name: {self.username}</p>*/}
            {/*<p>Email: {self.email}</p>*/}
            {/*<p>Password: [protected]</p>*/}
            {/*/!*<p>User deleted: {testBoolean ? "No" : "Yes"}</p>*!/*/}

            <form
                onSubmit={handleSubmit(handleFormSubmitUser)}>
                <FormInputField
                    label="User name"
                    name="username"
                    type="text"
                    id="username"
                    register={register}
                    errors={errors}
                    defaultValue={self ? self.username : ""}
                />
                <Checkbox
                    label="User Not Deleted"
                    name="isDeleted"
                    checked={!isDeleted}
                    onChange={handleIsDeletedChange}
                />
                <FormInputField
                    label="Employee id"
                    name="empId"
                    type="text"
                    id="empId"
                    register={register}
                    errors={errors}
                    defaultValue={self ? self.employee.id : ""}
                />
                <Checkbox
                    label="Employee Active"
                    name="isActive"
                    checked={isActive}
                    onChange={handleIsActiveChange}
                />

                <Button type="submit" children="Opslaan"/>
            </form>
        </main>
    );
}

export default Profile;

// import React, {useEffect, useState} from 'react';
// import {useForm} from "react-hook-form";
// import {getSelf} from "../../service";
// import {errorHandler} from "../../helpers/errorHandler";
//
// function Profile() {
//
//     const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
//
//     const [self, setSelf] = useState(null)
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState(false);
//     const [errorMessage, setErrormessage] = useState("")
//     const [testBoolean, setTestBoolean] = useState(null)
//     const [testEmail, setTestEmail] = useState(null)
//
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//
//         const fetchSelfData = async () => {
//             // setLoading(true);
//             try {
//                 const selfData = await getSelf(token);
//                 setSelf(selfData);
//                 setTestBoolean(selfData.isDeleted);
//                 setTestEmail(selfData.email);
//             } catch (e) {
//                 console.log(e)
//                 setError(true);
//                 setErrormessage(errorHandler(e));
//             } finally {
//                 setLoading(false);
//             }
//         }
//         void fetchSelfData(self)
//
//
//
//
//     }, []);
//
//     return (
//         <main>
//         {/*    <label>*/}
//         {/*    Test Boolean Checkbox*/}
//         {/*    <input*/}
//         {/*        type="checkbox"*/}
//         {/*        checked={!testBoolean}*/}
//         {/*        onChange={() => {*/}
//         {/*        }}*/}
//         {/*    />*/}
//         {/*</label>*/}
//             <p>{self? self.username: "nog niets"}</p>
//             <p>{self? testBoolean: "nog niets"}</p>
//             <p>{self? testEmail: "nog niets"}</p>
//         </main>
//     );
// }
//
// export default Profile;
//
// // import React, {useEffect, useState} from 'react';
// // import {getSelf} from "../../service";
// // import {Controller, useForm} from "react-hook-form";
// // import Button from "../../components/button/Button";
// // import FormInputField from "../../components/FormInputField/FormInputField";
// // import {getHighestRole} from "../../helpers/getHighestRole";
// // import {errorHandler} from "../../helpers/errorHandler";
// // import Checkbox from "../../components/checkbox/Checkbox";
// //
// // // import { Controller } from "react-hook-form";
// //
// // function Profile() {
// //
// //
// //     // const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
// //     // const { register, handleSubmit, formState: { errors }, setValue } = useForm({mode: "onTouched"});
// //     const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm({ mode: "onTouched" });
// //     // ...other states
// //     // const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm({mode: "onTouched"});
// //     const [self, setSelf] = useState(null)
// //     const [loading, setLoading] = useState(false)
// //     const [error, setError] = useState(false);
// //     const [errorMessage, setErrormessage] = useState("")
// //     const testBoolean = true;
// //     // const {control} = useForm(); // Get the control variable
// //
// //     const handleFormSubmitUser = (formData) => {
// //         // Create a payload with the inverted isDeleted value
// //         const payload = {
// //             ...formData,
// //         };
// //         console.log("payload")
// //         console.log(payload);
// //         // Submit payload to the backend
// //     };
// //
// //     function handleFormSubmitEmployee(formData) {
// //         const payload = {
// //             ...formData,
// //         };
// //         console.log("payload")
// //         console.log(payload);
// //     }
// //
// //     useEffect(() => {
// //         const token = localStorage.getItem('token');
// //
// //         const fetchSelfData = async () => {
// //             // setLoading(true);
// //             try {
// //                 const selfData = await getSelf(token);
// //                 setSelf(selfData);
// //             } catch (e) {
// //                 console.log(e)
// //                 setError(true);
// //                 setErrormessage(errorHandler(e));
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }
// //         void fetchSelfData(self)
// //
// //
// //     }, []);
// //
// //     useEffect(() => {
// //         if (self) {
// //             setValue('isNotDeleted', !self.isDeleted);
// //             setValue('isActive', self.employee.isActive); // Set the checkbox's state
// //         }
// //     }, [self, setValue]);
// //
// //
// //     // useEffect(() => {
// //     //     if (self) {
// //     //         setValue('isDeleted', self.isDeleted);
// //     //         setValue('isActive', self.employee.isActive)
// //     //
// //     //     }
// //     // }, [self, setValue]);
// //
// //     if (!self) {
// //         return <div>Loading...</div>;
// //     } else {
// //
// //         return (
// //
// //             <main>
// //                 <form
// //                     onSubmit={handleSubmit(handleFormSubmitUser)}>
// //                     <h2>User Data</h2>
// //                     <label>
// //                         Test Boolean Checkbox
// //                         <Checkbox
// //                             checked={testBoolean}
// //                             onChange={() => {}} // You would need to implement a change handler if you want the checkbox to be interactive
// //                         />
// //                     </label>
// //                     <FormInputField
// //                         label="User name"
// //                         name="username"
// //                         type="text"
// //                         id="username"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.username : ""}
// //                     />
// //                     <FormInputField
// //                         label="Email"
// //                         name="email"
// //                         type="email"
// //                         id="email"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.email : "leeg"}
// //                     />
// //                     <FormInputField
// //                         label="Password"
// //                         name="password"
// //                         type="password"
// //                         id="password"
// //                         register={register}
// //                         errors={errors}
// //                     />
// //                     {/* Checkbox for isDeleted */}
// //                     {/*<Checkbox*/}
// //                     {/*    label="Status"*/}
// //                     {/*    name="isDeleted"*/}
// //                     {/*    ref={register}*/}
// //                     {/*    defaultChecked={self.isDeleted}*/}
// //                     {/*/>*/}
// //
// //                     {/*<Controller*/}
// //                     {/*    control={control}*/}
// //                     {/*    name="isDeleted"*/}
// //                     {/*    defaultValue={self.isDeleted}*/}
// //                     {/*    render={({ field }) => (*/}
// //                     {/*        <label>*/}
// //                     {/*            User deleted*/}
// //                     {/*            <Checkbox*/}
// //                     {/*                {...field}*/}
// //                     {/*                defaultChecked={field.value}*/}
// //                     {/*                onChange={(e) => {*/}
// //                     {/*                    field.onChange(e.target.checked); // Update the field value*/}
// //                     {/*                    // Additional code for handling the change if needed*/}
// //                     {/*                }}*/}
// //                     {/*            />*/}
// //
// //                     {/*        </label>*/}
// //                     {/*    )}*/}
// //                     {/*/>*/}
// //                     <Controller
// //                         control={control}
// //                         name="isNotDeleted"
// //                         defaultValue={self ? !self.isDeleted : false} // Ensures a boolean is always provided
// //                         render={({ field: { onChange, value, ref } }) => (
// //                             <label>
// //                                 User not deleted
// //                                 <Checkbox
// //                                     ref={ref}
// //                                     checked={value} // The checked state will reflect `isNotDeleted`
// //                                     onChange={(e) => onChange(e.target.checked)}
// //                                 />
// //                             </label>
// //                         )}
// //                     />
// //
// //
// //
// //                     {/*<FormInputField*/}
// //                     {/*    label="Status"*/}
// //                     {/*    name="isDeleted"*/}
// //                     {/*    type="text"*/}
// //                     {/*    id="isDeleted"*/}
// //                     {/*    register={register}*/}
// //                     {/*    errors={errors}*/}
// //                     {/*    defaultValue={self.isDeleted ? "Not Active" : "Active"}*/}
// //                     {/*/>*/}
// //
// //                     <FormInputField
// //                         label="Authority"
// //                         name="authority"
// //                         type="text"
// //                         id="authority"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? getHighestRole(self.authorities) : ""}
// //                     />
// //
// //                     <Button type="submit" children="Opslaan"/>
// //                 </form>
// //                 <form
// //                     onSubmit={handleSubmit(handleFormSubmitEmployee)}>
// //                     <h2>Employee Data</h2>
// //                     <FormInputField
// //                         label="Employee Id"
// //                         name="empId"
// //                         type="text"
// //                         id="empId"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.employee.id : ""}
// //                     />
// //                     <FormInputField
// //                         label="First name"
// //                         name="firstName"
// //                         type="text"
// //                         id="firstName"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.employee.firstName : ""}
// //                     />
// //                     <FormInputField
// //                         label="Preposition"
// //                         name="preposition"
// //                         type="text"
// //                         id="firprepositionstName"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.employee.preposition : ""}
// //                     />
// //                     <FormInputField
// //                         label="Last name"
// //                         name="lastName"
// //                         type="text"
// //                         id="lastName"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.employee.lastName : ""}
// //                     />
// //                     <FormInputField
// //                         label="Short name"
// //                         name="shortName"
// //                         type="text"
// //                         id="shortName"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.employee.shortName : ""}
// //                     />
// //
// //                     {/*<Controller*/}
// //                     {/*    control={control}*/}
// //                     {/*    name="isActive"*/}
// //                     {/*    defaultValue={self.employee.isActive}*/}
// //                     {/*    render={({ field: { onChange, value, ...field } }) => (*/}
// //                     {/*        <label>*/}
// //                     {/*            Employee Active*/}
// //                     {/*            <Checkbox*/}
// //                     {/*                {...field}*/}
// //                     {/*                checked={value}*/}
// //                     {/*                onChange={(e) => {*/}
// //                     {/*                    onChange(e.target.checked); // Update the field value*/}
// //                     {/*                    // Additional code for handling the change if needed*/}
// //                     {/*                }}*/}
// //                     {/*            />*/}
// //                     {/*        </label>*/}
// //                     {/*    )}*/}
// //                     {/*/>*/}
// //
// //                     <FormInputField
// //                         label="Team"
// //                         name="team"
// //                         type="text"
// //                         id="team"
// //                         register={register}
// //                         errors={errors}
// //                         defaultValue={self ? self.team.teamName : ""}
// //                     />
// //
// //                     <Button type="submit" children="Opslaan"/>
// //                 </form>
// //
// //             </main>
// //         );
// //     }
// // }
// //
// // export default Profile;