# ETT Frontend Application

This is a frontend application for the Ethical Transparency Tool (ETT).  It is an interface for the [backend application found here](https://github.com/bu-ist/ett). It is built with Vite, Chakra UI, and modern React practices including hooks and form management.


## API Integration

The application integrates with a secure backend API using JWT authentication. Access tokens are managed through cookies.

### Configuration

Application configuration is managed through the `ConfigContext` object, which is a React Context loaded on first load, allowing for flexible endpoint configuration and environment-specific settings. 

Key aspects of the configuration system:

- **Role-specific API endpoints**: The backend API provides separate endpoints for each user role in the system:
  - Entity Administrative Support Professional (ASP)
  - Authorized Individual (AI)
  - Consenting Person
  - Register Entity endpoint (for account creation)

- **Runtime configuration loading**: The application loads configuration values into the React Context during initial startup from a special public endpoint in the backend available at the `/parameters` URI.  These parameters are parsed into a specific format for the front end by the `parseAppConfig()` function at `/src/lib/parseAppConfig.js`.

## Project Structure
The project is structured as follows:

```
src/
├── components/          # Reusable components
├── layouts/             # Page layouts
├── lib/                 # Utility functions and API fetching
├── pages/               # Page components
```

Within the `lib` directory, each distinct API call is packaged as a standalone function, with `API` appended to the filename to indicate its purpose. For example, `/lib/auth-ind/lookupAuthIndAPI.js` contains the function to fetch data about the signed-in Authorized Individual from the backend API.

The `components` directory contains reusable components that can be used across different pages, while the `layouts` directory contains page layouts that define the overall structure of the application.

The `pages` directory contains the main page components, which are the entry points for each route in the application. Each page component is responsible for rendering its own content and managing its own state.

## Deployment

The application is built as a statically compiled JS bundle and can be deployed on any static host that 
supports React Router.  This includes S3 buckets if they have some React Router specific rules attached, 
[details available from this stack overflow.](https://stackoverflow.com/questions/51218979/react-router-doesnt-work-in-aws-s3-bucket/71591815#71591815).  The [backend application stack](https://github.com/bu-ist/ett) contains a bucket that is configured to host the front end application as built, including handling for the special `/parameters` endpoint.

## Development

The application has a standard [Vite](https://vite.dev/guide/) based local runtime including hot-reloading.  

### Proxy

In order to access the backend
application end through the local development server at `http://localhost:5173`, you will need to set up the proxy settings to get around CORS issues with `localhost`.  This is done by creating a `.env` file in the root of the project. There is a sample `.env.example` file in the root of the project that you can copy and rename to `.env`.  The `.env` file must be filled in with the values from the `/parameters` endpoint of the specific backend application instance being used.  This `.env` file will be read in by the Vite development server configuration at `/vite.config.js` and will be used to set up the proxy server.  The proxy server will forward requests from the local development server to the backend application instance, allowing you to test the application locally without running into CORS issues.

### Starting the Development Server

To start development:

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically at `http://localhost:5173`. Vite provides:
- Hot Module Replacement (HMR) for instant feedback
- Fast refresh for React components
- Automatic port assignment if 5173 is in use

3. For building the production version:

```bash
npm run build
```

4. To preview the production build locally:

```bash
npm run preview
```

## Making a build

To make a production build, first make sure you have the latest dependencies installed:

```bash
npm install
```

Then, to create a production build, you can use the following command:

```bash
npm run build
``` 

This will create a `dist` folder containing the optimized static files for deployment. You can serve this folder with any static file server or deploy it to your preferred hosting service.
