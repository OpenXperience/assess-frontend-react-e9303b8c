import { useState } from 'react';

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return value.trim() !== '' && EMAIL_PATTERN.test(value.trim());
}

function isValidPassword(value) {
  return value.length >= MIN_PASSWORD_LENGTH;
}

function emailErrorMessage(value) {
  if (value.trim() === '') return 'Email is required.';
  if (!isValidEmail(value)) return 'Enter a valid email address.';
  return null;
}

function passwordErrorMessage(value) {
  if (value === '') return 'Password is required.';
  if (!isValidPassword(value)) {
    return `Password length must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitted, setIsSubmitted] = useState(false);

  function markTouched(field) {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);
    if (onLogin) {
      onLogin({ email: email.trim(), password });
    }
  }

  const emailIsValid = isValidEmail(email);
  const passwordIsValid = isValidPassword(password);
  const isSubmitDisabled = !emailIsValid || !passwordIsValid;

  const emailError = touched.email ? emailErrorMessage(email) : null;
  const passwordError = touched.password ? passwordErrorMessage(password) : null;

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2 className="login-form__title">Log in</h2>

      <div className="login-form__field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          aria-invalid={touched.email && !emailIsValid}
          aria-describedby={emailError ? 'login-email-error' : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            markTouched('email');
            setIsSubmitted(false);
          }}
          onBlur={() => markTouched('email')}
        />
        {emailError && (
          <p className="login-form__error" id="login-email-error" role="alert">
            {emailError}
          </p>
        )}
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          aria-invalid={touched.password && !passwordIsValid}
          aria-describedby={passwordError ? 'login-password-error' : undefined}
          onChange={(event) => {
            setPassword(event.target.value);
            markTouched('password');
            setIsSubmitted(false);
          }}
          onBlur={() => markTouched('password')}
        />
        {passwordError && (
          <p className="login-form__error" id="login-password-error" role="alert">
            {passwordError}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitDisabled}>
        Submit
      </button>

      {isSubmitted && (
        <p className="login-form__success" role="status">
          Signed in successfully.
        </p>
      )}
    </form>
  );
}