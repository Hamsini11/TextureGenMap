-- Drop existing tables if they exist (in correct order due to foreign key dependencies)
DROP TABLE IF EXISTS part_texture_categories CASCADE;
DROP TABLE IF EXISTS furniture_type_parts CASCADE;
DROP TABLE IF EXISTS textures CASCADE;
DROP TABLE IF EXISTS texture_categories CASCADE;
DROP TABLE IF EXISTS furniture_parts CASCADE;
DROP TABLE IF EXISTS furniture_types CASCADE;

-- Create tables with SERIAL IDs and proper foreign key relationships
CREATE TABLE furniture_types (
    id INTEGER PRIMARY KEY,  -- Not SERIAL since we'll specify IDs
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE furniture_parts (
    id INTEGER PRIMARY KEY,  -- Not SERIAL since we'll specify IDs
    name VARCHAR(100) NOT NULL
);

CREATE TABLE texture_categories (
    id INTEGER PRIMARY KEY,  -- Not SERIAL since we'll specify IDs
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE textures (
    id INTEGER PRIMARY KEY,  -- Not SERIAL since we'll specify IDs
    name VARCHAR(100) NOT NULL,
    category_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    preview_image_path VARCHAR(255) NOT NULL,
    thumbnail_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_texture_category
        FOREIGN KEY (category_id)
        REFERENCES texture_categories(id)
        ON DELETE CASCADE
);

CREATE TABLE furniture_type_parts (
    furniture_type_id INTEGER NOT NULL,
    furniture_part_id INTEGER NOT NULL,
    PRIMARY KEY (furniture_type_id, furniture_part_id),
    CONSTRAINT fk_furniture_type
        FOREIGN KEY (furniture_type_id)
        REFERENCES furniture_types(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_furniture_part
        FOREIGN KEY (furniture_part_id)
        REFERENCES furniture_parts(id)
        ON DELETE CASCADE
);

CREATE TABLE part_texture_categories (
    part_id INTEGER NOT NULL,
    texture_category_id INTEGER NOT NULL,
    PRIMARY KEY (part_id, texture_category_id),
    CONSTRAINT fk_part
        FOREIGN KEY (part_id)
        REFERENCES furniture_parts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_texture_category_part
        FOREIGN KEY (texture_category_id)
        REFERENCES texture_categories(id)
        ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_furniture_type_category ON furniture_types(category);
CREATE INDEX idx_texture_category ON textures(category_id);
CREATE INDEX idx_furniture_type_parts_type ON furniture_type_parts(furniture_type_id);
CREATE INDEX idx_furniture_type_parts_part ON furniture_type_parts(furniture_part_id);
CREATE INDEX idx_part_texture_categories_part ON part_texture_categories(part_id);
CREATE INDEX idx_part_texture_categories_category ON part_texture_categories(texture_category_id); 