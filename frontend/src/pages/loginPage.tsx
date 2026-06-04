import { LoginForm } from "../components/loginForm";
import { Page } from "../enums/page.enums";
import '../auth/auth.css'

export const LoginPage = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
    return <LoginForm />;
};