# Backend Test - Alter Solutions
## Kuanto Kusta

### Summary

It was developed 4 applications, 3 of them are microservices (Products, Shopping Cart and Users) and the other one a REST API, centralizing all the resources.

All of them was developed using Typescript with NestJs. The Shopping Cart microservice uses TypeORM to persist data on a Postgres database. The Products and Users microservices utilize Mongoose to persist on a MongoDB.

I decided to create a microservice of my own for authentication, as I felt that this responsibility didn't belong to any other component.

I wrote unit tests on all of them, aiming for the services files, as they are the ones with the logical part of the application.

### Backend Architecture

Here's a diagram of the backend architecture, how the applications communicate with each other and the endpoints available through the API Gateway:
![backend architecture diagram](/kuanto-kusta-backend-architecture.png)

### About the applications

#### Users microservice

This application is responsible for creating a new user, authenticating and validating a JWT Token, to be used as a Bearer Token in other routes. Its needs only the e-mail and password for signUp. The signIn route is used to generate a JWT token and the validateToken endpoint is only available to the microservices, for them to assert if the token is valid and, if so, to get the userId and the email.
When a user tries to register, the microservice validates the email and password input. For the latter, it must be more than 8 characters long, and must have numbers, symbols, uppercase and lowercase to be accepted.

#### Products microservice

Even the test suggesting to develop only the endpoint to list all the products, I wrote a route to create a new product. I won't create a new product if the productId already exists. All the requests must have a Bearer Token in it's headers.

#### Shopping Cart microservice

This application saves the shopping cart and products selected by a user and calculates the total price and quantity. All requests must pass a Bearer Token in their headers and although routes do not ask for the userId in any of them, they all retrieve this information through the Users microservice.

#### API Gateway

This is the app that wraps all the resources in one place. It's only responsibility is to centralize all the requests and call the right microservice, without executing any logic.

### Running the applications

All of them have a ```.env``` file with the variables needed to run, connect to the databases and communicate with each other. So, before beginning, it needs to be filled.

It is also needed to download the dependencies of the projects, so it is necessary to run either ```yarn``` or ```npm i``` commands, the one you prefer.

For the Shopping Cart microservice, it is also needed to put the database connection in the ```ormconfig.json``` file, at the root of the project. After that, but before starting the application, you must run the migrations to set up the tables in Postgres. There is a prepared command for this in ```package.json```, and you can use either
```yarn typeorm:migrate```
or
```npm run typeorm:migrate```

After configuring all the applications, you will be ready to start using it. Just run
```yarn start:dev```
or
```npm start:dev```
and start making requests.

### A quick look at the endpoints

To start interacting with the system, one must have a register and be authenticated to consume other resources. Let's start creating our account:

```
POST <api-gateway-url>/auth/signUp
body example: 
{
  "email": "user.account@example.com",
  "password": "djNPJ@3151acd#$" //remember: password must contain more than 8 chars, with uppercase, lowercase, number and symbols 
}
```
If all goes well, you should get ```HTTP STATUS CODE 201```, indicating that it was created.

After that, you can use your credentials to sign in and receive an access token, to be used in the next requests as a Bearer Token Authorization.
```
POST <api-gateway-url>/auth/signIn
example payload:
{
  "email": "user.account@example.com",
  "password": "djNPJ@3151acd#$"
}

response example:
{
  "accessToken": "<JWT token>"
}
```

Now with the access token in hands, let's start creating some products:
```
POST <api-gateway-url>/products
example payload:
{
	"productId": "12321",
	"price": 59.99
}
```
The application should return an ```HTTP STATUS CODE 201``` to indicate success. Even though the application creates an id automatically, I decided to ask for the productId to the user to inform, given that in a business, it can mean something internally, like a key or product code.

Now that we populated the database with some products, we can get them requesting the following:
```
GET <api-gateway-url>/products

response example:
[
  {
    "_id": "60d015a5aff33e02244cf629",
    "productId": "3214",
    "price": 89.9,
    "__v": 0
  },
  {
    "_id": "60d1dbd4e16f3d102877c2c5",
    "productId": "12321",
    "price": 122.35,
    "__v": 0
  }
]
```
Finally, we can start selecting some products to add to our cart! To do that:
```
POST <api-gateway-url>/shoppingCart
payload example: 
{
  "products": [
    {
      "productId": "3214",
      "price": 89.9,
      "quantity": 2
    },
    {
      "productId": "12321",
      "price": 122.35,
      "quantity": 1
    }
  ]
}
```
For this request, the response we should get is the ```HTTP STATUS CODE 201``` for success.

If you want to remove a product from the cart, this is the request you must send:
```
DELETE <api-gateway-url>/shoppingCart/:productId
```
Just put the product id in the route param and it should do it.

Finally, to see the Shopping Cart data, we must send the following request:
```
GET <api-gateway-url>/shoppingCart

response example:
{
  "shoppingCartId": "<Shopping Cart ID>",
  "userId": "<Your userId>",
  "products": [
    {
      "id": "<Product ID in database>",
      "shoppingCartId": "<Shopping Cart ID>",
      "productId": "3214",
      "price": 89.9,
      "quantity": 2
    },
    {
      "id": "<Product ID in database>",
      "shoppingCartId": "<Shopping Cart ID>",
      "productId": "12321",
      "price": 122.35,
      "quantity": 1
    }
  ],
  "totalPrice": 302.15,
  "totalQuantity": 3
}
```

### Running the tests

To apply the tests is easy, just run one of the following commands in the terminal, in any of the projects:
```yarn test```
```npm run test```