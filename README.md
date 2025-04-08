# ServiceWatch

ServiceWatch is a modern web application for monitoring and managing infrastructure services. It provides an easy-to-use interface to track service status and manage them efficiently.

## Features

- Web service monitoring
- Service management (add, edit, delete)
- Modern and responsive user interface
- Search and filtering capabilities
- Light and dark theme support
- API key management

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Getting Started

### Development

1. Clone the repository:
```bash
git clone https://github.com/ernestodota2011/ServiceWatch.git
cd ServiceWatch
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

## Deployment

### Using Docker and Portainer

This repository includes all the necessary files for deploying with Docker and Portainer:

1. **Dockerfile**: Multi-stage build for optimized production image
2. **docker-compose.yml**: Configuration for deployment with Traefik integration
3. **nginx.conf**: Optimized Nginx settings for serving the React application

#### Option 1: Deploy using Portainer Stacks

1. In Portainer, navigate to **Stacks** and click **Add stack**
2. Use one of these methods:
   
   a. **Git Repository**:
   - Repository URL: `https://github.com/ernestodota2011/ServiceWatch.git`
   - Repository Reference: `main`
   - Compose Path: `docker-compose.yml`
   
   b. **Web Editor**:
   - Copy content from the `docker-compose.yml` file in this repository
   - Adjust domain and other settings as needed

3. Click **Deploy the stack**

#### Option 2: Manual Docker Deployment

If you prefer manual deployment:

1. Build the Docker image:
```bash
docker build -t ernestodota2011/servicewatch:latest .
```

2. Run the container:
```bash
docker run -d -p 8080:80 --name servicewatch ernestodota2011/servicewatch:latest
```

3. Access the application at http://localhost:8080

## Network Configuration

The docker-compose.yml file is configured to use the `generalnet` external network. Make sure this network exists in your Docker environment or modify the configuration to use an available network.

## Environment Configuration

The application uses local storage for data persistence by default. For production use, you may want to configure persistent storage or connect it to a backend service.

## License

This project is released under the MIT License.
