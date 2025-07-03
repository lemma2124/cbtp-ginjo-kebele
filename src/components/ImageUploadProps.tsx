import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";

interface ImageUploadProps {
  label: string;
  onImageUpload: (file: File | null) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onImageUpload,
  currentImage,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload(null);
  };

  return (
    <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
      <Label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </Label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-32 object-cover rounded-lg"
          />
          <Button
            onClick={removeImage}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              Click to upload {label}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
          </div>
          <input
            id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </Card>
  );
};

export default ImageUpload;
