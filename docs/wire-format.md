---
slug: wire-format
title: Wire Format
---

[Wire](https://github.com/akkadotnet/Wire) is an efficient binary serialization format from the 
[Akka.NET Team](http://getakka.net) with comparable performance to ProtoBuf but like MsgPack doesn’t 
require your POCO’s to be annotated with `[DataContract]` attributes making it more suitable for 
code-first POCO DTOs.

## Installing via NuGet

Wire is easily installed with the [ServiceStack.Wire](https://nuget.org/packages/ServiceStack.Wire) NuGet package:

    PM> Install-Package ServiceStack.Wire

After the NuGet Package is added to your Project, enable the Wire format in your `AppHost` with:

    Plugins.Add(new WireFormat());

The NuGet plugin also includes the **WireServiceClient** client below so you can 
easily call it from any C# Client.

## Client Usage

Just like the rest of ServiceStack C# Clients, `WireServiceClient` is interchangeable with the other 
Service clients and provides and end-to-end API for consuming ServiceStack's Services, e.g:

```csharp
var client = new WireServiceClient(BaseUri);
List<Todo> all = client.Get(new Todos());           // Count = 0

var todo = client.Post(
    new Todo { Content = "New TODO", Order = 1 });  // todo.Id = 1
all = client.Get(new Todos());                      // Count = 1

todo.Content = "Updated TODO";
todo = client.Put(todo);                            // todo.Content = Updated TODO

client.Delete(new Todos(todo.Id));
all = client.Get(new Todos());   
```
