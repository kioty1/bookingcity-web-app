import { LoginForm } from "../auth/loginForm";
import '../auth/auth.css'

export const LoginPage = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) =>{
    return(
        <div>
            <p className="auth-hint" >Please log in to your account,or sign up if you don't have one</p>
            <LoginForm onSwitchToRegister={onSwitchToRegister}></LoginForm>

        </div>
    )
}