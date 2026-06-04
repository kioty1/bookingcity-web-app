import { useState } from "react";
import { LoginFormState, LoginFormErrors } from "../types/auth.types";
import { validateLogin } from "../auth/validator";
import '../auth/auth.css'

export const LoginForm = () => {
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

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
      window.location.reload();
    } catch (err: any) {
      setErrorMessage(err.message || 'issue');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Log in to BookingCity</h2>

      <input
        name="email"
        placeholder="Email"
        className="auth-input"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <span className="auth-error">{errors.email}</span>}

      <input
        name="password"
        type="password"
        className="auth-input"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && <span className="auth-error">{errors.password}</span>}

      {errorMessage && <span className="auth-error">{errorMessage}</span>}

      <div className="auth-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Log in"}
        </button>
      </div>
    </form>
  );
}