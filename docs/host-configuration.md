---
slug: host-configuration
title: AppHost Configuration
---

<iframe width="896" height="525" src="https://www.youtube.com/embed/mOpx5mUGoqI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

> YouTube: [https://youtu.be/mOpx5mUGoqI](https://youtu.be/mOpx5mUGoqI)

### Anatomy of a ServiceStack AppHost

All ServiceStack App's are configured within an AppHost which typically consists of the following elements:

```csharp
public class AppHost 
  : AppHostBase                       // Type of AppHost used, normally AppHostBase
{
    public AppHost() : base(
      "MyApp",                        // Service Name in Metadata Pages
      typeof(MyServices).Assembly) {} // The ServiceInterfaces Assemblies where all Services are located

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure(Container container)
    {
        // Set Global AppHost Configuration
        base.SetConfig(new HostConfig
        {
            DebugMode = AppSettings.Get(nameof(HostConfig.DebugMode), false)
        });

        //Register IOC Dependencies
        container.Register<IRedisClientsManager>(c => new RedisManagerPool());

        // Add Plugins to extend your App with additional functionality
        Plugins.Add(new AutoQueryFeature { 
            MaxLimit = 100  // Feature specific configuration
        });
    }
}
```

> Note: [DebugMode](/debugging#debugmode) should be not be `true` when deployed to production.

### Physical Project Structure

See [Physical Project Structure](/physical-project-structure) docs to learn about ServiceStack's Solution layout.

### Register AppHost in .NET Core

In ASP.NET Core, ServiceStack's AppHost is registered as middleware:

```csharp
// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
public void Configure(IApplicationBuilder app)
{
    //Register your ServiceStack AppHost as a .NET Core module
    app.UseServiceStack(new AppHost { 
        // Use ASP.NET Core configuration sources, e.g. **appsettings.json**
        AppSettings = new NetCoreAppSettings(Configuration) 
    }); 
}
```

See [.NET Core docs](/netcore) for more info on using ServiceStack on .NET Core.

### Run AppHost in .NET Framework

```csharp
new AppHost().Init();
```

### IOC Registration

See [IOC docs](/ioc) for an overview of the APIs and behavior of ServiceStack's built-in Funq IOC.

### Modularizing Services

See [Modularizing Services](/modularizing-services) for info on Modularizing functionality in your AppHost.

### Default HostConfig

The default configuration for ServiceStack's `HostConfig`, for the most up to date version see 
[HostConfig.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/HostConfig.cs):

```csharp
SetConfig(new HostConfig {
    WsdlServiceNamespace = "http://schemas.servicestack.net/types",
    ApiVersion = "1.0",
    EmbeddedResourceSources = new List<Assembly>(),
    EmbeddedResourceBaseTypes = new[] { HostContext.AppHost.GetType(), typeof(Service) }.ToList(),
    EmbeddedResourceTreatAsFiles = new HashSet<string>(),
    EnableAccessRestrictions = true,
    EnableAutoHtmlResponses = true,
    WebHostPhysicalPath = "~".MapServerPath(),
    HandlerFactoryPath = ServiceStackPath,
    MetadataRedirectPath = null,
    DefaultContentType = null,
    PreferredContentTypes = new List<string> {
        MimeTypes.Html, MimeTypes.Json, MimeTypes.Xml, MimeTypes.Jsv
    },
    AllowJsonpRequests = true,
    AllowRouteContentTypeExtensions = true,
    UseHttpOnlyCookies = true,  //default ;HttpOnly
    UseSecureCookies = true,    //default ;Secure (https)
    UseSameSiteCookies = false, //default ;SameSite=Lax
    DebugMode = false,
    StrictMode = Env.StrictMode,
    DefaultDocuments = new List<string> {
        "default.htm",
        "default.html",
        "default.cshtml",
        "default.md",
        "index.htm",
        "index.html",
        "default.aspx",
        "default.ashx",
    },
    GlobalResponseHeaders = new Dictionary<string, string> {
        { "Vary", "Accept" },
        { "X-Powered-By", Env.ServerUserAgent },
    },
    IsMobileRegex = new Regex("Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|(hpw|web)OS|Fennec|" 
                     + "Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune", RegexOptions.Compiled),
    RequestRules = new Dictionary<string, Func<IHttpRequest, bool>> {
        {"AcceptsHtml", req => req.Accept?.IndexOf(MimeTypes.Html, StringComparison.Ordinal) >= 0 },
        {"AcceptsJson", req => req.Accept?.IndexOf(MimeTypes.Json, StringComparison.Ordinal) >= 0 },
        {"AcceptsXml", req => req.Accept?.IndexOf(MimeTypes.Xml, StringComparison.Ordinal) >= 0 },
        {"AcceptsJsv", req => req.Accept?.IndexOf(MimeTypes.Jsv, StringComparison.Ordinal) >= 0 },
        {"AcceptsCsv", req => req.Accept?.IndexOf(MimeTypes.Csv, StringComparison.Ordinal) >= 0 },
        {"IsAuthenticated", req => req.IsAuthenticated() },
        {"IsMobile", req => Instance.IsMobileRegex.IsMatch(req.UserAgent) },
        {"{int}/**", req => int.TryParse(req.PathInfo.Substring(1).LeftPart('/'), out _) },
        {"path/{int}/**", req => {
            var afterFirst = req.PathInfo.Substring(1).RightPart('/');
            return !string.IsNullOrEmpty(afterFirst) && int.TryParse(afterFirst.LeftPart('/'), out _);
        }},
        {"**/{int}", req => int.TryParse(req.PathInfo.LastRightPart('/'), out _) },
        {"**/{int}/path", req => {
            var beforeLast = req.PathInfo.LastLeftPart('/');
            return !string.IsNullOrEmpty(beforeLast) && int.TryParse(beforeLast.LastRightPart('/'), out _);
        }},
    },
    IgnoreFormatsInMetadata = new HashSet<string>(StringComparer.OrdinalIgnoreCase) {},
    AllowFileExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "js", "ts", "tsx", "jsx", "css", "htm", "html", "shtm", "txt", "xml", "rss", "csv", "pdf",
        "jpg", "jpeg", "gif", "png", "bmp", "ico", "tif", "tiff", "svg",
        "avi", "divx", "m3u", "mov", "mp3", "mpeg", "mpg", "qt", "vob", "wav", "wma", "wmv",
        "flv", "swf", "xap", "xaml", "ogg", "ogv", "mp4", "webm", "eot", "ttf", "woff", "woff2", "map",
        "xls", "xla", "xlsx", "xltx", "doc", "dot", "docx", "dotx", "ppt", "pps", "ppa", "pptx", "potx", 
        "wasm"
    },
    CompressFilesWithExtensions = new HashSet<string>(),
    AllowFilePaths = new List<string>
    {
        "jspm_packages/**/*.json", //JSPM
        ".well-known/**/*",        //LetsEncrypt
    },
    ForbiddenPaths = new List<string>(),
    DebugAspNetHostEnvironment = Env.IsMono ? "FastCGI" : "IIS7",
    DebugHttpListenerHostEnvironment = Env.IsMono ? "XSP" : "WebServer20",
    EnableFeatures = Feature.All,
    WriteErrorsToResponse = true,
    ReturnsInnerException = true,
    DisposeDependenciesAfterUse = true,
    LogUnobservedTaskExceptions = true,
    HtmlReplaceTokens = new Dictionary<string, string>(),
    AddMaxAgeForStaticMimeTypes = new Dictionary<string, TimeSpan> {
        { "image/gif", TimeSpan.FromHours(1) },
        { "image/png", TimeSpan.FromHours(1) },
        { "image/jpeg", TimeSpan.FromHours(1) },
    },
    AppendUtf8CharsetOnContentTypes = new HashSet<string> { MimeTypes.Json, },
    RouteNamingConventions = new List<RouteNamingConventionDelegate> {
        RouteNamingConvention.WithRequestDtoName,
        RouteNamingConvention.WithMatchingAttributes,
        RouteNamingConvention.WithMatchingPropertyNames
    },
    MapExceptionToStatusCode = new Dictionary<Type, int>(),
    UseSaltedHash = false,
    FallbackPasswordHashers = new List<IPasswordHasher>(),
    AllowSessionIdsInHttpParams = false,
    AllowSessionCookies = true,
    RestrictAllCookiesToDomain = null,
    DefaultJsonpCacheExpiration = new TimeSpan(0, 20, 0),
    MetadataVisibility = RequestAttributes.Any,
    Return204NoContentForEmptyResponse = true,
    AllowJsConfig = true,
    AllowPartialResponses = true,
    AllowAclUrlReservation = true,
    AddRedirectParamsToQueryString = false,
    RedirectToDefaultDocuments = false,
    RedirectDirectoriesToTrailingSlashes = true,
    StripApplicationVirtualPath = false,
    ScanSkipPaths = new List<string> {
        "obj/",
        "bin/",
        "node_modules/",
        "jspm_packages/",
        "bower_components/",
        "wwwroot_build/",
        "wwwroot/", // only in .NET Framework
    },
    RedirectPaths = new Dictionary<string, string>
    {
        { "/metadata/", "/metadata" },
    },
    IgnoreWarningsOnPropertyNames = new List<string> {
        Keywords.Format, Keywords.Callback, Keywords.Debug, Keywords.AuthSecret, Keywords.JsConfig,
        Keywords.IgnorePlaceHolder, Keywords.Version, Keywords.VersionAbbr, Keywords.Version.ToPascalCase(),
        Keywords.ApiKeyParam, Keywords.Code, Keywords.Redirect, Keywords.Continue, "s", "f"
    },
    XmlWriterSettings = new XmlWriterSettings
    {
        Encoding = new UTF8Encoding(encoderShouldEmitUTF8Identifier: false),
    },
    FallbackRestPath = null,
    UseHttpsLinks = false,
    UseJsObject = true,
    EnableOptimizations = true,
    UseCamelCase = true, // only in .NET Core; otherwise false
});
```

## Configure Logging

To ensure every ServiceStack service uses the same Global Logger it should be configured before ServiceStack's `AppHost` is initialized, e.g:

```csharp
LogManager.LogFactory = new ConsoleLogFactory(); 
new AppHost().Init();
```

See [Logging docs](/logging) for info on the various logging providers available.

## Testing

See [Unit and Integration Testing](/testing) docs for testing with ServiceStack.
