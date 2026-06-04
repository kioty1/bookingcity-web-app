import { LoginFormState, LoginFormErrors, RegistrationFormErrors, RegistrationFormState } from "../types/auth.types";
import z from 'zod';

export const validateLogin = (data: LoginFormState) : LoginFormErrors => {
    const errors: LoginFormErrors = {};


 const emailRegex: RegExp = /\S+@\S+\.\S+/;
    if(!data.email){
        errors.email = 'Email is required'
    } else if(!emailRegex.test(data.email)){
        errors.email = 'Please enter a valid email address'
    }

    if(!data.password){
        errors.password = 'A password is required'
    } else if(data.password.length < 6){
        errors.password = 'The password must be longer than 6 characters'
    }

    return errors;
}

export const validateRegistration = (data: RegistrationFormState) : RegistrationFormErrors => {
    const errors: RegistrationFormErrors = {};

    if (!data.name){
        errors.name = 'Name is required'
    } else if (data.name.length <= 1) {
        errors.name = 'The name must be more than 1 character long ';
    }

    const emailRegex: RegExp = /\S+@\S+\.\S+/;
    if(!data.email){
        errors.email = 'Email is required'
    } else if(!emailRegex.test(data.email)){
        errors.email = 'Please enter a valid email address'
    }

    const resPassword = passwordSchema.safeParse(data.password);

    if(!resPassword.success){
        errors.password = resPassword.error.errors[0].message;
    }

    return errors;
}

const passwordSchema = z.string({
    required_error: "A password is required",
})
.min(6, 'The password must be longer than 6 characters')
.regex(/[A-Z]/, 'Must contain at least one uppercase letter')
.regex(/[a-z]/, 'Must contain at least one lowercase letter ')
.regex(/\d/, 'Must contain at least one number')
.regex(/[@$!%*?&]/, 'There must be at least one special character');