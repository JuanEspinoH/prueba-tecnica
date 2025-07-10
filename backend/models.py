from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, ForeignKey,String

db = SQLAlchemy()
# id, username, email,
# password (hashed).
# id, label, completed, user_id

class Usuario(db.Model):
    __tablename__="usuarios"
    id = db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(15),nullable=False)
    email=db.Column(db.String(20),nullable=False,unique=True)
    password=db.Column(db.String,nullable=False)
    token=db.Column(db.String,nullable=False,default="")

    def serialize(self):
        return{
            "id":self.id,
            "username":self.username,
            "email":self.email,
            }

class Tarea(db.Model):
    __tablename__="tareas"
    id = db.Column(db.Integer, primary_key=True)
    label=db.Column(db.String,nullable=False)
    completed=db.Column(db.Boolean,nullable=False,default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'))
    def serialize(self):
                return{
                    "id":self.id,
                    "label":self.label,
                    "completed":self.completed,
                    "user_id":self.user_id,
                    }