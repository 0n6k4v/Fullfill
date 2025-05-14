import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

const PhotoUploader = ({ files = [], setFiles, updateFormProgress }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);

      // Update form progress
      updateFormProgress();
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);

      // Update form progress
      updateFormProgress();
    }
  };

  // Remove file
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    // Update form progress
    updateFormProgress();
  };

  return (
    <div className="mb-8">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Upload photos (optional)
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"} transition-colors`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <div className="mx-auto flex justify-center">
            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl text-gray-400" />
          </div>
          <div className="text-gray-700">
            <span className="font-medium">
              Drag and drop files here
            </span>{" "}
            or
            <label className="ml-1 text-blue-600 hover:text-blue-700 cursor-pointer">
              browse files
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Upload images that show what you're looking for (PNG, JPG,
            GIF up to 10MB)
          </p>
        </div>
      </div>

      {/* File Preview */}
      {files?.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="h-24 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;