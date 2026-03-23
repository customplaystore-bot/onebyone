/**
 * Reads a File object and returns a Data URL.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Downloads a data URL as a file.
 * @param {string} dataUrl 
 * @param {string} filename 
 */
export const downloadDataURL = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
};
