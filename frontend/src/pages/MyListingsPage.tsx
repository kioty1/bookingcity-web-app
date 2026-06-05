import { useEffect, useState } from "react";
import type { RentType } from "../types/rent.types";
import { ImageCarousel } from "../components/ImageCarousel";

type MyListingsPageProps = {
  onEditListing: (propertyId: number) => void;
};

export default function MyListingsPage({ onEditListing }: MyListingsPageProps) {
  const [listings, setListings] = useState<RentType[]>([]);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const loadMyListings = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/properties/my/listings",
        {
          credentials: "include",
        }
      );

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

  const filteredListings =
    statusFilter === "all"
      ? listings
      : listings.filter((property) => property.status === statusFilter);

  return (
    <main className="my-listings-page">
      <section className="admin-header">
        <h2>My listings</h2>
        <p>Here you can see your active, pending and blocked listings.</p>

        <div className="status-legend">
          <button
            type="button"
            className={statusFilter === "all" ? "status-filter active-filter" : "status-filter"}
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
            active
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
            pending
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
            blocked
          </button>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      {filteredListings.length === 0 ? (
        <p className="empty-text">
          {listings.length === 0
            ? "You have no listings yet."
            : "No listings found for this status."}
        </p>
      ) : (
        <div className="properties-grid">
          {filteredListings.map((property) => (
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

              <button
                type="button"
                className="details-btn"
                onClick={() => onEditListing(property.id)}
              >
                Edit listing
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}