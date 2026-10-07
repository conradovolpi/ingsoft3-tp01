using Microsoft.EntityFrameworkCore;
using MisGastos.Api.Data;
using MisGastos.Api.Models;

namespace MisGastos.Api.Repositories;

public class ExpenseRepository : IExpenseRepository
{
    private readonly AppDbContext _context;

    public ExpenseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Expense>> GetByMonthAsync(int year, int month)
    {
        return await _context.Expenses
            .Where(e => e.Date.Year == year && e.Date.Month == month)
            .ToListAsync();
    }

    public async Task AddAsync(Expense expense)
    {
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
    }
}
