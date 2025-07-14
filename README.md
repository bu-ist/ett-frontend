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
[details available from this stack overflow.](https://stackoverflow.com/questions/51218979/react-router-doesnt-work-in-aws-s3-bucket/71591815#71591815).  
The [backend application stack](https://github.com/bu-ist/ett) contains a bucket that is configured to host the front end application as built, including handling for the special `/parameters` endpoint. No additional configuration is required to deploy the front end application to this bucket.

## Development

The application has a standard [Vite](https://vite.dev/guide/) based local runtime including hot-reloading.  


### Local Development Proxy

To avoid CORS issues when accessing backend APIs during local development, this project uses Vite’s proxy feature. The proxy forwards API requests from the Vite dev server (e.g., `http://localhost:5173`) to the appropriate backend endpoints, allowing your frontend code to interact with the backend as if it were available locally.

**How it works:**
- Proxy rules are defined in `vite.config.js` for each backend API (e.g., `/authorizedApi`, `/consentingApi`, etc.).
- These rules use environment variables from your `.env` file to determine the backend targets.
- When running the dev server, requests to these paths are transparently forwarded to the real backend, bypassing CORS restrictions.
- In production, the app uses the actual API URLs and does not rely on the proxy.

**Setup instructions for contributors:**
1. Copy `.env.example` to `.env` in the project root.
2. Fill in the values in `.env` using the `/parameters` endpoint from your backend instance.
3. Start the dev server with `npm run dev`. The proxy will be active automatically.

**Example:**
- A frontend request to `/authorizedApi/dev/RE_AUTH_IND` will be proxied to the real backend API host defined in your `.env` file.

**Note:**  
The proxy is only active in development mode. Production builds use the real API endpoints directly and do not require this setup.

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
