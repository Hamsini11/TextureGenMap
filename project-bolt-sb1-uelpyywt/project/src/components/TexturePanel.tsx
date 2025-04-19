import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import TextureSelector from './TextureSelector';

interface TexturePanelProps {
  isActive: boolean;
}

interface FurnitureType {
  id: number;
  name: string;
  category: string;
}

interface FurniturePart {
  id: number;
  name: string;
}

const TexturePanel: React.FC<TexturePanelProps> = ({ isActive }) => {
  const [selectedTexture, setSelectedTexture] = useState<number | null>(null);
  const [furnitureTypes, setFurnitureTypes] = useState<FurnitureType[]>([]);
  const [selectedFurnitureType, setSelectedFurnitureType] = useState<number | null>(null);
  const [furnitureParts, setFurnitureParts] = useState<FurniturePart[]>([]);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch furniture types when component mounts
  useEffect(() => {
    const fetchFurnitureTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/furniture-types');
        const data = await response.json();
        if (data.success) {
          setFurnitureTypes(data.data);
        } else {
          setError(data.error || 'Failed to load furniture types');
        }
      } catch (error) {
        setError('Error loading furniture types');
      } finally {
        setLoading(false);
      }
    };

    if (isActive) {
      fetchFurnitureTypes();
    }
  }, [isActive]);

  // Fetch parts when furniture type is selected
  useEffect(() => {
    const fetchParts = async () => {
      if (!selectedFurnitureType) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/furniture-parts?furniture_type_id=${selectedFurnitureType}`);
        const data = await response.json();
        if (data.success) {
          setFurnitureParts(data.data);
        } else {
          setError(data.error || 'Failed to load furniture parts');
        }
        setSelectedPart(null); // Reset selected part when furniture type changes
      } catch (error) {
        setError('Error loading furniture parts');
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [selectedFurnitureType]);

  if (!isActive) {
    return (
      <div className="rounded-2xl p-8 bg-gradient-to-br from-pink-500 to-pink-600">
        <h2 className="text-2xl font-bold text-white mb-2">
          Texture Options
        </h2>
        <p className="text-white/90 text-lg">
          Upload an image to start generating textures
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Texture Options</h2>
          <button className="flex items-center px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors duration-200">
            <RefreshCw className="h-5 w-5 mr-2" />
            Regenerate
          </button>
        </div>

        {/* Furniture Type Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Select Furniture Type
          </label>
          <select
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg p-2"
            value={selectedFurnitureType || ''}
            onChange={(e) => setSelectedFurnitureType(Number(e.target.value))}
          >
            <option value="">Choose a furniture type</option>
            {furnitureTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Part Selection */}
        {selectedFurnitureType && (
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Select Part
            </label>
            <select
              className="w-full bg-white/20 text-white border border-white/30 rounded-lg p-2"
              value={selectedPart || ''}
              onChange={(e) => setSelectedPart(Number(e.target.value))}
            >
              <option value="">Choose a part</option>
              {furnitureParts.map((part) => (
                <option key={part.id} value={part.id}>
                  {part.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Texture Selection */}
        {selectedFurnitureType && selectedPart && (
          <TextureSelector
            furnitureTypeId={selectedFurnitureType}
            partId={selectedPart}
            onSelect={setSelectedTexture}
          />
        )}

        {/* Generated Variations */}
        {selectedTexture && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Generated Variations</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-xl overflow-hidden bg-white/20 aspect-square"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white/50 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-black/30 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-white text-sm font-medium text-center">
                      Apply Variation {index + 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTexture && (
          <button className="mt-8 w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl transition-colors duration-200 font-bold text-lg">
            Download Result
          </button>
        )}
      </div>
    </div>
  );
};

export default TexturePanel;