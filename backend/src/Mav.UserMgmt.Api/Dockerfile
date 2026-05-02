FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/Mav.UserMgmt.Api/Mav.UserMgmt.Api.csproj", "src/Mav.UserMgmt.Api/"]
RUN dotnet restore "src/Mav.UserMgmt.Api/Mav.UserMgmt.Api.csproj"
COPY src/Mav.UserMgmt.Api/. src/Mav.UserMgmt.Api/
WORKDIR /src/src/Mav.UserMgmt.Api
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Mav.UserMgmt.Api.dll"]
