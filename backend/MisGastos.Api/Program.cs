
using Microsoft.EntityFrameworkCore;
using MisGastos.Api.Data;
using MisGastos.Api.Repositories;
using MisGastos.Api.Services;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseSentry(o =>
{
    o.Dsn = builder.Configuration["SENTRY_DSN"];
    o.TracesSampleRate = 1.0;
    o.SendDefaultPii = false;
});

builder.Services.AddControllers();

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Falta configurar DefaultConnection");

var dbProvider = builder.Configuration["DB_PROVIDER"] ?? "mysql";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider.Equals("postgres", StringComparison.OrdinalIgnoreCase))
    {
        options.UseNpgsql(connectionString);
    }
    else if (dbProvider.Equals("mysql", StringComparison.OrdinalIgnoreCase))
    {
        options.UseMySql(
            connectionString,
            new MySqlServerVersion(new Version(8, 0, 0))
        );
    }
    else
    {
        throw new InvalidOperationException(
            $"Proveedor de base de datos no soportado: {dbProvider}");
    }
});

builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<ExpenseService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (dbProvider.Equals("postgres", StringComparison.OrdinalIgnoreCase))
    {
        db.Database.EnsureCreated();
    }
    else
    {
        db.Database.Migrate();
    }
}

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapControllers();

app.Run();
