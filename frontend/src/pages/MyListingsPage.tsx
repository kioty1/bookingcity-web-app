import { useEffect, useState } from "react";
import type { PropertyType } from "../types/rent.types";
import { ImageCarousel } from "../components/ImageCarousel";

export default function MyListingsPage() {
    const [listings, setListings] = useState<PropertyType[]>([]);
    const [error, setError] = useState("");

    const loadMyListings = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/properties/my/listings", {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to load my listings");
            }

            const data = await response.json();
            setListings(data);
        } catch {
            setError("Failed to load my listings");
        }
    };

    useEffect(() => {
        loadMyListings();
    }, []);

    const getImageUrl = (url: string) => {
        if (url.startsWith("/uploads")) {
            return `http://localhost:3000${url}`;
        }

        return `/${url}`;
    };

    return (
        <main className="my-listings-page">
            <section className="admin-header">
                <h2>My listings</h2>
                <p>Here you can see your active, pending and blocked listings.</p>

                <div className="status-legend">
                    <span className="status-badge active">active</span>
                    <span className="status-badge pending">pending</span>
                    <span className="status-badge blocked">blocked</span>
                </div>
            </section>

            {error && <p className="error-text">{error}</p>}

            {listings.length === 0 ? (
                <p className="empty-text">You have no listings yet.</p>
            ) : (
                <div className="properties-grid">
                    {listings.map((property) => (
                        <article className="property-card" key={property.id}>
                            <ImageCarousel images={property.images} title={property.title} />

                            <h2>{property.title}</h2>

                            <p className="property-meta">
                                📍 {property.city}, {property.address}
                            </p>

                            <p>{property.description}</p>

                            <p className="property-meta">
                                Type: <b>{property.type}</b>
                            </p>

                            <div className="price-row">
                                <span className="price">{property.price} €</span>
                                <span
                                    className={
                                        property.status === "aktiivne"
                                            ? "status-badge active"
                                            : property.status === "ootel"
                                                ? "status-badge pending"
                                                : "status-badge blocked"
                                    }
                                >
                                    {property.status === "aktiivne"
                                        ? "active"
                                        : property.status === "ootel"
                                            ? "pending"
                                            : "blocked"}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}