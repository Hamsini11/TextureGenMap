from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:root@localhost:5432/texturedb')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Association table for furniture type parts
furniture_type_parts = db.Table('furniture_type_parts',
    db.Column('furniture_type_id', db.Integer, db.ForeignKey('furniture_types.id'), primary_key=True),
    db.Column('furniture_part_id', db.Integer, db.ForeignKey('furniture_parts.id'), primary_key=True)
)

# Association table for part texture categories
part_texture_categories = db.Table('part_texture_categories',
    db.Column('part_id', db.Integer, db.ForeignKey('furniture_parts.id'), primary_key=True),
    db.Column('texture_category_id', db.Integer, db.ForeignKey('texture_categories.id'), primary_key=True)
)

class TextureCategory(db.Model):
    __tablename__ = 'texture_categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    textures = db.relationship('Texture', backref='category', lazy=True)
    compatible_parts = db.relationship('FurniturePart', secondary=part_texture_categories, back_populates='compatible_textures')

class FurniturePart(db.Model):
    __tablename__ = 'furniture_parts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    compatible_textures = db.relationship('TextureCategory', secondary=part_texture_categories, back_populates='compatible_parts')
    furniture_types = db.relationship('FurnitureType', secondary=furniture_type_parts, back_populates='parts')

class FurnitureType(db.Model):
    __tablename__ = 'furniture_types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    parts = db.relationship('FurniturePart', secondary=furniture_type_parts, back_populates='furniture_types')

class Texture(db.Model):
    __tablename__ = 'textures'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('texture_categories.id', ondelete='CASCADE'))
    description = db.Column(db.Text, nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    negative_prompt = db.Column(db.Text)
    preview_image_path = db.Column(db.String(255), nullable=False)
    thumbnail_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

# Routes
@app.route('/api/texture-options', methods=['GET'])
def get_texture_options():
    try:
        furniture_category = request.args.get('furniture_category', '').lower()
        
        if furniture_category:
            # Get all furniture types with this category
            furniture_types = FurnitureType.query.filter(
                FurnitureType.category.ilike(furniture_category)
            ).all()
            
            if furniture_types:
                # Get all parts for these furniture types
                part_ids = []
                for furniture in furniture_types:
                    part_ids.extend([part.id for part in furniture.parts])
                
                # Remove duplicates
                part_ids = list(set(part_ids))
                
                # Get all texture categories compatible with these parts
                texture_categories = db.session.query(TextureCategory)\
                    .join(part_texture_categories)\
                    .filter(part_texture_categories.c.part_id.in_(part_ids))\
                    .distinct().all()
                
                # Get all textures from these categories
                textures = Texture.query.filter(
                    Texture.category_id.in_([cat.id for cat in texture_categories])
                ).all()
                
                if not textures:
                    return jsonify({
                        'success': True,
                        'data': [],
                        'message': f'No textures found for {furniture_category}'
                    }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': f'Furniture category "{furniture_category}" not found'
                }), 404
        else:
            # If no category specified, return all textures
            textures = Texture.query.all()
        
        texture_options = []
        for texture in textures:
            texture_data = {
                'id': texture.id,
                'name': texture.name,
                'category': texture.category.name,
                'description': texture.description,
                'previewImage': texture.preview_image_path,
                'thumbnail': texture.thumbnail_path
            }
            texture_options.append(texture_data)
        
        return jsonify({
            'success': True,
            'data': texture_options,
            'furniture_category': furniture_category if furniture_category else 'all'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/texture-categories', methods=['GET'])
def get_texture_categories():
    try:
        categories = TextureCategory.query.all()
        categories_data = []
        
        for category in categories:
            category_data = {
                'id': category.id,
                'name': category.name,
                'description': category.description,
                'textureCount': len(category.textures)
            }
            categories_data.append(category_data)
        
        return jsonify({
            'success': True,
            'data': categories_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Add a new endpoint to get available furniture types
@app.route('/api/furniture-types', methods=['GET'])
def get_furniture_types():
    try:
        furniture_types = FurnitureType.query.all()
        types_data = [{
            'id': ft.id,
            'name': ft.name,
            'category': ft.category
        } for ft in furniture_types]
        
        return jsonify({
            'success': True,
            'data': types_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Add a new endpoint to get available furniture categories
@app.route('/api/furniture-categories', methods=['GET'])
def get_furniture_categories():
    try:
        # Get distinct categories from furniture_types table
        categories = db.session.query(FurnitureType.category)\
            .distinct()\
            .order_by(FurnitureType.category)\
            .all()
        
        categories_data = [{'category': cat[0]} for cat in categories]
        
        return jsonify({
            'success': True,
            'data': categories_data
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/furniture/categories', methods=['GET'])
def get_furniture_categories_new():
    categories = db.session.query(FurnitureType.category).distinct().all()
    return jsonify([category[0] for category in categories])

@app.route('/api/furniture/types/<category>', methods=['GET'])
def get_furniture_types_new(category):
    types = FurnitureType.query.filter_by(category=category).all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'category': t.category
    } for t in types])

@app.route('/api/furniture/<int:furniture_type_id>/parts', methods=['GET'])
def get_furniture_parts(furniture_type_id):
    furniture_type = FurnitureType.query.get_or_404(furniture_type_id)
    return jsonify([{
        'id': part.id,
        'name': part.name
    } for part in furniture_type.parts])

@app.route('/api/parts/<int:part_id>/textures', methods=['GET'])
def get_compatible_textures(part_id):
    part = FurniturePart.query.get_or_404(part_id)
    textures = []
    for category in part.compatible_textures:
        for texture in category.textures:
            textures.append({
                'id': texture.id,
                'name': texture.name,
                'category': category.name,
                'description': texture.description,
                'preview_image_path': texture.preview_image_path,
                'thumbnail_path': texture.thumbnail_path
            })
    return jsonify(textures)

@app.route('/api/textures/categories', methods=['GET'])
def get_texture_categories_new():
    categories = TextureCategory.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description
    } for c in categories])

@app.route('/api/textures/category/<int:category_id>', methods=['GET'])
def get_textures_by_category(category_id):
    textures = Texture.query.filter_by(category_id=category_id).all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'description': t.description,
        'preview_image_path': t.preview_image_path,
        'thumbnail_path': t.thumbnail_path
    } for t in textures])

if __name__ == '__main__':
    app.run(debug=True, port=5000) 