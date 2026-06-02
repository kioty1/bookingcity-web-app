import { useState } from "react";

type ImageType = {
  id: number;
  propertyId: number;
  url: string;
};

type ImageCarouselProps = {
  images?: ImageType[];
  title: string;
};

export function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const getImageUrl = (url: string) => {
    if (url.startsWith("/uploads")) {
      return `http://localhost:3000${url}`;
    }

    if (url.startsWith("images/")) {
      return `/${url}`;
    }

    return url;
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="carousel">
      <img
        className="property-image"
        src={getImageUrl(images[currentIndex].url)}
        alt={title}
      />

      {images.length > 1 && (
        <>
          <button className="carousel-btn carousel-btn-left" onClick={previousImage}>
            ‹
          </button>

          <button className="carousel-btn carousel-btn-right" onClick={nextImage}>
            ›
          </button>

          <span className="carousel-counter">
            {currentIndex + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}