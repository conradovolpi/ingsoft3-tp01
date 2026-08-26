using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MisGastos.Api.Data;
using MisGastos.Api.Models;

namespace MisGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpensesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
    {
        var expenses = await _context.Expenses.ToListAsync();

        return Ok(expenses);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Expense>> GetExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        return Ok(expense);
    }

    [HttpPost]
    public async Task<ActionResult<Expense>> CreateExpense(Expense expense)
    {
        _context.Expenses.Add(expense);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetExpense),
            new { id = expense.Id },
            expense
        );
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        _context.Expenses.Remove(expense);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("summary")]
public async Task<ActionResult<MonthlySummary>> GetMonthlySummary(
    [FromQuery] int year,
    [FromQuery] int month)
{
    if (month < 1 || month > 12)
    {
        return BadRequest("El mes debe estar entre 1 y 12.");
    }

    if (year <= 0)
    {
        return BadRequest("El año debe ser válido.");
    }

    var expenses = await _context.Expenses
        .Where(e => e.Date.Year == year && e.Date.Month == month)
        .ToListAsync();

    var summary = new MonthlySummary
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

    return Ok(summary);
}
}