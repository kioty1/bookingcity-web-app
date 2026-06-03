import { useEffect, useState } from "react";
import type { RentType } from "../types/rent.types";
import { Page } from "../enums/page.enums";
import { ImageCarousel } from "../components/ImageCarousel";

type PropertyDetailsPageProps = {
    propertyId: number;
    setPage: (page: Page) => void;
};

export default function PropertyDetailsPage({
    propertyId,
    setPage,
}: PropertyDetailsPageProps) {
    const [property, setProperty] = useState<RentType | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPropertyDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/properties/${propertyId}`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load property details");
                }

                const data = await response.json();
                setProperty(data);
            } catch {
                setError("Failed to load property details");
            }
        };

        loadPropertyDetails();
    }, [propertyId]);

    if (error) {
        return (
            <main className="details-page">
                <p className="error-text">{error}</p>

                <button className="btn-secondary" onClick={() => setPage(Page.Home)}>
                    Back to listings
                </button>
            </main>
        );
    }

    if (!property) {
        return (
            <main className="details-page">
                <p>Loading property details...</p>
            </main>
        );
    }

    return (
        <main className="details-page">
            <button className="btn-secondary details-back-btn" onClick={() => setPage(Page.Home)}>
                Back to listings
            </button>

            <section className="details-card">
                <div className="details-image-block">
                    <ImageCarousel images={property.images} title={property.title} />
                </div>

                <div className="details-content">
                    <span
                        className={
                            property.status === "aktiivne"
                                ? "details-status-badge active"
                                : property.status === "ootel"
                                    ? "details-status-badge pending"
                                    : "details-status-badge blocked"
                        }
                    >
                        {property.status}
                    </span>

                    <h1>{property.title}</h1>

                    <p className="details-location">
                        📍 {property.city}, {property.address}
                    </p>

                    <p className="details-description">{property.description}</p>

                    <div className="details-info-grid">
                        <div className="details-info-box">
                            <span>Type</span>
                            <strong>{property.type}</strong>
                        </div>

                        <div className="details-info-box">
                            <span>Status</span>
                            <strong>{property.status}</strong>
                        </div>

                        <div className="details-info-box">
                            <span>Price</span>
                            <strong>{property.price} €</strong>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}