# Spare Parts React
This is a React based client for the Spare Parts .Net API [https://github.com/sjmarsh/SpareParts](https://github.com/sjmarsh/SpareParts).  Similarly to that repo, this is a Spike/Playground project to test out different React technologies and patterns.

## Technologies:
- React
- Redux / Redux Toolkit
- React Router
- React Bootstrap
- Formik
- Yup
- Typescript
- Bootstrap
- Vite

## Testing:
- Vitest
- Jest

## Dependencies / Setup
- Requires Node to be installed
- The Spare Parts .Net Web API should be running 
- Self-signed SSL certificates should be created.  eg. [https://www.makeuseof.com/create-react-app-ssl-https/](https://www.makeuseof.com/create-react-app-ssl-https/)
    - The vite.config.ts file has been configured to load certificates from a ../reactcert folder (relative to this project folder).
