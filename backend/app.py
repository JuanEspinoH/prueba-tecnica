import os
import re
import uuid
from datetime import timedelta
from flask import Flask, request, jsonify
from models import db,Usuario,Tarea
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from flask_jwt_extended import  JWTManager,create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail,Message
load_dotenv()

app=Flask(__name__)
CORS(app)
jwt = JWTManager(app) 
bcrypt = Bcrypt(app)  


app.config["JWT_SECRET_KEY"]=os.getenv('FLASK_APP_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] =  os.getenv("CONNECTION_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

app.config['MAIL_SERVER'] =  os.getenv("MAIL_SERVER")
app.config['MAIL_PORT'] =  os.getenv("MAIL_PORT")
app.config['MAIL_USERNAME'] =  os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] =  os.getenv("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] =  False
app.config['MAIL_USE_SSL'] =  True

mail=Mail(app)
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

@app.route("/tasks",methods=["GET"])
@jwt_required()
def get_tasks():
    try:
        user_id=get_jwt_identity()

        usuario=Usuario.query.filter_by(id=user_id).first()

        if usuario ==None:
            return jsonify({
                "msg":"Usuario no encontrado"
            }),400
            
        
        tareas=Tarea.query.filter_by(user_id=user_id).all()
        if not tareas:
            return jsonify({
                "msg": "No hay tareas creadas",
                "data": []
            }), 200
        
        tareas_data = [tarea.serialize() for tarea in tareas]
        
        return jsonify({
            "msg": "Tareas obtenidas correctamente",
            "data": tareas_data
        }), 200

    except Exception as e:
        return jsonify({
            "msg":str(e)
        })

@app.route("/tasks",methods=["POST"])
@jwt_required()
def add_task():
    try:
        user_id=get_jwt_identity()
        data=request.get_json()
        label=data.get("label")

        usuario=Usuario.query.filter_by(id=user_id).first()

        if usuario ==None:
            return jsonify({
                "msg":"Usuario no encontrado"
            }),400

        if type(label) !=str:
            return jsonify({
                "msg":"El mensaje debe de ser texto"
            }),400
        if label is None  or label == "":
            return jsonify({
                "msg":"El mensaje no debe de estar vacio"
            }),400
        
        tareaNueva=Tarea(label=label,user_id=user_id)

        db.session.add(tareaNueva)
        db.session.commit()
        print(tareaNueva.serialize())

        return jsonify({
            "msg":"Tarea creada correctamente",
            "data":tareaNueva.serialize()
        }),200
    
    except Exception as e:
        return jsonify({
            "msg":str(e)
        })
  

@app.route("/tasks",methods=["PUT"])
@jwt_required()
def put_task():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        label = data.get("label")
        completed=data.get("completed")
        task_id=data.get("id")
        usuario = Usuario.query.filter_by(id=user_id).first()
        
        if usuario is None:
            return jsonify({
                "msg": "Usuario no encontrado"
            }), 400
        
        tarea = Tarea.query.filter_by(id=task_id, user_id=user_id).first()

        if tarea is None:
            return jsonify({
                "msg": "Tarea no encontrada"
            }), 400
        
        if type(label) != str:
            return jsonify({
                "msg": "El mensaje debe de ser texto"
            }), 400
        
        if label is None or label == "":
            return jsonify({
                "msg": "El mensaje no debe de estar vacio"
            }), 400
    
        tarea.label = label
        tarea.completed=completed
        print(label)
        print(completed)
        print(tarea)
        db.session.commit()
        
        return jsonify({
            "msg": "Tarea actualizada correctamente",
            "data": tarea.serialize()
        }), 200
    
    except Exception as e:
        return jsonify({
            "msg": str(e)
        }), 400


@app.route("/tasks",methods=["DELETE"])
@jwt_required()
def del_task():
    try:
        data=request.get_json()
        user_id = get_jwt_identity()
        task_id=data.get("id")
        usuario = Usuario.query.filter_by(id=user_id).first()
        
        if usuario is None:
            return jsonify({
                "msg": "Usuario no encontrado"
            }), 400
        
        tarea = Tarea.query.filter_by(id=task_id, user_id=user_id).first()
        if tarea is None:
            return jsonify({
                "msg": "Tarea no encontrada"
            }), 400
        
        db.session.delete(tarea)
        db.session.commit()
        
        return jsonify({
            "msg": "Tarea eliminada correctamente"
        }), 200
    
    except Exception as e:
        return jsonify({
            "msg": str(e)
        }), 400

@app.route("/recuperar-contraseña",methods=["POST"])
def recuperacion():
    try:
        data =request.get_json()
        email=data.get("email")

        usuario=Usuario.query.filter_by(email=email).first()
 
        if usuario is None:
            return jsonify({
                "msg":"Correo no registrado"
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
        
    
        token_id=str(uuid.uuid4())

        token_repetido=Usuario.query.filter_by(token=token_id).all()

        
        if len(token_repetido) != 0:
            print("nada")
        
        usuario.token=token_id
        db.session.commit()
        
        msg=Message("Recuperer contraseña.",sender=os.getenv("MAIL_USERNAME"),recipients=[usuario.serialize()["email"]])
        msg.body=f"Este es el link para recuperar la contraseña: http://localhost:5173/reescribir-password/{token_id}"
        mail.send(msg)
        
        return jsonify({
            "msg":"Correo enviado correctamente"
        })
    
    except Exception as e:
        return jsonify({
            "msg": str(e)
        }), 400
    
@app.route("/reescribir-contraseña",methods=["POST"])
def reescribir_check():
    try:
        data =request.get_json()
        token=data.get("token")

        check_token=Usuario.query.filter_by(token=token).first()

        if check_token is None:
            return jsonify({
                "msg":"No se ha enviado correo de recuperacion de contraseña"
            }),400
        
        return jsonify({
            "data":True
        })
    
    except Exception as e:
        return jsonify({
            "msg": str(e)
        }), 400
    
@app.route("/reescribir-contraseña-form",methods=["POST"])
def reescribir_form():
    try:

        data =request.get_json()
        token=data.get("token")
        new_password=data.get("password")

        ususario=Usuario.query.filter_by(token=token).first()
        if new_password is None  or new_password == "":
            return jsonify({
                "msg":"Falta la contraseña"
            }),400
        elif type(new_password) != str:
            return jsonify({
                "msg":"La contraseña no debe de ser texto"
            }),400

        if ususario is None:
            return jsonify({
                "msg":"No se ha enviado correo de recuperacion de contraseña"
            }),400
        
        contra_hasheada=bcrypt.generate_password_hash(new_password).decode("utf-8")
        ususario.password=contra_hasheada
        ususario.token=""
        db.session.commit()

        return jsonify({
            "msg":"Contraseña actucalizada correctamente"
        })
    
    except Exception as e:
        return jsonify({
            "msg": str(e)
        }), 400
    

if __name__ == '__main__':
    app.run()