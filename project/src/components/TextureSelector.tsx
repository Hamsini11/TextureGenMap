import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActionArea, CircularProgress, Alert } from '@mui/material';

interface Texture {
  id: number;
  name: string;
  category: string;
  preview_image_path: string;
  thumbnail_path: string;
}

interface TextureSelectorProps {
  furnitureTypeId: number;
  partId: number;
  onTextureSelect: (texture: Texture) => void;
}

const TextureSelector: React.FC<TextureSelectorProps> = ({ furnitureTypeId, partId, onTextureSelect }) => {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTextures = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/texture-options?furniture_type_id=${furnitureTypeId}&part_id=${partId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch textures: ${response.statusText}`);
        }
        
        const data = await response.json();
        setTextures(data);
      } catch (err) {
        console.error('Error fetching textures:', err);
        setError('Failed to load texture options. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (furnitureTypeId && partId) {
      fetchTextures();
    }
  }, [furnitureTypeId, partId]);

  if (loading) {
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

  if (textures.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No texture options available for this furniture part.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Available Textures
      </Typography>
      <Grid container spacing={2}>
        {textures.map((texture) => (
          <Grid item xs={6} sm={4} md={3} key={texture.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 3
                }
              }}
            >
              <CardActionArea onClick={() => onTextureSelect(texture)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={texture.thumbnail_path}
                  alt={texture.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {texture.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {texture.category}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TextureSelector; 