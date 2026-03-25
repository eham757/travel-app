# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY travel-app-api.csproj ./
RUN dotnet restore travel-app-api.csproj

COPY . .
RUN dotnet publish travel-app-api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

# Expose HTTP port used by ASP.NET inside the container
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "travel-app-api.dll"]
