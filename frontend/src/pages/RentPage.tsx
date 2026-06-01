import { useEffect, useState } from "react";
import type { PropertyType, RentPageProps } from "../types/rent.types";

export default function RentPage({ authUser }: RentPageProps) {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([]);
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyType | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
    type: "",
    description: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddListing = () => {
    setEditingProperty(null);
    setFormData({
      title: "",
      city: "",
      address: "",
      type: "",
      description: "",
      price: "",
    });
    setShowForm(true);
    setImageFile(null);
  };

  const handleEditListing = (property: PropertyType) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      city: property.city,
      address: property.address || "",
      type: property.type,
      description: property.description || "",
      price: property.price,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const handleSubmitListing = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const url = editingProperty
        ? `http://localhost:3000/api/properties/${editingProperty.id}`
        : "http://localhost:3000/api/properties";

      const method = editingProperty ? "PUT" : "POST";

      let response: Response;

      if (editingProperty) {
        response = await fetch(url, {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            city: formData.city,
            address: formData.address,
            type: formData.type,
            description: formData.description,
            price: Number(formData.price),
          }),
        });
      } else {
        const data = new FormData();

        data.append("title", formData.title);
        data.append("city", formData.city);
        data.append("address", formData.address);
        data.append("type", formData.type);
        data.append("description", formData.description);
        data.append("price", formData.price);

        if (imageFile) {
          data.append("image", imageFile);
        }

        response = await fetch(url, {
          method,
          credentials: "include",
          body: data,
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save listing");
      }

      setShowForm(false);
      setEditingProperty(null);
      setImageFile(null);
      await loadProperties();
    } catch {
      setError("Failed to save listing");
    }
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
            <button className="btn-primary" onClick={handleAddListing}>
              Add listing
            </button>
          )}
        </div>

        {showForm && (
          <form className="listing-form" onSubmit={handleSubmitListing}>
            <h3>{editingProperty ? "Edit listing" : "Add new listing"}</h3>

            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
            />

            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />

            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />

            <input
              name="type"
              placeholder="Type"
              value={formData.type}
              onChange={handleInputChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />

            <input
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
            />
            {!editingProperty && (
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    setImageFile(file);
                  }
                }}
              />
            )}

            <div className="form-actions">
              <button className="btn-primary" type="submit">
                {editingProperty ? "Save changes" : "Create listing"}
              </button>

              <button className="btn-secondary" type="button" onClick={handleCancelForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <article className="property-card" key={property.id}>
              {property.images && property.images.length > 0 && (
                <img
                  className="property-image"
                  src={`http://localhost:3000${property.images[0].url}`}
                  alt={property.title}
                />
              )}

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

              {authUser &&
                (authUser.role === "administraator" ||
                  authUser.id === property.ownerId) && (
                  <button
                    className="btn-secondary"
                    onClick={() => handleEditListing(property)}
                  >
                    Edit listing
                  </button>
                )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}