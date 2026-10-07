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


# ---- Etapa 2: tests ----
FROM build AS test

ENTRYPOINT ["dotnet", "test", "MisGastos.sln", \
    "/p:CollectCoverage=true", \
    "/p:Threshold=35%2c50", \
    "/p:ThresholdType=line%2cbranch", \
    "/p:Exclude=[MisGastos.Api]Program*%2c[MisGastos.Api]MisGastos.Api.Data.*%2c[MisGastos.Api]MisGastos.Api.Models.*%2c[MisGastos.Api]MisGastos.Api.Migrations.*%2c[MisGastos.Api]Microsoft.AspNetCore.OpenApi.Generated.*%2c[MisGastos.Api]System.Runtime.CompilerServices.*OpenApiXmlCommentSupport*", \
    "--logger", "trx;LogFileName=tests.trx", \
    "--results-directory", "/out"]


# ---- Etapa 3: runtime ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "MisGastos.Api.dll"]