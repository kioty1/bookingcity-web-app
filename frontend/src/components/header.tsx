
import { useState } from "react";
import { AuthUserType } from "../types/auth.types";
import { Page } from "../enums/page.enums";

export function Header({ authUser, onLogout, page, setPage }: { authUser: AuthUserType | false | null, onLogout: () => Promise<void>, page: Page, setPage: (page: Page) => void }) {

  return (
    <header className="topbar">
      <div className="logo" onClick={() => setPage(Page.Home)}>
        BookingCity 🏨
      </div>

      <div className="nav-actions">
        {authUser ? (
          <>
            {authUser.role === 'administraator' && (
              <button className="btn-secondary" onClick={() => setPage(Page.Admin)}>
                Admin panel
              </button>
            )}
            <span className="user-info">
              {authUser.name} ({authUser.role})
            </span>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
            {page !== Page.MyListings && (
              <button className="btn-secondary" onClick={() => setPage(Page.MyListings)}>
                My listings
              </button>
            )}
            {authUser.role === "omanik" && (
              <button
                className="btn-secondary"
                onClick={() => setPage(Page.OwnerBookings)}
              >
                Booking requests
              </button>
            )}
            <button className="btn-secondary" onClick={() => setPage(Page.MyBookings)}>
              My bookings
            </button>
          </>
        ) : (
          <>
            {page !== Page.Home && (
              <button className="btn-secondary" onClick={() => setPage(Page.Home)}>
                Back to main
              </button>
            )}
            {page !== Page.Login && (
              <button className="btn-secondary" onClick={() => setPage(Page.Login)}>
                Login
              </button>
            )}
            {page !== Page.Register && (
              <button className="btn-primary" onClick={() => setPage(Page.Register)}>
                Registration
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}