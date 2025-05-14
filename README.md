# Kea_12a_Webhook - Exposee

This is my Webhook

## Start 
To run the application you need to install

* pg, node-fetch, express, dotenv and also have nodemon and a node_modules folder available

* Have and run a docker-compose.yml file. Example:

    ````yaml
    version: "3.8"
    services:
    db:
        image: postgres:15-alpine
        environment:
        POSTGRES_USER: ${DB_USER}
        POSTGRES_PASSWORD: ${DB_PASSWORD}
        POSTGRES_DB: ${DB_NAME}
        ports:
        - "${DB_PORT:-5432}:5432"
    ````


* Have a .env file, which contains the following : 

    ````.env
    DATABASE_URL=postgres://[POSTGRES_USER]:[POSTGRES_PASSWORD@localhost:5432/[POSTGRES_DB]
    ````

Then you would be able to 

````
npm run dev
````

This will open up for the base url : http://localhost:8000/

You will also need to run a localTunnel to let others access your webhook. Your PORT needs to be the same as your webhook. 

````powershell
# Example:
lt --port 8000 --subdomain rkalt
````

## Running - Test - Postman
In postman you can call:  

1. Post : baseurl /webhooks/register

    a. with body:
        
    ````
    {
        "url": "http://localhost:9000/my-webhook-endpoint",
        "event_type": "invoice.created"
    }
    ````


2. Delete : baseurl /webhooks/{id}

3. Post : baseurl /ping

    a. with body :

    ````   
    {
        "event_type": "invoice.created",
        "data": { "orderId": 123, "amount": 49.95 }
    }
    ````

This webhook takes four events:
* payment.received
* payment.processed
* invoice.created
* invoice.completed