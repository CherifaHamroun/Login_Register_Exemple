# Register Login with NodeJS API MySQL DB through Android Kotlin App
###
Register/ Login user with password encryption (SHA512 and Salt)
# Installation
Install NodeJS as backend server  
```
sudo apt install nodejs
```
###
[Install XAMPP  as DB server] (https://vitux.com/how-to-install-xampp-on-your-ubuntu-18-04-lts-system/)
###
Install Postman (Extention of Firefox to test API)
# Implementation
Create DB on phpMyAdmin  
###
Create your NodeJS project folder
```
 npm init 
 
```
and set up your dependencies
###
Install Libraries to encrypt pwd, to create unique id string to connect with MySQL, parse parameters from API request and easily create RESTful API endpoint
###
```
npm install crypto
npm install uuid
npm install mysql
npm install body-parser
npm install express
```
###
Testing the server
```
node index.js
```
### 
Starting XAMPP 
```
sudo /opt/lampp/lampp start
```

