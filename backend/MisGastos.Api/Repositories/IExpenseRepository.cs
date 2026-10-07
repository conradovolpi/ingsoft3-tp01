using MisGastos.Api.Models;

namespace MisGastos.Api.Repositories;

public interface IExpenseRepository
{
    Task<List<Expense>> GetByMonthAsync(int year, int month);
    Task AddAsync(Expense expense);
}