# ICP-lms
This is a library management system canister implemented in TypeScript using the Azle framework. It provides functionality for users to manage library operations such as book search, issuance, and return, as well as admin functionalities for managing the library inventory.

## Features

- **User Authentication**: Users can sign up with a new account and log in with their credentials.
- **Book Management**: Users can search for books in the library and issue them if available. Admins can add new books to the library inventory.
- **Book Issuance**: Users can issue books from the library, and the system tracks book availability and due dates.
- **Admin Functionality**: Admins have access to additional functionalities such as adding books, viewing issued books, and tracking overdue books.

## Endpoints

- `/signup`: User signup endpoint to create a new account.
- `/login`: User login endpoint for authentication.
- `/books`: Endpoint to search for books and issue them.
- `/issue`: Endpoint for users to issue books from the library.
- `/admin/login`: Admin login endpoint for authentication.
- `/admin/add-book`: Endpoint for admins to add new books to the library.
- `/admin/issued-books`: Endpoint for admins to view issued books.
- `/admin/overdue-books`: Endpoint for admins to view overdue books.

## Usage

1. Clone the repository.
2. Install dependencies with ```npm install```.
3.Install dfx
```DFX_VERSION=0.15.0 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)```
```dfx start --background```

