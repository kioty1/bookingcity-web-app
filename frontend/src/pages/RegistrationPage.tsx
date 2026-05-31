import { RegistrationForm } from "../auth/registrationForm"

export const RegistrationPage = ({onSwitchToLogin} : {onSwitchToLogin :() => void}) =>{
    return(
        <div>
            <p className="auth-hint" >Please register or log in</p>
            <RegistrationForm onSwitchToLogin={onSwitchToLogin}></RegistrationForm>
        </div>
    )
}