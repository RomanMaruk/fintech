## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Environment files

In the environments folder, add a file named environment.ts with the following content:

export const environment = {
production: false,
apiUrl: 'https://platform.fintacharts.com',
wsUrl: 'wss://platform.fintacharts.com',
username: '{{your_username}}',
password: '{{your_password}}'
};

## Auth service 

As login mehtod return error with CORS temprory you shold pass response from Postman
