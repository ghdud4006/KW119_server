const PORT = 3000;
const SELECT_AMOUNT = 20;
var express = require('express');
var app = express();
var mysql = require('mysql');
var conn = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : ''
});
var dataUtils = require('date-utils');
var formidable = require('formidable');
var fsExtra = require('fs-extra');

app.use('/static', express.static('uploads'));
conn.connect();

app.get('/', function(req, res){
    res.send('server on');
});

app.post('/login', function(req, res){
    var inputData;

    req.on('data', function(data){
         inputData = JSON.parse(data);
    });
    
    req.on('end',function(){
        var userId = inputData.UserId;
        var userPwd = inputData.UserPwd;

        var sql = 'SELECT sid, id, password FROM userTbl WHERE id=?;';
        conn.query(sql, [userId], function(err, results, fields){
            if(err){
                res.send('err');
                console.log(err);
            } else {
                if(results[0] == null){
                    res.send('nack:id');
                    console.log('[POST] \'/login\' : login failed. [invalid id]');
                } else {
                    if(userPwd!=results[0].password){
                        res.send('nack:pwd');
                        console.log('[POST] \'/login\' : login failed. [invalid password]');
                    } else {
                        res.send(results[0].sid.toString());
                        console.log('[POST] \'/login\' : user('+results[0].id+') login success [sid:'+results[0].sid.toString()+']');
                    }
                }
            }
        }); 
    });
});

app.post('/signup', function(req, res){
    var inputData;

    req.on('data', function(data){
         inputData = JSON.parse(data);
    });
    
    req.on('end',function(){
        var userId = inputData.UserId;
        var userPwd = inputData.UserPwd;
        var userName = inputData.UserName;
        var userStuId = inputData.UserStuId;
        var userIsStudent = inputData.UserIsStudent;

        var sql2Params = [userId,userPwd,userName,userStuId,userIsStudent];
        var sql1 = 'SELECT id FROM userTbl WHERE id=?;';
        var sql2 = 'INSERT INTO userTbl(id, password, name, studentId, isStudent) VALUES(?,?,?,?,?);';

        conn.query(sql1, [userId], function(err, results1, fields){
            if(err){
                res.send('err');
                console.log(err);
            } else {
                if(results1[0] != null){
                    res.send('nack');
                    console.log('[POST] \'/signup\' : failed');
                } else {
                    conn.query(sql2, sql2Params, function(err, results2, fields2){
                        if(err){
                            res.send('err');
                            console.log(err);
                        } else {
                            res.send('ack');
                            console.log('[POST] \'/signup\' : success');
                        }
                    });
                }
            }
        
        });
    });
});



app.post('/notice', function(req, res){
    var inputData;

    req.on('data', function(data){
         inputData = JSON.parse(data);
    });
    
    req.on('end',function(){
        var sid = inputData.sid;
        // response json data 
        var resJsonArray = new Array();
        
        console.log(' [POST] \'/notice\' : user request notice ');
        
        // make sql query & set sql parameters
        var sql = 'SELECT * FROM topicTbl;'
        // send query to mysql server
        conn.query(sql, function(err, results, fields){
            if(err){
                console.log(err);
                res.send('err');
            } else {
                
                for(var i=0; i<100; i++){
                    if(results[i] == null){
                        break;
                    } else {
                        console.log('DB result object\'s id ['+results[i].topic_num+']');
                        var resJson = new Object();

                        resJson.topic_num = results[i].topic_num;
                        resJson.title = results[i].title;
                        resJson.author = results[i].author;
                        resJson.kind = results[i].kind;
                        resJson.location = results[i].location;
                        resJson.date = results[i].date;
                        resJson.image_path = results[i].imagePath;
                        
                        resJsonArray.push(resJson);
                    }                    
                }
                // response json array to client
                //console.log(JSON.stringify(resJsonArray));
                res.send(JSON.stringify(resJsonArray));
            }

        });

    });
});



app.post('/mylist', function(req, res){
    var inputData;

    req.on('data', function(data){
         inputData = JSON.parse(data);
    });
    
    req.on('end',function(){
        var sid = inputData.sid;
        // response json data 
        var resJsonArray = new Array();
        
        console.log(' [POST] \'/mylist\' : user request mylist ');
        
        // make sql query & set sql parameters
        var params = [sid];
        var sql = 'SELECT * FROM topicTbl WHERE sid=?;'
        // send query to mysql server
        conn.query(sql, params, function(err, results, fields){
            if(err){
                console.log(err);
                res.send('err');
            } else {
                
                for(var i=0; i<100; i++){
                    if(results[i] == null){
                        break;
                    } else {
                        console.log('DB result object\'s id ['+results[i].topic_num+']');
                        var resJson = new Object();

                        resJson.topic_num = results[i].topic_num;
                        resJson.title = results[i].title;
                        resJson.author = results[i].author;
                        resJson.kind = results[i].kind;
                        resJson.location = results[i].location;
                        resJson.date = results[i].date;
                        resJson.image_path = results[i].imagePath;
                        
                        resJsonArray.push(resJson);
                    }                    
                }
                // response json array to client
                //console.log(JSON.stringify(resJsonArray));
                res.send(JSON.stringify(resJsonArray));
            }

        });

    });
});

