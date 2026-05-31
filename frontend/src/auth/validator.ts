import { LoginFormState, LoginFormErrors, RegistrationFormErrors, RegistrationFormState } from "./types/auth.types";

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

    if(!data.password){
        errors.password = 'A password is required'
    } else if(data.password.length < 6){
        errors.password = 'The password must be longer than 6 characters'
    }

    return errors;
}