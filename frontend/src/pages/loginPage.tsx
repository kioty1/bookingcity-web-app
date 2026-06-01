import { LoginForm } from "../auth/loginForm";
import '../auth/auth.css'

export const LoginPage = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
  return <LoginForm />;
};