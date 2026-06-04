import { useState } from "react";
import { Page } from "../enums/page.enums";

type AddListingPageProps = {
  setPage: (page: Page) => void;
};

export default function AddListingPage({ setPage }: AddListingPageProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
    type: "",
    description: "",
    price: "",
  });

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

  const handleRemoveImage = (indexToRemove: number) => {
    setImageFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmitListing = async (event: React.FormEvent) => {
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

      imageFiles.forEach((file) => {
        data.append("images", file);
      });

      const response = await fetch("http://localhost:3000/api/properties", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();

        setError(
          errorData.errorMessage ||
          errorData.message ||
          "Failed to create listing"
        );

        return;
      }

      setPage(Page.MyListings);
    } catch {
      setError("Failed to create listing");
    }
  };

  return (
    <main className="add-listing-page">
      <section className="add-listing-card">
        <div className="add-listing-header">
          <h1>Add new listing</h1>
          <p>
            New listings are created with pending status and must be approved by
            an administrator.
          </p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form className="listing-form" onSubmit={handleSubmitListing}>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                name="title"
                placeholder="For example Tallinn Center Apartment"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                name="city"
                placeholder="For example Tallinn"
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
                placeholder="For example Narva mnt 10"
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
              placeholder="Write a short description of the listing"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
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
              <label>Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const newFiles = Array.from(event.target.files || []);
                  setImageFiles((prev) => [...prev, ...newFiles]);
                  event.target.value = "";
                }}
              />

              {imageFiles.length > 0 && (
                <p className="selected-files-text">
                  Selected photos: {imageFiles.length}
                </p>
              )}
            </div>
          </div>

          {imageFiles.length > 0 && (
            <div className="image-preview-grid">
              {imageFiles.map((file, index) => (
                <div className="image-preview-item" key={`${file.name}-${index}`}>
                  <img src={URL.createObjectURL(file)} alt={file.name} />

                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button className="btn-primary" type="submit">
              Create listing
            </button>

            <button
              className="btn-secondary"
              type="button"
              onClick={() => setPage(Page.Home)}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}