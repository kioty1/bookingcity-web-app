import { useEffect, useState } from "react";

type Property = {
    id: number;
    title: string;
    city: string;
    address: string;
    type: string;
    description: string;
    price: string;
    status: string;
};

type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    properties: Property[];
};

function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUsersWithProperties() {
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
        }

        loadUsersWithProperties();
    }, []);

    return (
        <main className="admin-page">
            <section className="admin-header">
                <h2>Admin dashboard</h2>
                <p>Users and their properties with statuses</p>
                <div className="status-legend">
                    <span className="status-badge active">aktiivne</span>
                    <span className="status-badge pending">ootel</span>
                    <span className="status-badge blocked">blokeeritud</span>
                </div>
            </section>

            {error && <p className="error-text">{error}</p>}

            <section className="admin-users-grid">
                {users.map((user) => (
                    <div className="admin-user-card" key={user.id}>
                        <div className="admin-user-top">
                            <div>
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>

                            <span className="role-badge">{user.role}</span>
                        </div>

                        <h4>Properties</h4>

                        {user.properties.length === 0 ? (
                            <p className="empty-text">No properties</p>
                        ) : (
                            <div className="admin-property-list">
                                {user.properties.map((property) => (
                                    <div className="admin-property-row" key={property.id}>
                                        <div>
                                            <strong>{property.title}</strong>
                                            <p>
                                                {property.city}, {property.address}
                                            </p>
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
                ))}
            </section>
        </main>
    );
}

export default AdminUsersPage;