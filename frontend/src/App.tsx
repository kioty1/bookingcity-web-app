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
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import EditListingPage from "./pages/EditListingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import AllBookingsPage from "./pages/AllBookingsPage";

function App() {
  const [page, setPage] = useState<Page>(Page.Home);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  const [detailsBackPage, setDetailsBackPage] = useState<Page>(Page.Home);
  const authUser = Auth();

  if (authUser === null) {
    return <div>Validation session...</div>;
  }

  const handleViewDetails = (propertyId: number, backPage: Page = Page.Home) => {
    setSelectedPropertyId(propertyId);
    setDetailsBackPage(backPage);
    setPage(Page.PropertyDetails);
  };
  const handleEditListing = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setPage(Page.EditListing);
  };

  const handleLogout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    window.location.reload();
  };

  const RenderPage = () => {
    switch (page) {
      case Page.Home:
        return (
          <PropertiesPage
            authUser={authUser}
            setPage={setPage}
            onViewDetails={handleViewDetails}
          />
        );

      case Page.AllBookings:
        return authUser && authUser.role === "administraator" ? (
          <AllBookingsPage />
        ) : null;

      case Page.OwnerBookings:
        return authUser &&
          (authUser.role === "omanik" || authUser.role === "administraator") ? (
          <OwnerBookingsPage />
        ) : null;

      case Page.Admin:
        return authUser && authUser.role === "administraator" ? (
          <AdminUsersPage
            onViewDetails={(propertyId) => handleViewDetails(propertyId, Page.Admin)}
            setPage={setPage}
          />
        ) : null;

      case Page.MyListings:
        return authUser ? (
          <MyListingsPage onEditListing={handleEditListing} />
        ) : null;

      case Page.MyBookings:
        return authUser ? <MyBookingsPage /> : null;

      case Page.AddListing:
        return authUser ? <AddListingPage setPage={setPage} /> : null;

      case Page.PropertyDetails:
        return selectedPropertyId !== null ? (
          <PropertyDetailsPage
            propertyId={selectedPropertyId}
            setPage={setPage}
            authUser={authUser}
            backPage={detailsBackPage}
          />
        ) : (
          <main className="details-page">
            <p className="error-text">No property selected.</p>

            <button className="btn-secondary" onClick={() => setPage(Page.Home)}>
              Back to listings
            </button>
          </main>
        );

      case Page.EditListing:
        return selectedPropertyId !== null ? (
          <EditListingPage
            propertyId={selectedPropertyId}
            setPage={setPage}
          />
        ) : (
          <main className="details-page">
            <p className="error-text">No listing selected.</p>

            <button className="btn-secondary" onClick={() => setPage(Page.MyListings)}>
              Back to my listings
            </button>
          </main>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header
        authUser={authUser}
        onLogout={handleLogout}
        page={page}
        setPage={setPage}
      />

      {!authUser && (page === Page.Login || page === Page.Register) && (
        <main className="auth-page">
          <div className="auth-card">
            {page === Page.Register && (

              <RegistrationPage onSwitchToLogin={() => setPage(Page.Login)} setPage={setPage} />
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