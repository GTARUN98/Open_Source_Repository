

# Open_Source_Repository

This project is a MERN stack application built with MongoDB, Express, React, and Node.js that handles authentication using cookies, JWT, bcrypt, and Multer middleware. The application allows users to create a file containing code and store it on the IPFS network. The code is then hashed and stored on a blockchain using a smart contract. Users can view the blocks they have created and the transactions they have made.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [License](#license)

## Technologies Used

The following technologies were used to build this project:

- MongoDB
- Express
- React
- Node.js
- Multer
- IPFS
- Solidity

## Installation

To install this application, clone the repo and run the following command:

```bash
npm install
```

To run the application, you will need to set the following environment variables:

- MONGO_URI
- JWT_SECRET
- IPFS_PROJECT_ID
- IPFS_PROJECT_SECRET_KEY
- INFURA_PROJECT_ID_IPFS
- INFURA_PROJECT_SECRET_KEY_IPFS
- INFURA_PROJECT_ID_ETH
- INFURA_PROJECT_SECRET_KEY_ETH

You can set these variables by creating a .env file in the root of the project and adding the following lines:

```
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
IPFS_PROJECT_ID=<your_ipfs_project_id>
IPFS_PROJECT_SECRET_KEY=<your_ipfs_project_secret_key>
INFURA_PROJECT_ID_IPFS=<your_infura_project_id_ipfs>
INFURA_PROJECT_SECRET_KEY_IPFS=<your_infura_project_secret_key_ipfs>
INFURA_PROJECT_ID_ETH=<your_infura_project_id_eth>
INFURA_PROJECT_SECRET_KEY_ETH=<your_infura_project_secret_key_eth>
```

## Features

The main features of this application include:

- User authentication
- Uploading a file containing code
- Storing the code on IPFS
- Storing the hash of the code on a blockchain
- Viewing the blocks created by the user
- Viewing the transactions made by the user

## Usage

To use this application, follow these steps:

1. Register for an account or log in if you already have an account.
2. Click the "Upload" button and fill out the form to upload a file containing code.
3. After the file is uploaded, you will be redirected to the "All Repositories" page where you can view the blocks you have created.
4. To view the details of a block, click the "Details" button.
5. To view the transactions you have made, click the "Transactions Made" button.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.


![Screenshot 2023![Screenshot 2023-04-30 140855](https://user-images.githubusercontent.com/89148978/235345027-186a0fd0-63c5-43bb-8b1a-349d851fac95.png)
-04-30 140709_component](https://user-images.githubusercontent.com/89148978/235345018-06687503-603e-49d2-bbb0-279e4a516a8d.png)

![Screenshot 2023-04-30 140940](https://user-images.githubusercontent.com/89148978/235345044-5eacaf11-c4a2-4e57-a78e-c94af77e7c5a.png)
