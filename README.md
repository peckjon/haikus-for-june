# Haikus for June

This is a quick node project for demoing Workspaces and deployment to Azure App Service using Actions. It is based off of the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world). It's great!!!

![June](https://user-images.githubusercontent.com/2132776/77270618-d139dd00-6c82-11ea-8e01-9ee81f49b937.png)

## Setting up Azure login

To enable Azure login for this app, follow these steps:

1. Register an application in Azure AD and obtain the following information:
   - Client ID
   - Tenant ID
   - Client Secret

2. Set the following environment variables in your deployment environment:
   - `AZURE_CLIENT_ID`: The Client ID of your registered Azure AD application
   - `AZURE_TENANT_ID`: The Tenant ID of your Azure AD
   - `AZURE_CLIENT_SECRET`: The Client Secret of your registered Azure AD application

3. Update your deployment configuration to include these environment variables.

4. The app is now configured to support Azure login.
