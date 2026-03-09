# Subscription Management System

A full stack web app I built to manage SaaS subscription records — create, update, 
delete, search, and filter subscriptions through a clean UI backed by a REST API.

## Tech Stack

- Java + Spring Boot 3.5
- Spring Data JPA + Hibernate
- MySQL
- HTML, CSS, JavaScript (vanilla, no frameworks)

## Features

- Add, edit, delete subscriptions
- Search by name, filter by status
- Expired subscriptions highlighted in red
- Form validation on both client and server side
- RESTful API with proper error handling



## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /subscriptions | Get all |
| POST | /subscriptions | Add new |
| PUT | /subscriptions/{id} | Update |
| DELETE | /subscriptions/{id} | Delete |
| GET | /subscriptions/search?name= | Search by name |
| GET | /subscriptions/status?status= | Filter by status |

## What I Learned

This project ended up teaching me more than I expected — not just Spring Boot and JPA, 
but how the pieces actually talk to each other. Getting CORS right, wiring the frontend 
fetch calls to match the controller mappings, understanding why JPA generates the queries 
it does. The kind of things you only figure out by actually building something end to end.
```
