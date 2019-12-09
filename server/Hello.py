from __future__ import print_function
import sys
from flask import jsonify
from sqlalchemy import and_
import uuid 
import json
from flask import *
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
import os
from flask_cors import *
from flask_socketio import emit, join_room, leave_room

project_dir = os.path.dirname(os.path.abspath(__file__))
database_file = "sqlite:///{}".format(os.path.join(project_dir, "healthcare.db"))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_file

CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")
db = SQLAlchemy(app)
with app.app_context():
    db.create_all()

class UserException(Exception):
    pass

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column('user_id',db.Integer, primary_key = True)  
    firstname = db.Column(db.String(100))
    lastname = db.Column(db.String(100))
    username = db.Column(db.String(), unique=True)
    password = db.Column(db.String(200))
    report = db.Column(db.String())
    image = db.Column(db.String())
    uuid = db.Column(db.String())
    login = db.Column(db.Boolean, default=False)

    def __init__(self,firstname,lastname,username,password,report=None,image=None,uuid='',login=False):
        self.firstname = firstname
        self.lastname = lastname
        self.username = username
        self.password = password
        self.report = report
        self.image = image
        self.uuid = uuid
        self.login = login

    def __repr__(self):
        return "<User:>>>>>>>>>>>>>>>>>>>>> {}>".format(self.id)
    
    def get_user(self):
        _user = dict()
        _user['id'] = self.id
        _user['uuid'] = self.uuid
        _user['first_name'] = self.firstname
        _user['last_name'] = self.lastname
        _user['email'] = self.username
        _user['password'] = self.password
        _user['report'] = self.report
        _user['image'] = self.image
        return _user

    def set_uuid(self):
        _id = uuid.uuid4()
        self.uuid = _id.hex

    def get_password(self):
        return self.password

    def get_user_by_id(self,id):
        return User.query.filter(User.uuid==id).first()

    def updatelogin(self,status):
        self.login = status
    
    def updateAvatar(self,avatar):
        self.image = avatar

    def get_login_status(self):
        return self.login
        
    def addreport(self,report):
        _report = self.report
        if _report:
            _report = _report +','+ json.dumps(report)
            self.report = _report
        else:
            self.report = json.dumps(report)
    
    def deleteReport(self,index):
        _report = '[{}]'.format(self.report)
        json_report = json.loads(_report)
        json_report.pop(index)
        updatedReport = json.dumps(json_report).replace('[','').replace(']','')
        self.report =updatedReport

@app.route('/adduser', methods = ['GET', 'POST'])
def result():
    if request.method == 'POST':
        data = request.get_json(force = True)
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        report = data.get('report')
        image = data.get('image')
        try:
            user = User.query.filter_by(username=email).first()
            if user:
                return jsonify({"message":"User already exist!",'data':{}})
            user = User(first_name,last_name,email,password,'','')
            user.set_uuid()
            db.session.add(user)
            db.session.commit()
            return jsonify({"message":"User addede successfully!",'data':{}})
        except Exception as e:
            # db.session.rollback()
            return jsonify({"message":"Error in adding user!!",'data':{}})
        finally:
            db.session.close()
@app.route('/signout/<id>',methods=['post'])
def signout(id):
    try:
        user = User.query.filter(User.uuid==id).first()
        if not user:
            jsonify({"message":"User does not found",'data':{}}) 
        user.updatelogin(False)
        db.session.commit()
        return jsonify({"message":"User signout succesfully!",'data':{}})
    except Exception as e:
        # db.session.rollback()
        return jsonify({"message":"Error in signing off!",'data':{}})

@app.route('/getuser/<id>',methods=['get'])
def getuser(id):
    try:
        user = User.query.filter(User.uuid==id).first()
        if user and user.get_login_status():
            return jsonify({"message":"User signing succesfully!",'data':user.get_user()})
        raise UserException('User does not found or already signed out')
        return jsonify({"message":"User already signedout!",'data':{}})
    except Exception as e:
        print('Exception...',e)
        return jsonify({"message":"Error in signing off!",'data':{}})
        

@app.route('/addreport/<id>', methods = ['POST'])
def addReport(id):
    if request.method == 'POST':
        data = request.get_json(force = True)
        try:
            user = User.query.filter(User.uuid==id).first()
            if not user:
                jsonify({"message":"User has no permission to share",'data':{}})
            user.addreport(data)
            db.session.commit()
            return 'User addede successfully!'
        except Exception as e:
            # db.session.rollback()
            return 'Error in adding user report'
        finally:
            user = User.query.filter_by(uuid=id).first()
            returnData = user.get_user()
            return jsonify({"message":"success",'data':returnData})

def clear_data(session):
    meta = db.metadata
    for table in reversed(meta.sorted_tables):
        session.execute(table.delete())
    session.commit()

@app.route('/login/<username>/<password>')
def login(username,password):
    try:
        message=''
        returnData=dict()
        user = User.query.filter(User.username==username).first()
        if user:
            if user.get_password()==password:
                returnData = user.get_user()
                user.updatelogin(True)
                db.session.commit()
                message='User loggedIn successfully!'
            else:
                message='Incorrect Password!'
        else:
            message='User does not exist, Please signup!'
        return jsonify({"message":message,'data':returnData})
    except Exception as e:
        return jsonify({"message":"No record found",'data':{}})


@app.route('/delete/<id>',methods = ['POST'])
def delete(id):
    try:
        data = request.get_json(force = True)
        index = data.get('index')
        user = User.query.filter(User.uuid==id).first()
        user.deleteReport(index)
        db.session.commit()
        returnData = user.get_user()
        return jsonify({"message":'report deleted successfully!','data':returnData})
    except Exception as e:
        return jsonify({"message":"User can not delete report",'data':user.get_user()})
@app.route('/updateprofile/<id>',methods = ['POST'])
def updateprofile(id):
    try:
        data = request.get_json(force = True)
        avatar = data.get('image')
        user = User.query.filter(User.uuid==id).first()
        user.updateAvatar(avatar)
        db.session.commit()
        returnData = user.get_user()
        return jsonify({"message":'report deleted successfully!','data':returnData})
    except Exception as e:
        return jsonify({"message":"User can not delete report",'data':user.get_user()})

def messageReceived(methods=['GET','POST']):
    print('Message was received!')

# @cross_origin(origin='localhost',headers=['Content-Type'])
@socketio.on('my_event')
def handle_my_custome_event(json):
    print('Received my event>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    emit('my_response',json, broadcast=True)

if __name__ == '__main__':
    socketio.run(app,debug = True)
