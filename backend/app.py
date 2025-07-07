import os
import re
from datetime import timedelta
from flask import Flask, request, jsonify
from models import db,Usuario
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_jwt_extended import  JWTManager,create_access_token, jwt_required, get_jwt_identity
load_dotenv()

app=Flask(__name__)
CORS(app)
jwt = JWTManager(app) 
bcrypt = Bcrypt(app)  

app.config["JWT_SECRET_KEY"]=os.getenv('FLASK_APP_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] =  os.getenv("CONNECTION_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db.init_app(app)

migrate = Migrate(app, db)


with app.app_context():
    db.create_all()


@app.route("/")
def hello_world():

    return jsonify({"test":"pruebas"}),200

@app.route("/register",methods=["POST"])
def register():
    try:
        data=request.get_json()
        username=data.get("username")
        email=data.get("email")
        password=data.get("password")
        # Validaciones, si existe el campo,el tipo sea string, la longitud y si el email tiene formato correcto  
        if username is None  or username == "":
            return jsonify({
                "msg":"Falta el nombre de usuario"
            }),400
        elif type(username) != str:
            return jsonify({
                "msg":"El nombre debe de ser texto"
            }),400
        elif len(username) > 15:
            return jsonify({
                "msg":"El nombre de usuario no debe de ser mayor a 15 caracteres"
            }),400
        
        if email is None  or email == "":
            return jsonify({
                "msg":"Falta el correo electronico"
            }),400
        elif type(email) != str:
            return jsonify({
                "msg":"El email no debe de ser texto"
            }),400
        elif len(email) > 20:
            return jsonify({
                "msg":"El email no debe de ser mayor a 20 caracteres"
            }),400
        elif bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$',email )) ==False:
            return jsonify({
                "msg":"Formato de email no valido"
                
            }),400
        
        if password is None  or password == "":
            return jsonify({
                "msg":"Falta la contraseña"
            }),400
        elif type(password) != str:
            return jsonify({
                "msg":"La contraseña no debe de ser texto"
            }),400
        
        revisarEmail=Usuario.query.filter(Usuario.email==email).first()
        if revisarEmail != None:
            return jsonify({
                "msg":"Email ya registrado"
            }),400
        
        # hasheasr contraseña
        contra_hasheada=bcrypt.generate_password_hash(password).decode("utf-8")

        nuevoUsuario=Usuario(username=username,email=email,password=contra_hasheada)
        db.session.add(nuevoUsuario)
        db.session.commit()

        return jsonify({"msg":"Se creo el usuario correctamente",
                        "data":nuevoUsuario.serialize()}),200
    except Exception as e:
        return jsonify({
            "msg":str(e)
        }),400
    

@app.route("/login",methods=["POST"])
def login():
    try:
        data=request.get_json()
        password=data.get("password")
        email=data.get("email")
            
        if password is None  or password == "":
                return jsonify({
                    "msg":"Falta la contraseña"
                }),400
        elif type(password) != str:
                return jsonify({
                    "msg":"La contraseña no debe de ser texto"
                }),400   
        if email is None  or email == "":
                return jsonify({
                    "msg":"Falta el correo electronico"
                }),400
        elif type(email) != str:
                return jsonify({
                    "msg":"El email no debe de ser texto"
                }),400
        elif len(email) > 20:
                return jsonify({
                    "msg":"El email no debe de ser mayor a 20 caracteres"
                }),400
        elif bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$',email )) ==False:
                return jsonify({
                    "msg":"Formato de email no valido"
                    
                }),400
            
        if password is None  or password == "":
                return jsonify({
                    "msg":"Falta la contraseña"
                }),400
        elif type(password) != str:
                return jsonify({
                    "msg":"La contraseña no debe de ser texto"
                }),400

        revisarEmail=Usuario.query.filter_by(email=email).first()
        if not revisarEmail:
              return jsonify({
                    "msg":"Email no registrado"
              }),400
        
        contra_hash=revisarEmail.password
        es_valido=bcrypt.check_password_hash(contra_hash,password)

        if es_valido:
            expires=timedelta(days=1)
            token=create_access_token(identity=str(revisarEmail.id),expires_delta=expires)
            return jsonify({
                 "msg":"Inicio de sesion exitosa",
                 "data":revisarEmail.serialize(),
                 "token":token
            }),200
        else:
            return jsonify({
                  "msg":"Constraseña incorrecta"
            }),400
    except Exception as e:
        return jsonify({
            "msg":str(e)
        })

@app.route("/self",methods=["GET"])
@jwt_required()
def selfInfo():
    try:
        user_id=get_jwt_identity()

        userInfo=Usuario.query.filter_by(id=user_id).first()

        if userInfo == None:
            return jsonify({
                "msg":"No encontrado"
            }),400

        return jsonify(userInfo.serialize()),200
    
    except Exception as e:
        return jsonify({
            "error":str(e)
        }),400

if __name__ == '__main__':
    app.run()