import { useEffect, useState } from "react";
import type { RentType } from "../types/rent.types";
import { Page } from "../enums/page.enums";

type EditListingPageProps = {
  propertyId: number;
  setPage: (page: Page) => void;
};

export default function EditListingPage({
  propertyId,
  setPage,
}: EditListingPageProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
    type: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const loadListing = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/properties/${propertyId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load listing");
        }

        const data: RentType = await response.json();

        setFormData({
          title: data.title,
          city: data.city,
          address: data.address || "",
          type: data.type,
          description: data.description || "",
          price: String(data.price),
        });
      } catch {
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [propertyId]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(
        `http://localhost:3000/api/properties/${propertyId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      setPage(Page.MyListings);
    } catch {
      setError("Failed to update listing");
    }
  };

  if (loading) {
    return (
      <main className="add-listing-page">
        <p>Loading listing...</p>
      </main>
    );
  }

  return (
    <main className="add-listing-page">
      <section className="add-listing-card">
        <div className="add-listing-header">
          <h1>Edit listing</h1>
          <p>
            After editing, the listing will be sent back to pending status and
            must be approved by an administrator again.
          </p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="listing-form" onSubmit={handleSubmitEdit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="">Select type</option>
                <option value="korter">Apartment</option>
                <option value="hotell">Hotel</option>
                <option value="maja">House</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit">
              Save changes
            </button>

            <button
              className="btn-secondary"
              type="button"
              onClick={() => setPage(Page.MyListings)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}