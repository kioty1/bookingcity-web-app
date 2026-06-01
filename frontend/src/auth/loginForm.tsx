import { useState } from "react";
import { LoginFormState, LoginFormErrors } from "./types/auth.types";
import { validateLogin } from "./validator";
import './auth.css'

export const LoginForm = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
    const [formData, setFormData] = useState<LoginFormState>({
     email: '',
     password: '',
    });

    const [errors, setErrors] = useState<LoginFormErrors>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
        setErrorMessage(null);
        debugger;
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();

      if(!response.ok){
        throw new Error(result.message);
      }
      console.log('success: Должен быть переход на другую страницу', result);
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(err.message || 'issue');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input name="email" placeholder="Email" className="auth-input" onChange={handleChange} />
      {errors.email && <span className="errors">{errors.email}</span>}

      <input name="password" type="Password" className="auth-input" placeholder="Пароль" onChange={handleChange} />
      {errors.password && <span className="errors">{errors.password}</span>}

      {errorMessage && (
        <span className="errors">
           {errorMessage}
        </span>
      )}
      <div style={{display: 'flex', gap:'15px'}}>

      <button style={{height: '30px', width: '100px', fontSize: '14px'}} className="btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Log in'}
      </button>
      <button style={{height: '30px', width: '100px', fontSize: '14px'}} onClick={onSwitchToRegister} type="button" className="btn-secondary" disabled={isSubmitting}>
        Registration
      </button>
      </div>
    </form>
  );
}