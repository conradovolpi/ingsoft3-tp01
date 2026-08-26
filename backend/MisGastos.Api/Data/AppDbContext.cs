using Microsoft.EntityFrameworkCore;
using MisGastos.Api.Models;

namespace MisGastos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Expense> Expenses { get; set; }
}
