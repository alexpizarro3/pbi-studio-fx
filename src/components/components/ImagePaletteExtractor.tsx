
import React, { useState } from 'react';
import getColors from 'get-image-colors';

interface ImagePaletteExtractorProps {
  onPaletteExtracted: (colors: string[]) => void;
}

const ImagePaletteExtractor: React.FC<ImagePaletteExtractorProps> = ({ onPaletteExtracted }) => {
  const [colors, setColors] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setImage(imageDataUrl);
        getColors(imageDataUrl, { count: 5 }).then(colors => {
          setColors(colors.map(color => color.hex()));
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleConfirm = () => {
    onPaletteExtracted(colors);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Extract Palette from Image</h2>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 border rounded"
        />
      </div>
      {image && (
        <div className="mb-4">
          <img src={image} alt="Uploaded" className="max-w-xs" />
        </div>
      )}
      {colors.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-2">Extracted Palette:</h3>
          <div className="flex">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleConfirm}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use this Palette
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePaletteExtractor;
