import { useState } from "react";
import { readFileAsDataURL } from "../utils/fileHelpers";

/**
 * Custom hook for handling image uploads.
 */
export const useImageUpload = () => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const dataUrl = await readFileAsDataURL(files[0]);
      setImage(dataUrl);
    } catch (err) {
      setError("Failed to read image file.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setError(null);
  };

  return {
    image,
    handleImageChange,
    resetImage,
    isUploading,
    error,
  };
};