app.post('/topic', function(req, res){
    var inputData;
    
    req.on('data', function(data){
         inputData = JSON.parse(data);
    });
    
    req.on('end',function(){
        console.log(' [POST] \'/topic\' : Client requests topic data');
        
        var topicNum = inputData.topicNumber;
        topicNum*=1;

        var params = [topicNum];
        var sql = 'SELECT * FROM topicTbl WHERE topic_num=?;';
        conn.query(sql, params, function(err, results, fields){
            if(err){
                console.log(err);
                res.send('err'); 
            } else {
                //json객체 만들어 스트링화 해서 전송  
                console.log(' [POST] \'/topic\' : response data');
                console.log(results[0]); 
                var resJson = new Object();
                resJson.title = results[0].title;
                resJson.kind = results[0].kind;
                resJson.contents = results[0].contents;
                resJson.location = results[0].location;
                resJson.date = results[0].date; 
                
                res.send(JSON.stringify(resJson));
            } 
        });

    });

});

app.post('/update', function(req, res){
    var inputData;

    req.on('data', function(data){
        inputData = JSON.parse(data);
    });

    req.on('end', function(){
        var topic_num = inputData.topic_num;
        var title = inputData.title;
        var kind = inputData.kind;
        var content = inputData.content;
        var where = inputData.where;

        var params = [title, kind, content, where, topic_num];
        var sql = 'UPDATE topicTbl SET title=?, kind=?, contents=?, location=? WHERE topic_num=?';
        
        conn.query(sql, params, function(err, results, fields){
            if(err){
                console.log(err);
                res.send('err');
            } else {
                console.log('update success');
                res.send('ack'); 
            } 
        });
    });
});

app.post('/delete', function(req, res){
    var inputData;
    
    req.on('data', function(data){
        inputData = JSON.parse(data);
    });
    
    req.on('end',function(){
        var topic_num = inputData.topic_num;
        
        var params = [topic_num];
        var sql = 'DELETE FROM topicTbl WHERE topic_num=?;';
        
        console.log(' [POST] \'/delete\' : request delete topic_num : '+topic_num);
        conn.query(sql, params, function(err, results, fields){
            if(err){
                console.log(err);
                res.send('err');
            } else {
                console.log('success');
                res.send('ack'); 
            } 
        });

    });
});

app.post('/submit', function(req, res){
    var inputData;
    var startDate = new Date();

    req.on('data', function(data){
         inputData = JSON.parse(data);
    });
    
    req.on('end',function(){
        var startDate = new Date();
        // 데이터 파싱
        var sid = inputData.sid;
        var title = inputData.Title;
        var kind = inputData.Kind;
        var contents = inputData.Contents;
        var where = inputData.Where;
        var date = startDate.toFormat('YYYY-MM-DD');
        var imagePath = './uploads/'+sid+'/'+inputData.ImgName; 
        var imgFileName = inputData.ImgName;

        var params1 = [sid];
        var sql1 = 'SELECT id, name, isStudent FROM userTbl WHERE sid=?;'
        conn.query(sql1, params1, function(err, results1, fields){
            if(err){
                res.send('err');
                console.log(err);
            } else {
                console.log('[POST] \'/submit\' : user ('+results1[0].id+') request submit');
                var author = results1[0].name;
                var isStudent = results1[0].isStudent;
                var params2 = [sid,author,isStudent,title,kind,contents,imgFileName,where,date];
                var sql2 = 'INSERT INTO topicTbl (sid,author,isStudent,title,kind,contents,imagePath,location,date) VALUES (?,?,?,?,?,?,?,?,?);';
                conn.query(sql2, params2, function(err, results2, fields){
                    if(err){
                        res.send('err');
                        console.log(err);    
                    } else {
                        console.log('[POST] \'/submit\' : DB insert success. [insertID:'+results2.insertId+']');
                        res.send('ack');
                    }                 
                }); 
            }
        });
         
    });
});

app.post('/upload', function(req, res){
    console.log('[POST] \'/upload\' : image file uploading...');

    var name = "";
    var filePath = "";
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
        name = fields.name;
    });
    
    form.on('end', function(fields, files){
        for(var i=0; i<this.openedFiles.length; i++){
            var temp_path = this.openedFiles[i].path;
            var file_name = this.openedFiles[i].name;
            var index = file_name.indexOf('/');
            var new_file_name = file_name.substring(index+1);
            var new_location = 'uploads/'+name+'/';
            
            fsExtra.copy(temp_path, new_location+file_name, function(err){
                if(err){
                    console.error(err);
                    console.log(err);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify( { result:'success', url: new_location+file_name }, null, 3));
                    console.log('[POST] \'/upload\' : upload success.');
                }
            });
        }
    });
});


app.listen(PORT, function() {
    console.log(' **** KW-119 Server Connected ' + PORT +' PORT ! ****');
});


