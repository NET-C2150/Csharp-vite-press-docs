---
slug: azure
title: Azure Resources
---

## ServiceStack.Azure

ServiceStack.Azure package provides support to Azure ServiceBus and Azure Blob Storage. All features are incapsulated in single ServiceStack.Azure package. To install package run from NuGet

::: nuget
`<PackageReference Include="ServiceStack.Azure" Version="5.*" />`
:::

ServiceStack.Azure includes implementation of the following ServiceStack providers:

- [ServiceBusMqServer](#ServiceBusMqServer) - [MQ Server](https://docs.servicestack.net/messaging) for invoking ServiceStack Services via Azure ServiceBus
- [AzureBlobVirtualFiles](#virtual-filesystem-backed-by-azure-blob-storage) - Virtual file system based on Azure Blob Storage
- [AzureTableCacheClient](#caching-support-with-azure-table-storage) - Cache client over Azure Table Storage

### ServiceBusMqServer

The code to configure and start an ServiceBus MQ Server is similar to other MQ Servers:

```csharp
container.Register<IMessageService>(c => new ServiceBusMqServer(ConnectionString));

var mqServer = container.Resolve<IMessageService>();
mqServer.RegisterHandler<ServiceDto>(ExecuteMessage);

AfterInitCallbacks.Add(appHost => mqServer.Start());
```

Where ConnectionString is connection string to Service Bus, how to obtain it from Azure Portal you can find in [Get Started with Service Bus queues](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues) article

When an MQ Server is registered, ServiceStack automatically publishes Requests accepted on the "One Way" pre-defined route to the registered MQ broker. The message is later picked up and executed by a Message Handler on a background Thread.

## Virtual FileSystem backed by Azure Blob Storage

You can use an Azure Blob Storage Container to serve website content with the **AzureBlobVirtualFiles**.

```csharp
public class AppHost : AppHostBase
{
    public override void Configure(Container container)
    {
        //All Razor Views, Markdown Content, imgs, js, css, etc are served from an Azure Blob Storage container

        //Use connection string to Azure Storage Emulator. For real application you should use connection string
        //to your Azure Storage account
        var azureBlobConnectionString = "UseDevelopmentStorage=true";
        //Azure container which hold your files. If it does not exist it will be automatically created.
        var containerName = "myazurecontainer";

        VirtualFiles = new AzureBlobVirtualFiles(connectionString, containerName);
        AddVirtualFileSources.Add(VirtualFiles);
    }
}
```

## Caching support with Azure Table Storage

The AzureTableCacheClient implements [ICacheClientExteded](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Caching/ICacheClientExtended.cs) and [IRemoveByPattern](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Caching/IRemoveByPattern.cs) using Azure Table Storage. 

```csharp
public class AppHost : AppHostBase
{
    public override void Configure(Container container)
    {
        string cacheConnStr = "UseDevelopmentStorage=true;";
        container.Register<ICacheClient>(new AzureTableCacheClient(cacheConnStr));
    }
}
```

### Deploying to Azure

See [Rockwind.Azure](https://github.com/sharp-apps/rockwind-azure) for a working configuration and step-by-step guide to deploy .NET Core Web Apps to Azure using Docker.

# Community Resources

  - [Using the Azure Cache With ServiceStack](http://blog.emmanuelnelson.com/post/33303196083/using-the-azure-cache-with-service-stack) by [@emmanuelnelson](http://emmanuelnelson.com/about-me)
  - [Securing ServiceStack using Azure Authentication Library and WPF Client](http://dhickey-ie-archive.azurewebsites.net/post/2012/12/12/Securing-ServiceStack-using-Azure-Authentication-Library.aspx) by [@randompunter](http://twitter.com/randompunter)
  - [ServiceStack.Azure](https://github.com/ServiceStack/ServiceStack.Azure), supporting VirtualPathProvider backed by Azure Blob Storage, and ICacheProvider backed by Azure Table Storage
