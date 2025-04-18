import React, { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import TextureSelector from './TextureSelector';

interface TexturePanelProps {
  isActive: boolean;
}

const TexturePanel: React.FC<TexturePanelProps> = ({ isActive }) => {
  const [selectedTexture, setSelectedTexture] = useState<number | null>(null);
  const [furnitureCategory] = useState<string>('sofa');

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

        <TextureSelector
          furnitureCategory={furnitureCategory}
          onSelect={setSelectedTexture}
        />

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

        <button className="mt-8 w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-xl transition-colors duration-200 font-bold text-lg">
          Download Result
        </button>
      </div>
    </div>
  );
};

export default TexturePanel;