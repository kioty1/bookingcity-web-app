import { useEffect, useState } from "react";
import { AdminType } from "../types/admin.types";
import { Page } from "../enums/page.enums";

type AdminUsersPageProps = {
  onViewDetails: (propertyId: number) => void;
  setPage: (page: Page) => void;
};

function AdminUsersPage({ onViewDetails, setPage }: AdminUsersPageProps) {
  const [users, setUsers] = useState<AdminType[]>([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadUsersWithProperties = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/admin/owners-properties",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load admin data");
      }

      const data = await response.json();
      setUsers(data);
    } catch {
      setError("Failed to load users and properties");
    }
  };

  useEffect(() => {
    loadUsersWithProperties();
  }, []);

  const handleStatusChange = async (propertyId: number, status: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/properties/admin/${propertyId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update property status");
      }

      await loadUsersWithProperties();
    } catch {
      setError("Failed to update property status");
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div className="admin-header-row">
          <div>
            <h2>Admin dashboard</h2>
            <p>Users and their properties with statuses</p>
          </div>

          <button
            className="btn-primary"
            type="button"
            onClick={() => setPage(Page.AllBookings)}
          >
            All bookings
          </button>
        </div>

        <div className="status-legend">
          <button
            type="button"
            className={
              statusFilter === "all"
                ? "status-filter active-filter"
                : "status-filter"
            }
            onClick={() => setStatusFilter("all")}
          >
            all
          </button>

          <button
            type="button"
            className={
              statusFilter === "aktiivne"
                ? "status-badge active active-filter"
                : "status-badge active"
            }
            onClick={() => setStatusFilter("aktiivne")}
          >
            aktiivne
          </button>

          <button
            type="button"
            className={
              statusFilter === "ootel"
                ? "status-badge pending active-filter"
                : "status-badge pending"
            }
            onClick={() => setStatusFilter("ootel")}
          >
            ootel
          </button>

          <button
            type="button"
            className={
              statusFilter === "blokeeritud"
                ? "status-badge blocked active-filter"
                : "status-badge blocked"
            }
            onClick={() => setStatusFilter("blokeeritud")}
          >
            blokeeritud
          </button>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      <section className="admin-users-grid">
        {users.map((user) => {
          const filteredProperties =
            statusFilter === "all"
              ? user.properties
              : user.properties.filter(
                  (property) => property.status === statusFilter
                );

          return (
            <div className="admin-user-card" key={user.id}>
              <div className="admin-user-top">
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>

                <span className="role-badge">{user.role}</span>
              </div>

              <h4>Properties</h4>

              {filteredProperties.length === 0 ? (
                <p className="empty-text">No properties for this status</p>
              ) : (
                <div className="admin-property-list">
                  {filteredProperties.map((property) => (
                    <div className="admin-property-row" key={property.id}>
                      <div>
                        <strong>{property.title}</strong>

                        <p>
                          {property.city}, {property.address}
                        </p>

                        <div className="admin-status-actions">
                          <button
                            className="admin-action-btn details"
                            type="button"
                            onClick={() => onViewDetails(property.id)}
                          >
                            View details
                          </button>

                          <button
                            className="admin-action-btn active"
                            type="button"
                            onClick={() =>
                              handleStatusChange(property.id, "aktiivne")
                            }
                          >
                            Set active
                          </button>

                          <button
                            className="admin-action-btn pending"
                            type="button"
                            onClick={() =>
                              handleStatusChange(property.id, "ootel")
                            }
                          >
                            Set pending
                          </button>

                          <button
                            className="admin-action-btn blocked"
                            type="button"
                            onClick={() =>
                              handleStatusChange(property.id, "blokeeritud")
                            }
                          >
                            Block
                          </button>
                        </div>
                      </div>

                      <span
                        className={
                          property.status === "aktiivne"
                            ? "status-badge active"
                            : property.status === "ootel"
                            ? "status-badge pending"
                            : "status-badge blocked"
                        }
                      >
                        {property.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );    
        })}
      </section>
    </main>
  );
}

export default AdminUsersPage;