import os
from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv

load_dotenv()

app=Flask(__name__)

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
PASSWORD = os.getenv("password")

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

app.config['SQLALCHEMY_DATABASE_URI'] =  os.getenv("CONNECTION_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 

db = SQLAlchemy(app)

migrate = Migrate(app, db)

class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    def __repr__(self):
        return f"<Product {self.name}>"
    # 111
class Frutas(db.Model):
    __tablename__ = "frutas"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    def __repr__(self):
        return f"<Fruta {self.name}>"
    
with app.app_context():
    db.create_all()

@app.route("/test")
def hello_world2():
    print("test")
    apple = Frutas(name="Apple")
    range = Frutas(name="Orange")
    anana = Frutas(name="Banana")
    db.session.add_all([apple, range, anana])
    db.session.commit()
    print(Frutas.query.all())
    return "<p>Hello, World!</p>"

@app.route("/")
def hello_world():
    print("home")
    apple = Product(name="Apple")
    range = Product(name="Orange")
    anana = Product(name="Banana")
    db.session.add_all([apple, range, anana])
    db.session.commit()
    print(Product.query.all())
    return "<p>Hello, World!</p>"





if __name__ == '__main__':
    app.run()