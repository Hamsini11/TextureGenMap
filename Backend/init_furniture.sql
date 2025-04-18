-- Insert furniture types with their categories
INSERT INTO furniture_types (id, name, category) VALUES
(1, 'Modern Sofa', 'sofa'),
(2, 'Classic Sofa', 'sofa'),
(3, 'Accent Chair', 'chair'),
(4, 'Dining Chair', 'chair'),
(5, 'Office Desk', 'desk'),
(6, 'Dining Table', 'table'),
(7, 'Coffee Table', 'table'),
(8, 'Side Table', 'table'),
(9, 'Platform Bed', 'bed');

-- Insert furniture parts
INSERT INTO furniture_parts (id, name) VALUES
(1, 'Seat Cushion'),
(2, 'Backrest'),
(3, 'Armrest'),
(4, 'Frame'),
(5, 'Legs'),
(6, 'Top Surface'),
(7, 'Headboard'),
(8, 'Footboard'),
(9, 'Platform');

-- Link furniture types to their parts
INSERT INTO furniture_type_parts (furniture_type_id, furniture_part_id) VALUES
-- Sofa (id: 1, 2)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),  -- Modern Sofa
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),  -- Classic Sofa

-- Chairs (id: 3, 4)
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5),  -- Accent Chair
(4, 1), (4, 2), (4, 4), (4, 5),          -- Dining Chair

-- Desk (id: 5)
(5, 6), (5, 4), (5, 5),  -- Office Desk

-- Tables (id: 6, 7, 8)
(6, 6), (6, 4), (6, 5),  -- Dining Table
(7, 6), (7, 4), (7, 5),  -- Coffee Table
(8, 6), (8, 4), (8, 5),  -- Side Table

-- Bed (id: 9)
(9, 7), (9, 8), (9, 9), (9, 4), (9, 5);  -- Platform Bed

-- Insert texture categories
INSERT INTO texture_categories (id, name, description) VALUES
(1, 'Fabric', 'Soft and comfortable fabric materials'),
(2, 'Leather', 'Premium leather materials'),
(3, 'Wood', 'Natural and processed wood materials'),
(4, 'Metal', 'Various metal finishes'),
(5, 'Glass', 'Clear and frosted glass options'),
(6, 'Stone', 'Natural and engineered stone materials');

-- Link parts to compatible texture categories
INSERT INTO part_texture_categories (part_id, texture_category_id) VALUES
-- Seat Cushion (id: 1)
(1, 1),  -- Fabric
(1, 2),  -- Leather

-- Backrest (id: 2)
(2, 1),  -- Fabric
(2, 2),  -- Leather

-- Armrest (id: 3)
(3, 1),  -- Fabric
(3, 2),  -- Leather

-- Frame (id: 4)
(4, 3),  -- Wood
(4, 4),  -- Metal

-- Legs (id: 5)
(5, 3),  -- Wood
(5, 4),  -- Metal

-- Top Surface (id: 6)
(6, 3),  -- Wood
(6, 4),  -- Metal
(6, 5),  -- Glass
(6, 6),  -- Stone

-- Headboard (id: 7)
(7, 1),  -- Fabric
(7, 2),  -- Leather
(7, 3),  -- Wood

-- Footboard (id: 8)
(8, 3),  -- Wood
(8, 4),  -- Metal

-- Platform (id: 9)
(9, 3),  -- Wood
(9, 4);  -- Metal

-- Insert textures
INSERT INTO textures (id, name, category_id, description, prompt, preview_image_path, thumbnail_path) VALUES
-- Fabric textures
(1, 'Blue Velvet', 1, 'Deep plush velvet texture with visible pile and light-catching surface, rich jewel-toned blue color', 'Deep blue velvet texture, high resolution', '/textures/fabric/velvet_blue.jpg', '/textures/thumbnails/fabric/velvet_blue.jpg'),
(2, 'Gray Linen', 1, 'Natural linen fabric with visible woven texture, modern gray tone', 'Gray linen fabric texture, high resolution', '/textures/fabric/linen_gray.jpg', '/textures/thumbnails/fabric/linen_gray.jpg'),
(3, 'Beige Cotton', 1, 'Soft cotton weave in warm beige, casual and comfortable', 'Beige cotton fabric texture, high resolution', '/textures/fabric/cotton_beige.jpg', '/textures/thumbnails/fabric/cotton_beige.jpg'),

-- Leather textures
(4, 'Brown Leather', 2, 'Premium full-grain leather with natural pores, rich brown color', 'Brown leather texture, high resolution', '/textures/leather/leather_brown.jpg', '/textures/thumbnails/leather/leather_brown.jpg'),
(5, 'Black Leather', 2, 'Smooth black leather with subtle grain pattern', 'Black leather texture, high resolution', '/textures/leather/leather_black.jpg', '/textures/thumbnails/leather/leather_black.jpg'),

-- Wood textures
(6, 'Oak Wood', 3, 'Natural oak wood grain with warm honey tones', 'Oak wood texture, high resolution', '/textures/wood/wood_oak.jpg', '/textures/thumbnails/wood/wood_oak.jpg'),
(7, 'Walnut Wood', 3, 'Rich dark walnut wood with distinctive grain pattern', 'Walnut wood texture, high resolution', '/textures/wood/wood_walnut.jpg', '/textures/thumbnails/wood/wood_walnut.jpg'),

-- Metal textures
(8, 'Brushed Steel', 4, 'Brushed stainless steel with linear grain pattern', 'Brushed steel texture, high resolution', '/textures/metal/metal_steel.jpg', '/textures/thumbnails/metal/metal_steel.jpg'),
(9, 'Brass', 4, 'Polished brass with warm golden tone', 'Brass metal texture, high resolution', '/textures/metal/metal_brass.jpg', '/textures/thumbnails/metal/metal_brass.jpg'),

-- Glass textures
(10, 'Clear Glass', 5, 'Transparent glass with subtle surface reflection', 'Clear glass texture, high resolution', '/textures/glass/glass_clear.jpg', '/textures/thumbnails/glass/glass_clear.jpg'),
(11, 'Frosted Glass', 5, 'Frosted glass with diffused light effect', 'Frosted glass texture, high resolution', '/textures/glass/glass_frosted.jpg', '/textures/thumbnails/glass/glass_frosted.jpg'),

-- Stone textures
(12, 'Marble', 6, 'White marble with gray veining', 'White marble texture, high resolution', '/textures/stone/stone_marble.jpg', '/textures/thumbnails/stone/stone_marble.jpg'),
(13, 'Granite', 6, 'Speckled granite in gray and black tones', 'Granite texture, high resolution', '/textures/stone/stone_granite.jpg', '/textures/thumbnails/stone/stone_granite.jpg'); 