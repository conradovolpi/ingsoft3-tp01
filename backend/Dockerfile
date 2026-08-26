# ---- Etapa 1: build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Primero copiamos solución y proyectos para aprovechar el cache
COPY MisGastos.sln .
COPY MisGastos.Api/MisGastos.Api.csproj MisGastos.Api/
COPY MisGastos.Tests/MisGastos.Tests.csproj MisGastos.Tests/

RUN dotnet restore MisGastos.sln

# Después copiamos el resto del código
COPY . .

RUN dotnet publish MisGastos.Api/MisGastos.Api.csproj -c Release -o /app/publish --no-restore


# ---- Etapa 2: runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "MisGastos.Api.dll"]
