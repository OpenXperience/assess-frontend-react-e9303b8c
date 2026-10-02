import { useState } from 'react';
import LoginForm from './LoginForm.jsx';

export default function App() {
  const [lastLogin, setLastLogin] = useState(null);

  return (
    <main className="app">
      <LoginForm onLogin={(values) => setLastLogin(values)} />
      {lastLogin && (
        <p className="app__last-login">
          <strong>onLogin received:</strong> {lastLogin.email}
        </p>
      )}
    </main>
  );
}