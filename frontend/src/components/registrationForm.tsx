import { useState } from "react";
import { RegistrationFormErrors, RegistrationFormState } from "../types/auth.types";
import { validateRegistration } from "../auth/validator";
import { Page } from "../enums/page.enums";
import '../auth/auth.css'

export const RegistrationForm = ({setPage}: {setPage: (page: Page) => void} ) => {
  const [formData, setFormData] = useState<RegistrationFormState>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<RegistrationFormErrors>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegistration(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      setErrorMessage(null);
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }
      debugger;
      setPage(Page.Login);
    } catch (err: any) {
      setErrorMessage(err.message || 'issue');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create BookingCity account</h2>

      <input
        name="name"
        placeholder="Name"
        className="auth-input"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <span className="auth-error">{errors.name}</span>}

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
        placeholder="Password"
        className="auth-input"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && <span className="auth-error">{errors.password}</span>}

      {errorMessage && <span className="auth-error">{errorMessage}</span>}

      <div className="auth-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading..." : "Registration"}
        </button>
      </div>
    </form>
  );
}