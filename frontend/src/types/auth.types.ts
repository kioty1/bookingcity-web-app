export type LoginFormState = {
    email: string;
    password: string;
}

export type RegistrationFormState = {
    name: string;
    email: string;
    password: string;
}

export type AuthUserType = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>; 
export type RegistrationFormErrors = Partial<Record<keyof RegistrationFormState, string>>; 