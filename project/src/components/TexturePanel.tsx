import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Divider, Alert, CircularProgress, SelectChangeEvent } from '@mui/material';
import TextureSelector from './TextureSelector';

interface FurnitureType {
  id: number;
  name: string;
  category: string;
}

interface FurniturePart {
  id: number;
  name: string;
  furniture_type_id: number;
}

interface Texture {
  id: number;
  name: string;
  category: string;
  preview_image_path: string;
  thumbnail_path: string;
}

const TexturePanel: React.FC = () => {
  const [furnitureTypes, setFurnitureTypes] = useState<FurnitureType[]>([]);
  const [furnitureParts, setFurnitureParts] = useState<FurniturePart[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFurnitureTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/furniture-types');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch furniture types: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFurnitureTypes(data);
      } catch (err) {
        console.error('Error fetching furniture types:', err);
        setError('Failed to load furniture types. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFurnitureTypes();
  }, []);

  useEffect(() => {
    const fetchFurnitureParts = async () => {
      if (!selectedType) {
        setFurnitureParts([]);
        setSelectedPart('');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/furniture-parts?furniture_type_id=${selectedType}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch furniture parts: ${response.statusText}`);
        }
        
        const data = await response.json();
        setFurnitureParts(data);
      } catch (err) {
        console.error('Error fetching furniture parts:', err);
        setError('Failed to load furniture parts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFurnitureParts();
  }, [selectedType]);

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value);
  };

  const handlePartChange = (event: SelectChangeEvent<string>) => {
    setSelectedPart(event.target.value);
  };

  const handleTextureSelect = (texture: Texture) => {
    console.log('Selected texture:', texture);
    // Here you would implement the logic to apply the texture to the 3D model
    // This could involve calling a function from a parent component or a global state manager
  };

  if (loading && furnitureTypes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Texture Selection
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="furniture-type-label">Furniture Type</InputLabel>
          <Select
            labelId="furniture-type-label"
            id="furniture-type-select"
            value={selectedType}
            label="Furniture Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="">
              <em>Select a furniture type</em>
            </MenuItem>
            {furnitureTypes.map((type) => (
              <MenuItem key={type.id} value={type.id.toString()}>
                {type.name} ({type.category})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {selectedType && (
          <FormControl fullWidth>
            <InputLabel id="furniture-part-label">Furniture Part</InputLabel>
            <Select
              labelId="furniture-part-label"
              id="furniture-part-select"
              value={selectedPart}
              label="Furniture Part"
              onChange={handlePartChange}
            >
              <MenuItem value="">
                <em>Select a part</em>
              </MenuItem>
              {furnitureParts.map((part) => (
                <MenuItem key={part.id} value={part.id.toString()}>
                  {part.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        {selectedType && selectedPart && (
          <TextureSelector
            furnitureTypeId={parseInt(selectedType)}
            partId={parseInt(selectedPart)}
            onTextureSelect={handleTextureSelect}
          />
        )}
      </Box>
    </Paper>
  );
};

export default TexturePanel; 