// RESTful services by NodeJS


var crypto = require('crypto');
var uuid = require('uuid');
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

// Connect to MySQL
var con = mysql.createConnection({
    host: 'localhost', // Replace your host IP
    user: 'root',
    database:'DemoNodeJS'
});

//Password UTIL
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')// Convert to hexa format
    .slice(0,length); //return required number of caracters
};

var sha512 = function(password,salt){
    var hash = crypto.createHmac('sha512',salt); // use SHA512
    hash.update(password);
    var value = hash.digest('hex');
    return{
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword(userPassword){
    var salt = genRandomString(16); // generate random string with 16 characters to salt
    var passwordData = sha512(userPassword,salt)
    return passwordData;
}

function checkHashPassword(user_password,salt){
    var passwordData = sha512(user_password,salt);
    return passwordData;
}

var app = express();
app.use(bodyParser.json()); //Accept JSON params
app.use(bodyParser.urlencoded({extended : true})); // Accept URL encoded params

app.post('/register/',(req,res,next) =>{
    var post_data = req.body; // get post params
    var uid = uuid.v4(); // get uuid v4
    var plaint_password = post_data.password; //get password from post params
    var hash_data = saltHashPassword(plaint_password);
    var password = hash_data.passwordHash;//get hash value
    var salt = hash_data.salt; //get salt
    var name = post_data.name;
    var email = post_data.email;
    con.query("SELECT * FROM User WHERE email=?",[email],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
        if(result && result.length){
            res.json('User already exists !');
        }
        else{
            con.query("INSERT INTO User (unique_id,name,email,encrypted_password,salt,created_at,updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",[uid,name,email,password,salt],function(err,result,fields){
                con.on('error',function(err){
                    console.log('[MySQL ERROR]',err);
                    res.json('Register error: ',err)
                });
                res.json('Successfully registered')
            });
        }
    });
})

app.post('/login/',(req,res,next)=>{
    var post_data = req.body;
    //Extract email and password from request
    var user_password = post_data.password;
    var email = post_data.email;

    con.query("SELECT * FROM User WHERE email=?",[email],function(err,result,fields){
        con.on('error',function(err){
            console.log('[MySQL ERROR]',err);
        });
        if(result && result.length){
            var salt = result[0].salt; // Get salt of result if account error
            var encrypted_password = result[0].encrypted_password
            //Hash password from Login request with salt in DataBase 
            var hashed_password = checkHashPassword(user_password,salt).passwordHash;
            if(encrypted_password == hashed_password){
                res.end(JSON.stringify(result[0])); // If password is correct return all infos of the user
            }
            else{
                res.end(JSON.stringify('Wrong Password'));
            }
        }
        else{
            res.json('User does not exists !');
        }
    });

})
//app.get("/",(req,res,next)=>{
    //console.log('Password: 123456');
    //var encrypt = saltHashPassword("123456");
    //console.log("Encrypt: "+encrypt.passwordHash);
    //console.log("Salt: "+encrypt.salt)
//})

//Start server
app.listen(3000,()=>{
        console.log("Restful API running on port 3000");
    }
)