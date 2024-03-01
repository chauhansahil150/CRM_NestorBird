import mysql.connector


class CRMDatabase:
    def __init__(self, host, user, password, database):
        self.connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.connection.cursor()

    def create_table(self, table_name, headers):
        headers_with_id = ['id INT AUTO_INCREMENT PRIMARY KEY'] + [f'{header} VARCHAR(255)' for header in headers]
        create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(headers_with_id)})"
        self.cursor.execute(create_table_query)
        self.connection.commit()

    # In CRMDatabase class
    def insert_data(self, table_name, column_names, data):
        columns = ', '.join(column_names)
        values_template = ', '.join(['%s'] * len(column_names))
        print(values_template)
        insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({values_template})"
        print(insert_query)
        for row in data:
            self.cursor.execute(insert_query, tuple(row.values()))
        self.connection.commit()


    def fetch_all_data(self, table_name):
        select_query = f"SELECT * FROM {table_name}"
        self.cursor.execute(select_query)
        return self.cursor.fetchall()
    
    def update_data(self, table_name, update_data, condition):
        update_query = f"UPDATE {table_name} SET {', '.join([f'{key} = %s' for key in update_data.keys()])} WHERE {condition}"
        self.cursor.execute(update_query, tuple(update_data.values()))
        self.connection.commit()

    def delete_data(self, table_name, condition):
        delete_query = f"DELETE FROM {table_name} WHERE {condition}"
        self.cursor.execute(delete_query)
        self.connection.commit()
    
class CRMDatabaseManager:
    def __init__(self, host, user, password):
        self.connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
        )
        self.cursor = self.connection.cursor()

    def create_database(self, database):
        self.cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database}")
        self.connection.commit()