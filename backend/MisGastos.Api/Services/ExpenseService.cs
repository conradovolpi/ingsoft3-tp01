using MisGastos.Api.Models;
using MisGastos.Api.Repositories;

namespace MisGastos.Api.Services;

public class ExpenseService
{
    private readonly IExpenseRepository _repository;

    public ExpenseService(IExpenseRepository repository)
    {
        _repository = repository;
    }

    public bool IsValidMonth(int month)
    {
        return month >= 1 && month <= 12;
    }

    public bool IsValidYear(int year)
    {
        return year > 0;
    }

    public bool IsValidExpense(Expense expense)
    {
        if (expense.Amount <= 0)
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(expense.Description))
        {
            return false;
        }

        return true;
    }

    public async Task<Expense> CreateExpenseAsync(Expense expense)
    {
        if (!IsValidExpense(expense))
        {
            throw new ArgumentException("El gasto no es válido.");
        }

        await _repository.AddAsync(expense);

        return expense;
    }

    public async Task<MonthlySummary> GetMonthlySummaryAsync(int year, int month)
    {
        if (!IsValidMonth(month))
        {
            throw new ArgumentException("El mes debe estar entre 1 y 12.");
        }

        if (!IsValidYear(year))
        {
            throw new ArgumentException("El año debe ser válido.");
        }

        var expenses = await _repository.GetByMonthAsync(year, month);

        return new MonthlySummary
        {
            Year = year,
            Month = month,
            Total = expenses.Sum(e => e.Amount),

            ByCategory = expenses
                .GroupBy(e => e.Category)
                .ToDictionary(
                    group => group.Key,
                    group => group.Sum(e => e.Amount)
                )
        };
    }
}
