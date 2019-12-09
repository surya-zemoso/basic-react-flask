from sqlalchemy.dialects.postgresql import JSON
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key = True)  
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    username = db.Column(db.String(), unique=True)
    password = db.Column(db.String(200))
    report = db.Column(JSON)
    image = db.Column(db.String())

    def __init__(self,first_name,last_name,username,password,report,image):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.password = password
        self.report = report
        self.image = image

    def __repr__(self):
        return "<User:>>>>>>>>>>>>>>>>>>>>> {}>".format(self.id)