# BucketListAPI
An API for a BucketList service built using the Node JS and Redis

## Introduction
The innovative bucketlist app is an application that allows users to record and share things they want to achieve or experience before reaching a certain age meeting the needs of keeping track of their dreams and goals. This is the backend API for enabling users to perform crud operations on bucketlists and items with user persistence

## How to run this application
In order to run the bucketlist API backend, change directory into the project folder. First of all, install all the requirements by running: <br/>
npm install <br>
# Run the express application by typing:<br>
nodemon server.js<br>
This will start the server at http://127.0.0.1:2000/<br>
## API Endpoints
| URL Endpoint                                    | HTTP Request  | Resource Accessed                       | Access Type |
| :---:                                           | :-:           | :-:                                     | :-:         |
| /api/bucketlists/auth/register                  | POST          | Register a new user                     |  publc      |
| /api/bucketlists/auth/login                     | POST          | Login and retrieve token                |  public     |
| /api/bucketlists                                | POST          | Create a new Bucketlist                 |  private    |
| /api/bucketlists                                | GET           | Retrieve all bucketlists for user       |  private    |
| /api/bucketlists/<buckelist_id>                 | GET           | Retrieve a bucketlist by ID             |  private    |
| /api/bucketlists/<bucketlist_id>                | PUT           | Update a bucketlist                     |  private    |
| /api/bucketlists/<bucketlist_id>                | DELETE        | Delete a bucketlist                     |  private    |
| /api/bucketlists/<bucketlist_id>/items/         | GET           | Retrieve items in a given bucket list    |  private    |
| /api/bucketlists/<bucketlist_id>/items/         | POST          | Create items in a bucketlist            |  private    |
| /api/bucketlists/<bucketlist_id>/items/<item_id>| DELETE        | Delete an item in a bucketlist          |  private    |
| /api/bucketlists/<bucketlist_id>/items/<item_id>| PUT           | update a bucketlist item details        |  private    |

# WEBPAGE SCREENSHOTS
![alt text](https://raw.githubusercontent.com/Mistergpofficial/BucketListAPI/master/signing.PNG)
![alt text](https://raw.githubusercontent.com/Mistergpofficial/BucketListAPI/master/signup.PNG)
![alt text](https://raw.githubusercontent.com/Mistergpofficial/BucketListAPI/master/bucketlists.PNG)
![alt text](https://raw.githubusercontent.com/Mistergpofficial/BucketListAPI/master/items.PNG)

# API SCREENSHOTS
