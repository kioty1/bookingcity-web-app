export interface LoginFormState {
    email: string;
    password: string;
}

export interface RegistrationFormState {
    name: string;
    email: string;
    password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>; 
export type RegistrationFormErrors = Partial<Record<keyof RegistrationFormState, string>>; 