import React, { useState } from 'react';

// Define prop types for ModelSelectionModal
interface ModelSelectionModalProps {
  closeModelSelection: () => void; // Function to close the modal
  selectModel: (imgSrc: string) => void; // Function to handle model selection
}

// Use the provided model data with the `/test.png` image
const models = [
  { id: 1, imgSrc: '/test.png', name: 'Model 1' },
  { id: 2, imgSrc: '/test.png', name: 'Model 2' },
  { id: 3, imgSrc: '/test.png', name: 'Model 3' },
  { id: 4, imgSrc: '/test.png', name: 'Model 4' },
  { id: 5, imgSrc: '/test.png', name: 'Model 5' },
  { id: 6, imgSrc: '/test.png', name: 'Model 6' },
];

const ModelSelectionModal: React.FC<ModelSelectionModalProps> = ({ closeModelSelection, selectModel }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedImage(event.target.files[0]);
    }
  };

  // Send the image to the backend API for processing
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setProcessing(true);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setProcessedImage(data.processed_image_url); // Assume the backend returns the processed image URL
      } else {
        console.error('Error processing image:', data.error);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-w-full p-8 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Select a Model</h2>

        {/* Display models for selection */}
        <div className="grid grid-cols-3 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="cursor-pointer text-center"
              onClick={() => selectModel(model.imgSrc)} // When a model is selected
            >
              <img
                src={model.imgSrc}
                alt={model.name}
                className="w-full h-auto rounded-lg hover:opacity-80 transition-opacity"
              />
              <p className="text-gray-500 mt-2">{model.name}</p>
            </div>
          ))}
        </div>

        {/* File input for uploading image */}
        <div className="mt-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        {/* Button to process image */}
        <div className="mt-6 text-center">
          <button
            onClick={handleImageUpload}
            disabled={processing}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {processing ? 'Processing...' : 'Apply Virtual Try-On'}
          </button>
        </div>

        {/* Display processed image */}
        {processedImage && (
          <div className="mt-6 text-center">
            <h3 className="font-bold text-lg">Processed Image</h3>
            <img
              src={processedImage}
              alt="Processed"
              className="w-full h-auto rounded-lg mt-4"
            />
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={closeModelSelection}
            className="text-red-500 font-semibold hover:text-red-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionModal;
