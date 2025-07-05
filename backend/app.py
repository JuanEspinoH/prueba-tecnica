import os
from flask import Flask, request, jsonify
from models import db,Usuario
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager,jwt_required

load_dotenv()

app=Flask(__name__)
CORS(app)
jwt = JWTManager() 
bcrypt = Bcrypt()  

app.config['SQLALCHEMY_DATABASE_URI'] =  os.getenv("CONNECTION_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db.init_app(app)

migrate = Migrate(app, db)


with app.app_context():
    db.create_all()


@app.route("/")
def hello_world():
    newUser=Usuario()
    db.session.add(newUser)
    db.session.commit()  
    return jsonify({"test":"pruebas"}),200


if __name__ == '__main__':
    app.run()