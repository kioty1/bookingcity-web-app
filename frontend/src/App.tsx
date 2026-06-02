import './styles/global.css';
import { useState } from 'react';
import { LoginPage } from './pages/loginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { Auth } from './auth/auth';
import PropertiesPage from './pages/RentPage';
import AdminUsersPage from "./pages/AdminUsersPage";
import MyListingsPage from './pages/MyListingsPage';
import { Header } from './components/header';
import { Page } from './enums/page.enums';
import AddListingPage from './pages/AddListingPage';

function App() {
  const [page, setPage] = useState<Page>(Page.Home);
  const authUser = Auth();

  if (authUser === null) {
    return <div>Validation session...</div>;
  }

  const RenderPage = () => {
    switch (page) {
      case Page.Home:
        return <PropertiesPage authUser={authUser} setPage={setPage} />;

      case Page.Admin:
        return authUser && authUser.role === 'administraator' ? (
          <AdminUsersPage />
        ) : null;

      case Page.MyListings:
        return authUser ? <MyListingsPage /> : null;

      case Page.AddListing:
        return authUser ? <AddListingPage setPage={setPage} /> : null;

      default:
        return null;
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });


    window.location.reload();
  };


  return (
    <div className="app">
      <Header authUser={authUser}
        onLogout={handleLogout}
        page={page}
        setPage={setPage}></Header>

      {!authUser && (page === Page.Login || page === Page.Register) && (

        <main className="auth-page">
          <div className="auth-card">
            {page === Page.Register && (
              <RegistrationPage onSwitchToLogin={() => setPage(Page.Login)} />
            )}

            {page === Page.Login && (
              <LoginPage onSwitchToRegister={() => setPage(Page.Register)} />
            )}
          </div>
        </main>
      )}

      {RenderPage()}
    </div>
  );
}

export default App;