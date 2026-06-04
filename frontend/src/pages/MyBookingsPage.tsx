    import { useEffect, useState } from "react";
import type { BookingType } from "../types/booking.types";
import { ImageCarousel } from "../components/ImageCarousel";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [error, setError] = useState("");

  const loadMyBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bookings/my", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load my bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch {
      setError("Failed to load my bookings");
    }
  };

  useEffect(() => {
    loadMyBookings();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const getStatusClass = (status: string) => {
    if (status === "kinnitatud") {
      return "status-badge active";
    }

    if (status === "ootel") {
      return "status-badge pending";
    }

    return "status-badge blocked";
  };

  const getStatusText = (status: string) => {
    if (status === "kinnitatud") {
      return "confirmed";
    }

    if (status === "ootel") {
      return "pending";
    }

    return "cancelled";
  };

  return (
    <main className="my-listings-page">
      <section className="admin-header">
        <h2>My bookings</h2>
        <p>Here you can see your booking requests and their statuses.</p>

        <div className="status-legend">
          <span className="status-badge active">confirmed</span>
          <span className="status-badge pending">pending</span>
          <span className="status-badge blocked">cancelled</span>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      {bookings.length === 0 ? (
        <p className="empty-text">You have no bookings yet.</p>
      ) : (
        <div className="properties-grid">
          {bookings.map((booking) => (
            <article className="property-card" key={booking.id}>
              <ImageCarousel
                images={booking.property.images}
                title={booking.property.title}
              />

              <h2>{booking.property.title}</h2>

              <p className="property-meta">
                📍 {booking.property.city}, {booking.property.address}
              </p>

              <p>{booking.property.description}</p>

              <p className="property-meta">
                Dates:{" "}
                <b>
                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                </b>
              </p>

              <p className="property-meta">
                Type: <b>{booking.property.type}</b>
              </p>

              <div className="price-row">
                <span className="price">{booking.property.price} €</span>

                <span className={getStatusClass(booking.status)}>
                  {getStatusText(booking.status)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}