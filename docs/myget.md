---
slug: myget
title: MyGet
---

## ServiceStack pre-release MyGet Feed

Our interim pre-release NuGet packages first get published to 
[MyGet](https://www.myget.org/).

Instructions to add ServiceStack's MyGet feed to VS.NET are:

  1. Go to `Tools -> Options -> Package Manager -> Package Sources`
  2. Add the Source `https://www.myget.org/F/servicestack` with the name of your choice, 
  e.g. _ServiceStack MyGet feed_

![NuGet Package Sources](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/myget/package-sources.png)

After registering the MyGet feed it will show up under NuGet package sources when opening the NuGet 
package manager dialog:

![NuGet Package Manager](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/myget/package-manager-ui.png)

Which will allow you to search and install pre-release packages from the selected MyGet feed.

### Adding MyGet feed without VS.NET

If you're not using or don't have VS.NET installed, you can add the MyGet feed to your NuGet.config at `%AppData%\NuGet\NuGet.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="ServiceStack MyGet feed" value="https://www.myget.org/F/servicestack" />
    <add key="nuget.org" value="https://www.nuget.org/api/v2/" />
  </packageSources>
</configuration>
```

Download `NuGet.Config` for usage in local project using [mix tool](/mix-tool):

    $ web mix myget

## Redownloading MyGet packages

If you've already packages with the **same version number** from MyGet previously installed, you will 
need to manually delete the NuGet `/packages` folder for NuGet to pull down the latest packages.

### Clear NuGet Package Cache

You can clear your local NuGet packages cache in any OS by running the command-line below in your favorite Terminal:

    $ nuget locals all -clear

If `nuget` is not in your Systems `PATH`, it can also be invoked from the `dotnet` tool:

    $ dotnet nuget locals all -clear

If you're using VS.NET you can also clear them from `Tools -> Options -> NuGet Package Manager` and click **Clear All NuGet Cache(s)**:

![Clear Packages Cache](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/myget/clear-package-cache.png)

Alternatively on Windows you can delete the Cached NuGet packages manually with:

    $ del %LOCALAPPDATA%\NuGet\Cache\*.nupkg /q

### Full Package Clean

In most cases clearing the NuGet packages cache will suffice, sometimes you'll also need to manually delete the other local packages cache

    $ rd /q /s packages  # delete all NuGet packages in `/packages` folder
    $ rd /q /s bin obj   # delete `/bin` and `/obj` folders in host project

## Versioning Scheme

All ServiceStack packages are published together in "lockstep" with the same version number so the effort to upgrade ServiceStack projects can be done all at same time, with low frequency. 

ServiceStack Versions adopt the following 3-part versioning scheme:

    {MAJOR}.{MINOR}.{PATCH}

### Major versions 

The `{MAJOR}` is reserved for Major releases like [v5 containing structural changes](/releases/v5.0.0) that may require changes to external environment and/or project configurations. Major structural releases should be few and far between with currently no plans for any in the immediate future.

### Minor versions

The `{MINOR}` version is used for major ServiceStack official releases which will have a `{PATCH}` version of **0**.

#### Patch versions

The `{PATCH}` version is used to distinguish updates from normal releases where a `{PATCH}` above **0** indicates an Enhancement Release.

Whilst we want to minimize the effort for Customers to upgrade we also want to make any fixes or enhancements to the previous release available sooner as there are often fixes reported and resolved immediately after each release and made available in our **pre-release packages on MyGet** that most Customers wont get until the next major Release on NuGet. 

To deliver updates sooner we dedicate time immediately after each release to resolving issues and adding enhancements to existing features so we can publish update releases before starting work on new major features. Update releases will be primarily additive and minimally disruptive so they're safe to upgrade.

- An **even** `{PATCH}` version number indicates an "Update" release published to **NuGet**.
- An **odd** version number indicates a "pre-release" version that's only **available on MyGet**

Versioning scheme example:

  - **v5.0.0** - Current Major Release with structural changes
    - v5.0.2 - Enhancement of Major v5.0.0 Release
    - v5.0.3 - Pre-release packages published to MyGet only
    - v5.0.4? - Enhancement of Major v5.0.0 Release (if any)
  - **v5.1.0** - Next Major Release
    - v5.1.1 - Pre-release packages published to MyGet only
    - v5.1.2? - Enhancement of Major v5.1.0 Release (if any)
  - ...
  - **v6.0.0** - Next Major Release with structural changes
