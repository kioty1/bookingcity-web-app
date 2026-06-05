import { useEffect, useState } from "react";
import type { BookingType } from "../types/booking.types";
import { ImageCarousel } from "../components/ImageCarousel";

export default function AllBookingsPage() {
    const [bookings, setBookings] = useState<BookingType[]>([]);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");
    const loadAllBookings = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/bookings", {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to load all bookings");
                return;
            }

            setBookings(data);
        } catch {
            setError("Failed to load all bookings");
        }
    };

    useEffect(() => {
        loadAllBookings();
    }, []);

    const updateBookingStatus = async (bookingId: number, status: string) => {
        try {
            setError("");

            const response = await fetch(
                `http://localhost:3000/api/bookings/${bookingId}/status`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to update booking status");
                return;
            }

            await loadAllBookings();
        } catch {
            setError("Failed to update booking status");
        }
    };

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

    const filteredBookings =
        statusFilter === "all"
            ? bookings
            : bookings.filter((booking) => booking.status === statusFilter);

    return (
        <main className="my-listings-page">
            <section className="admin-header">
                <h2>All bookings</h2>
                <p>Here administrator can see and manage all booking requests.</p>

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
                            statusFilter === "kinnitatud"
                                ? "status-badge active active-filter"
                                : "status-badge active"
                        }
                        onClick={() => setStatusFilter("kinnitatud")}
                    >
                        confirmed
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
                            statusFilter === "tuhistatud"
                                ? "status-badge blocked active-filter"
                                : "status-badge blocked"
                        }
                        onClick={() => setStatusFilter("tuhistatud")}
                    >
                        cancelled
                    </button>
                </div>
            </section>

            {error && <p className="error-text">{error}</p>}

            {filteredBookings.length === 0 ? (
                <p className="empty-text">
                    {bookings.length === 0
                        ? "No bookings found."
                        : "No bookings found for this status."}
                </p>
            ) : (
                <div className="properties-grid">
                    {filteredBookings.map((booking) => (
                        <article className="property-card" key={booking.id}>
                            <ImageCarousel
                                images={booking.property.images}
                                title={booking.property.title}
                            />

                            <h2>{booking.property.title}</h2>

                            <p className="property-meta">
                                📍 {booking.property.city}, {booking.property.address}
                            </p>

                            <p className="property-meta">
                                Client: <b>{booking.user?.name}</b>
                            </p>

                            <p className="property-meta">
                                Owner: <b>{booking.property.owner?.name}</b>
                            </p>

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

                            {booking.status === "ootel" && (
                                <div className="admin-status-actions">
                                    <button
                                        className="admin-action-btn active"
                                        onClick={() => updateBookingStatus(booking.id, "kinnitatud")}
                                    >
                                        Confirm
                                    </button>

                                    <button
                                        className="admin-action-btn blocked"
                                        onClick={() => updateBookingStatus(booking.id, "tuhistatud")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}