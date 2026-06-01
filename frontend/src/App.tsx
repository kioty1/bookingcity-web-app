import './styles/global.css';
import { useState } from 'react';
import { LoginPage } from './pages/loginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { Auth } from './auth/auth';
import PropertiesPage from './pages/PropertiesPage';

type Page = 'home' | 'login' | 'register';

function App() {
  const [page, setPage] = useState<Page>('home');
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

  if (page === 'login' && !authUser) {
    return (
      <div className="app">
        <header className="topbar">
          <div className="logo" onClick={() => setPage('home')}>
            BookingCity 🏨
          </div>

          <div className="nav-actions">
            <button className="btn-secondary" onClick={() => setPage('home')}>
              Back to main
            </button>
            <button className="btn-primary" onClick={() => setPage('register')}>
              Registration
            </button>
          </div>
        </header>

        <main className="auth-page">
          <div className="auth-card">
            <LoginPage onSwitchToRegister={() => setPage('register')} />
          </div>
        </main>
      </div>
    );
  }

  if (page === 'register' && !authUser) {
    return (
      <div className="app">
        <header className="topbar">
          <div className="logo" onClick={() => setPage('home')}>
            BookingCity 🏨
          </div>

          <div className="nav-actions">
            <button className="btn-secondary" onClick={() => setPage('home')}>
              Back to main
            </button>
            <button className="btn-primary" onClick={() => setPage('login')}>
              Login
            </button>
          </div>
        </header>

        <main className="auth-page">
          <div className="auth-card">
            <RegistrationPage onSwitchToLogin={() => setPage('login')} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo" onClick={() => setPage('home')}>
          BookingCity 🏨
        </div>

        <div className="nav-actions">
          {authUser ? (
            <>
              <span className="user-info">
                {authUser.name} ({authUser.role})
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => setPage('login')}>
                Login
              </button>

              <button className="btn-primary" onClick={() => setPage('register')}>
                Registration
              </button>
            </>
          )}
        </div>
      </header>

      <PropertiesPage />
    </div>
  );
}

export default App;