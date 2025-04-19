from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../project-bolt-sb1-uelpyywt/project/public')
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}})

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
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    textures = db.relationship('Texture', backref='category', lazy=True)

class FurniturePart(db.Model):
    __tablename__ = 'furniture_parts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    furniture_types = db.relationship('FurnitureType', secondary=furniture_type_parts, backref=db.backref('parts', lazy=True))
    texture_categories = db.relationship('TextureCategory', secondary=part_texture_categories, backref=db.backref('compatible_parts', lazy=True))

class FurnitureType(db.Model):
    __tablename__ = 'furniture_types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)

class Texture(db.Model):
    __tablename__ = 'textures'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('texture_categories.id'), nullable=False)
    preview_image_path = db.Column(db.String(200), nullable=False)
    thumbnail_path = db.Column(db.String(200), nullable=False)

# Routes
@app.route('/api/texture-options')
def get_texture_options():
    furniture_type_id = request.args.get('furniture_type_id', type=int)
    part_id = request.args.get('part_id', type=int)
    
    if not furniture_type_id or not part_id:
        return jsonify({
            'success': False,
            'error': 'Missing required parameters'
        }), 400
    
    try:
        # Get the furniture part
        part = FurniturePart.query.get(part_id)
        if not part:
            return jsonify({
                'success': False,
                'error': 'Furniture part not found'
            }), 404
        
        # Get compatible texture categories for this part
        category_ids = [category.id for category in part.texture_categories]
        
        # Get textures from these categories
        textures = Texture.query.filter(Texture.category_id.in_(category_ids)).all()
        
        # Format the response
        result = []
        for texture in textures:
            result.append({
                'id': texture.id,
                'name': texture.name,
                'category': texture.category.name,
                'preview_image_path': texture.preview_image_path,
                'thumbnail_path': texture.thumbnail_path,
                'description': texture.description,
                'partName': part.name
            })
        
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/furniture-types')
def get_furniture_types():
    try:
        types = FurnitureType.query.all()
        result = []
        for type_obj in types:
            result.append({
                'id': type_obj.id,
                'name': type_obj.name,
                'category': type_obj.category
            })
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/furniture-parts')
def get_furniture_parts():
    furniture_type_id = request.args.get('furniture_type_id', type=int)
    if not furniture_type_id:
        return jsonify({
            'success': False,
            'error': 'Missing furniture_type_id parameter'
        }), 400
    
    try:
        # Get parts for the specified furniture type
        furniture_type = FurnitureType.query.get(furniture_type_id)
        if not furniture_type:
            return jsonify({
                'success': False,
                'error': 'Furniture type not found'
            }), 404
        
        parts = furniture_type.parts
        result = []
        for part in parts:
            result.append({
                'id': part.id,
                'name': part.name,
                'furniture_type_id': furniture_type_id
            })
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/texture-categories')
def get_texture_categories():
    categories = TextureCategory.query.all()
    result = []
    for category in categories:
        result.append({
            'id': category.id,
            'name': category.name,
            'description': category.description
        })
    return jsonify(result)

# Serve static files from the public directory
@app.route('/textures/<path:filename>')
def serve_texture(filename):
    return send_from_directory(app.static_folder + '/textures', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 