#pip install flask-cors
#pip install flask-autoreload
#pip install flask-jwt-extended


from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS,cross_origin
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'
jwt = JWTManager(app)


#CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app, supports_credentials=True)


DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = ''
DB_NAME = 'crm'

db = mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)
cursor = db.cursor()

class CRMDatabase:
    def __init__(self, cursor):
        self.cursor = cursor

    def create_table(self, table_name, headers):
        headers_with_id = ['id INT AUTO_INCREMENT PRIMARY KEY'] + [f'{header} VARCHAR(255)' for header in headers]+ ['posted_by VARCHAR(255)']
        create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(headers_with_id)})"
        self.cursor.execute(create_table_query)
        db.commit()

    def insert_data(self, table_name, column_names, data):
        print(data)
        columns = ', '.join(column_names)
        values_template = ', '.join(['%s'] * len(column_names))
        insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({values_template})"
        
        for row in data:
            values = [row[column] for column in column_names]  # Extract values from the dictionary
            self.cursor.execute(insert_query, tuple(values))
        
        db.commit()

        
    def fetch_data(self,table_name,condition):
        select_query=f"SELECT * FROM {table_name} WHERE {condition}"
        self.cursor.execute(select_query)
        return self.cursor.fetchall()

    def fetch_all_data(self, table_name,data):
        print(data)
        select_query=None
        if data['role'] == 'admin':
            select_query = f"SELECT * FROM {table_name}"
        elif data['role'] == 'user':
            select_query = f"SELECT * FROM {table_name} WHERE posted_by='scrap' OR posted_by='{data['user_id']}'"
        self.cursor.execute(select_query)
        return self.cursor.fetchall()
    

    def update_data(self, table_name, update_data, condition):
        update_query = f"UPDATE {table_name} SET {', '.join([f'{key} = %s' for key in update_data.keys()])} WHERE {condition}"
        self.cursor.execute(update_query, tuple(update_data.values()))
        db.commit()

    def delete_data(self, table_name, condition):
        delete_query = f"DELETE FROM {table_name} WHERE {condition}"
        self.cursor.execute(delete_query)
        db.commit()
        
    def create_users_table(self):
        create_table_query = """
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(255)
        )
        """
        self.cursor.execute(create_table_query)
        db.commit()
        
    def insert_user(self, name, email, password,role):
        insert_query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
        self.cursor.execute(insert_query, (name, email, password))
        db.commit()

    def get_user_by_email(self, email):
        select_query = "SELECT * FROM users WHERE email = %s"
        self.cursor.execute(select_query, (email,))
        return self.cursor.fetchone()
    
    def get_user_role(self,id):
        select_query="SELECT role FROM users WHERE id=%s"
        self.cursor.execute(select_query,(id,))
        return self.cursor.fetchone()
        
        
# Initialize CRMDatabase
crm_db = CRMDatabase(cursor)
crm_db.create_users_table()


@app.route('/')
@cross_origin(origins=[u"*"])
def hello():
    return 'Hello, World!'

@app.route('/insert', methods=['POST'])
@cross_origin(origins=[u"*"])
@jwt_required()
def insert_data():
    try:
        data = request.json
        user_id=get_jwt_identity()
        data['posted_by'] = user_id  
        print(data)# Corrected line
        if data:
            crm_db.insert_data("customers", ['Customer_Name', 'Company', 'Phone_Number','Interaction_History','Lead_Status','posted_by'], [data])
            return jsonify({'message': 'Data inserted successfully'})
        else:
            return jsonify({'error': 'No data provided'})
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"An error occurred: {e}")
        # Return an error response
        return jsonify({'error': 'An internal server error occurred'}), 500


@app.route('/fetch')
@cross_origin(origins=[u"*"])
@jwt_required()
def fetch_data():
    user_id=get_jwt_identity()
    role=crm_db.get_user_role(user_id)
    data = crm_db.fetch_all_data("customers",{'role':role[0], 'user_id':user_id})
    print(data)
    cols=[x for x in ['id','Customer_Name', 'Company', 'Email','Phone_Number','Interaction_History','Lead_Status','posted_by']]
    res=[dict(zip(cols,row)) for row in data]
    if data:
        return jsonify({'data':res}),200
    else:
        return jsonify({'message':'error'}),201
@app.route('/update/<int:id>', methods=['PUT'])
@cross_origin(origins=[u"*"])
@jwt_required()
def update_data(id):
    data = request.json
    if data:
        crm_db.update_data("customers", data, f"id = {id}")
        return jsonify({'message': f'Data with ID {id} updated successfully'})
    else:
        return jsonify({'error': 'No data provided'})
    

@app.route('/delete/<int:id>', methods=['DELETE'])
@cross_origin(origins=[u"*"])
@jwt_required()
def delete_data(id):
    crm_db.delete_data("customers", f"id = {id}")
    return jsonify({'message': f'Data with ID {id} deleted successfully'})

@app.route('/user/<int:id>',methods=['get',])
def create_user(id):
    data=crm_db.fetch_data("customers",f"id={id}")
    return jsonify(data)

@app.route('/user/register', methods=['POST'])
@cross_origin(origins=[u"*"])
def signup():
    data = request.json
    if 'name' in data and 'email' in data and 'password' in data:
        name = data['name']
        email = data['email']
        password = data['password']
        existing_user = crm_db.get_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400
        else:
            role='user'
            crm_db.insert_user(name, email, password,role)
            return jsonify({'message': 'Signup successful'}), 201
    else:
        return jsonify({'error': 'Missing name, email, or password'}), 400
    
@app.route('/user/login', methods=['POST'])
@cross_origin(origins=[u"*"])
def login():
    try:
        data = request.json
        if 'email' in data and 'password' in data:
            email = data['email']
            password = data['password']
            user = crm_db.get_user_by_email(email)
            if user and user[3] == password:  # Assuming password is stored at index 3
                access_token = create_access_token(identity=user[0])  # Identity can be user ID
                return jsonify(access_token=access_token,role=user[4]), 200
        return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"An error occurred: {e}")
        # Return an error response
        return jsonify({'error': 'An internal server error occurred'}), 500

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200







if __name__ == '__main__':
    app.run(port=8000)
