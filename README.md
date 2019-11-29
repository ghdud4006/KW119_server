# KW119_server

###NodeJs Server in EC2 Ubuntu 16.04

###use MySQL DB

```mysql
> DESC userTbl

+-----------+-------------+------+-----+---------+----------------+
| Field     | Type        | Null | Key | Default | Extra          |
+-----------+-------------+------+-----+---------+----------------+
| sid       | int(11)     | NO   | PRI | NULL    | auto_increment |
| id        | varchar(12) | NO   |     | NULL    |                |
| password  | varchar(8)  | NO   |     | NULL    |                |
| name      | varchar(20) | YES  |     | NULL    |                |
| studentId | varchar(10) | YES  |     | NULL    |                |
| isStudent | tinyint(1)  | YES  |     | NULL    |                |
+-----------+-------------+------+-----+---------+----------------+

>DESC topicTbl

+-----------+-------------+------+-----+---------+----------------+ 
| Field     | Type        | Null | Key | Default | Extra          |
+-----------+-------------+------+-----+---------+----------------+
| topic_num | int(11)     | NO   | PRI | NULL    | auto_increment |
| sid       | int(11)     | NO   |     | NULL    |                |
| author    | varchar(12) | YES  |     | NULL    |                |
| isStudent | tinyint(1)  | NO   |     | NULL    |                |
| title     | varchar(20) | YES  |     | NULL    |                |
| kind      | varchar(20) | YES  |     | NULL    |                |
| contents  | mediumtext  | YES  |     | NULL    |                |
| imagePath | varchar(50) | YES  |     | NULL    |                |
| location  | varchar(30) | YES  |     | NULL    |                |
| date      | date        | YES  |     | NULL    |                |
+-----------+-------------+------+-----+---------+----------------+
```
```json
"dependencies": {
    "date-utils": "^1.2.21",
    "express": "^4.16.3",
    "express-mysql": "0.0.1",
    "formidable": "^1.2.1",
    "fs": "0.0.1-security",
    "fs-extra": "^6.0.1",
    "multer": "^1.3.0",
    "mysql": "^2.15.0",
    "nodemon": "^1.17.5",
    "supervisor": "^0.12.0"
  }
```

by ghdud4006@gmail.com
