import { useEffect, useState } from "react";
import type { RentType, RentPageProps } from "../types/rent.types";
import { Page } from "../enums/page.enums";
import { ImageCarousel } from "../components/ImageCarousel";

export default function RentPage({ authUser, setPage }: RentPageProps) {
  const [properties, setProperties] = useState<RentType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<RentType[]>([]);
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");

  const loadProperties = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/properties", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load properties");
      }

      const data = await response.json();

      setProperties(data);
      setFilteredProperties(data);
    } catch {
      setError("Failed to load properties");
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleSearch = () => {
    const query = searchCity.trim().toLowerCase();

    if (!query) {
      setFilteredProperties(properties);
      return;
    }

    const result = properties.filter((property) =>
      property.city.toLowerCase().includes(query)
    );

    setFilteredProperties(result);
  };
  
  return (
    <>
      <section className="hero">
        <h1>Find your next stay in BookingCity</h1>
        <p>Browse apartments, hotels and guest houses before logging in.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by city, for example Tallinn"
            value={searchCity}
            onChange={(event) => setSearchCity(event.target.value)}
          />
          <button className="btn-secondary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </section>

      <section className="properties-section">
        <div className="section-header">
          <h1 className="section-title">Available stays</h1>

          {authUser && (
            <button
              className="btn-primary"
              onClick={() => setPage(Page.AddListing)}
            >
              Add listing
            </button>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="properties-grid">
          {filteredProperties.map((property) => (
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
                <span className="status">{property.status}</span>
              </div>

              <button className="details-btn">View details</button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}