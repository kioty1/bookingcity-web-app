import { useEffect, useState } from "react";

type Property = {
  id: number;
  title: string;
  city: string;
  address: string | null;
  type: string;
  description: string | null;
  price: string;
  status: string;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/properties", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch(() => setError("Failed to load properties"));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>BookingCity properties</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#f8f8f8",
            }}
          >
            <h2>{property.title}</h2>
            <p>
              {property.city}, {property.address}
            </p>
            <p>{property.description}</p>
            <p>
              Type: <b>{property.type}</b>
            </p>
            <p>
              Price: <b>{property.price} €</b>
            </p>
            <p>Status: {property.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}