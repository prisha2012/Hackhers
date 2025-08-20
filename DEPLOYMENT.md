# Azure Deployment Guide

This guide covers multiple ways to deploy the HackHub Event Management System to Azure.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed locally
- Node.js 18+ installed
- Git repository (GitHub recommended)

## Deployment Options

### Option 1: Azure Static Web Apps (Recommended)

Azure Static Web Apps is perfect for React applications with automatic CI/CD.

#### Steps:

1. **Create Azure Static Web App**
   ```bash
   az staticwebapp create \
     --name hackhub-event-management \
     --resource-group rg-hackhub \
     --source https://github.com/yourusername/hackhub \
     --location "East US 2" \
     --branch main \
     --app-location "/" \
     --output-location "dist"
   ```

2. **Configure Environment Variables**
   - Go to Azure Portal → Static Web Apps → Configuration
   - Add these application settings:
     - `VITE_API_BASE_URL`: Your backend API URL
     - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk key (optional)

3. **GitHub Integration**
   - The deployment will automatically create a GitHub Action
   - Push to main branch triggers automatic deployment
   - Uses `.github/workflows/azure-static-web-apps.yml`

#### GitHub Secrets Required:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: From Azure portal
- `VITE_API_BASE_URL`: Your backend API URL
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk key

### Option 2: Azure App Service

For more control and backend integration.

#### Steps:

1. **Create App Service**
   ```bash
   az webapp create \
     --resource-group rg-hackhub \
     --plan myAppServicePlan \
     --name hackhub-event-management \
     --runtime "NODE|18-lts"
   ```

2. **Build and Deploy**
   ```bash
   npm run build:azure
   cd dist && zip -r ../dist.zip .
   az webapp deployment source config-zip \
     --resource-group rg-hackhub \
     --name hackhub-event-management \
     --src dist.zip
   ```

3. **Configure App Settings**
   ```bash
   az webapp config appsettings set \
     --resource-group rg-hackhub \
     --name hackhub-event-management \
     --settings VITE_API_BASE_URL="https://your-api.azurewebsites.net/api"
   ```

### Option 3: Azure DevOps Pipeline

For enterprise CI/CD with Azure DevOps.

#### Steps:

1. **Import Repository** to Azure DevOps
2. **Create Pipeline** using `azure-pipelines.yml`
3. **Configure Variables**:
   - `VITE_API_BASE_URL`
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `azureSubscription`
   - `appName`
   - `resourceGroupName`

## Environment Configuration

### Production Environment Variables

Create these in your Azure deployment:

```bash
# Required
VITE_API_BASE_URL=https://your-backend-api.azurewebsites.net/api

# Optional - for Clerk authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key

# Development
VITE_NODE_ENV=production
```

## Backend Deployment

If you have a backend API, deploy it separately:

### Azure Container Apps (Recommended)
```bash
az containerapp create \
  --name hackhub-api \
  --resource-group rg-hackhub \
  --environment myContainerAppEnv \
  --image your-api-image \
  --target-port 3001
```

### Azure App Service
```bash
az webapp create \
  --resource-group rg-hackhub \
  --plan myAppServicePlan \
  --name hackhub-api \
  --runtime "NODE|18-lts"
```

## Custom Domain & SSL

### For Static Web Apps:
```bash
az staticwebapp hostname set \
  --name hackhub-event-management \
  --hostname yourdomain.com
```

### For App Service:
```bash
az webapp config hostname add \
  --webapp-name hackhub-event-management \
  --resource-group rg-hackhub \
  --hostname yourdomain.com
```

## Monitoring & Logging

### Application Insights
```bash
az monitor app-insights component create \
  --app hackhub-insights \
  --location eastus \
  --resource-group rg-hackhub
```

### Log Stream
```bash
az webapp log tail \
  --name hackhub-event-management \
  --resource-group rg-hackhub
```

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (use 18+)
   - Verify environment variables
   - Check build logs in Azure portal

2. **Routing Issues**
   - Ensure `staticwebapp.config.json` is configured
   - For App Service, verify `web.config` is in dist folder

3. **API Connection Issues**
   - Verify `VITE_API_BASE_URL` is correct
   - Check CORS settings on backend
   - Ensure backend is deployed and accessible

### Useful Commands:

```bash
# Check deployment status
az webapp show --name hackhub-event-management --resource-group rg-hackhub

# View logs
az webapp log download --name hackhub-event-management --resource-group rg-hackhub

# Restart app
az webapp restart --name hackhub-event-management --resource-group rg-hackhub
```

## Cost Optimization

- **Static Web Apps**: Free tier available, pay-as-you-go
- **App Service**: Use B1 Basic for development, scale up for production
- **Container Apps**: Consumption-based pricing
- **Application Insights**: Free tier with 1GB/month

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure properly for your domain
4. **Authentication**: Use Azure AD or Clerk for production
5. **Content Security Policy**: Configured in `staticwebapp.config.json`

## Next Steps

1. Choose your deployment method
2. Set up your Azure resources
3. Configure environment variables
4. Deploy your application
5. Set up monitoring and alerts
6. Configure custom domain (optional)

For support, check Azure documentation or create an issue in the repository.
