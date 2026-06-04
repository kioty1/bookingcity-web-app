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

  const [existingImages, setExistingImages] = useState<
    { id: number; propertyId: number; url: string }[]
  >([]);

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

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
        setExistingImages(data.images || []);
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

      const priceNumber = Number(formData.price);

      if (!formData.price || isNaN(priceNumber) || priceNumber <= 0) {
        setError("Price must be a positive number");
        return;
      }

      const data = new FormData();

      data.append("title", formData.title);
      data.append("city", formData.city);
      data.append("address", formData.address);
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("price", formData.price);

      newImageFiles.forEach((file) => {
        data.append("images", file);
      });

      const response = await fetch(
        `http://localhost:3000/api/properties/${propertyId}`,
        {
          method: "PUT",
          credentials: "include",
          body: data,
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

  const handleDeleteExistingImage = async (imageId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/properties/images/${imageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setExistingImages((prev) => prev.filter((image) => image.id !== imageId));
    } catch {
      setError("Failed to delete image");
    }
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    setNewImageFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

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
              type="number"
              min="1"
              step="0.01"
              placeholder="For example 75"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Current photos</label>

            {existingImages.length === 0 ? (
              <p className="empty-text">No current photos.</p>
            ) : (
              <div className="image-preview-grid">
                {existingImages.map((image) => (
                  <div className="image-preview-item" key={image.id}>
                    <img
                      src={
                        image.url.startsWith("/uploads")
                          ? `http://localhost:3000${image.url}`
                          : `/${image.url}`
                      }
                      alt="Listing"
                    />

                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => handleDeleteExistingImage(image.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Add new photos</label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                const newFiles = Array.from(event.target.files || []);
                setNewImageFiles((prev) => [...prev, ...newFiles]);
                event.target.value = "";
              }}
            />

            {newImageFiles.length > 0 && (
              <p className="selected-files-text">
                New selected photos: {newImageFiles.length}
              </p>
            )}

            {newImageFiles.length > 0 && (
              <div className="image-preview-grid">
                {newImageFiles.map((file, index) => (
                  <div className="image-preview-item" key={`${file.name}-${index}`}>
                    <img src={URL.createObjectURL(file)} alt={file.name} />

                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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