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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

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

  const getNextDate = (date: string) => {
    const selectedDate = new Date(date);
    selectedDate.setDate(selectedDate.getDate() + 1);
    return selectedDate.toISOString().split("T")[0];
  };

  const handleBooking = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setBookingError("");
      setBookingMessage("");

      if (!startDate || !endDate) {
        setBookingError("Please select start and end date");
        return;
      }

      if (startDate >= endDate) {
        setBookingError("End date must be after start date");
        return;
      }

      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingError(data.message || "Failed to create booking");
        return;
      }

      setBookingMessage("Booking request created successfully");
      setStartDate("");
      setEndDate("");
    } catch {
      setBookingError("Failed to create booking");
    }
  };

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
      <button
        className="btn-secondary details-back-btn"
        onClick={() => setPage(Page.Home)}
      >
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

          <form className="booking-form" onSubmit={handleBooking}>
            <h3>Book this listing</h3>

            {bookingError && <p className="error-text">{bookingError}</p>}
            {bookingMessage && <p className="success-text">{bookingMessage}</p>}

            <div className="booking-date-row">
              <div className="form-group">
                <label>Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    const selectedStartDate = event.target.value;
                    setStartDate(selectedStartDate);

                    if (endDate && endDate <= selectedStartDate) {
                      setEndDate("");
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label>End date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate ? getNextDate(startDate) : undefined}
                  disabled={!startDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>

            <button className="btn-primary" type="submit">
              Book now
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}