let {
  db_host,
  db_name,
  db_password,
  db_port,
  db_user
} = require("../../modules/port") 

module.exports ={
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": db_user ,
    "password":db_password ,
    "database": db_name ,
    "host": db_host ,
    "port": db_port ,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
