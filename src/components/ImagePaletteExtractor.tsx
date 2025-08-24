'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractColors } from 'extract-colors';
import toast from 'react-hot-toast';

interface ImagePaletteExtractorProps {
  onPaletteExtracted: (colors: string[]) => void;
}

export default function ImagePaletteExtractor({ onPaletteExtracted }: ImagePaletteExtractorProps) {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        setImage(imageUrl);
        try {
          const extractedColors = await extractColors(imageUrl);
          const hexColors = extractedColors.map(color => color.hex);
          setColors(hexColors);
          onPaletteExtracted(hexColors);
          toast.success('Palette extracted successfully!');
        } catch (error) {
          console.error('Error extracting colors:', error);
          toast.error('Could not extract palette from image.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg border-gray-600 hover:border-gray-400 transition-colors">
      <div {...getRootProps()} className="w-full text-center cursor-pointer">
        <input {...getInputProps()} />
        {
          image ?
            <img src={image} alt="Uploaded image" className="w-full h-auto rounded-lg" /> :
            isDragActive ?
              <p>Drop the image here ...</p> :
              <p>Drag 'n' drop an image here, or click to select one</p>
        }
      </div>
      {colors.length > 0 && (
        <div className="flex flex-wrap justify-center mt-4">
          {colors.map((color, index) => (
            <div key={index} style={{ backgroundColor: color }} className="w-8 h-8 rounded-full m-1" />
          ))}
        </div>
      )}
    </div>
  );
}