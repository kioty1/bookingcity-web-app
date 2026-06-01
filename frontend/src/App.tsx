import './styles/global.css';
import { useState } from 'react';
import { LoginPage } from './pages/loginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { Auth } from './auth/auth';
import PropertiesPage from './pages/PropertiesPage';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const authUser = Auth();

  if (authUser === null) {
    return <div>Validation session...</div>;
  }

  const handleLogout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    window.location.reload();
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h1 style={{ color: '#003b7a' }}>BookingCity 🏨</h1>

        <div>
          {authUser ? (
            <>
              <span style={{ marginRight: '12px' }}>
                {authUser.name} ({authUser.role})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowAuthForm(true);
                  setIsRegistering(false);
                }}
                style={{ marginRight: '8px' }}
              >
                Login
              </button>

              <button
                onClick={() => {
                  setShowAuthForm(true);
                  setIsRegistering(true);
                }}
              >
                Registration
              </button>
            </>
          )}
        </div>
      </header>

      {showAuthForm && !authUser && (
        <div
          style={{
            maxWidth: '400px',
            margin: '0 auto 30px auto',
            padding: '20px',
            backgroundColor: '#eef4ff',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          {isRegistering ? (
            <RegistrationPage onSwitchToLogin={() => setIsRegistering(false)} />
          ) : (
            <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />
          )}
        </div>
      )}

      <PropertiesPage />
    </div>
  );
}

export default App;