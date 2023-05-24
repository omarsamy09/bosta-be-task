# Bosta Backend Task

To setup the environment 

Run 
```
npm install
```
Create a .env file in the root directory containing these variables

```
SENDER_EMAIL=os09testemail@gmail.com
SENDER_PASSWORD=qwxmecupwkrurtir
MONGO_CONNECTION_STRING=mongodb://localhost
```
Then run
```
docker-compose up
```
To navigate to the swagger documentation of the api go to 
```
localhost:8080/api/
```
## Folder structure 
The folder structure is divided into 4 parts
### Controllers
This folder contains all the routes files

### Services
This folder containes all the files concerned with business logic

### Models
This folder containes all the files related to the database

##App Flow

First you need to signup by using the endpoint /users/signup and providing the email,username and password.
then you will recive an email for verification.

After that you could login to the system with your credentials, you will recieve a token which will be used in any request from now on.

For creating a check you will have to make a post request to /checks with the required fields as in the api docs and then your check will be created.

you also could get reports and filter them by tag from the endpoint /reports 

