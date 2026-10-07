using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MisGastos.Api.Data;
using MisGastos.Api.Models;
using MisGastos.Api.Services;

namespace MisGastos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ExpenseService _expenseService;

    public ExpensesController(
        AppDbContext context,
        ExpenseService expenseService)
    {
        _context = context;
        _expenseService = expenseService;
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
        try
        {
            var createdExpense =
                await _expenseService.CreateExpenseAsync(expense);

            return CreatedAtAction(
                nameof(GetExpense),
                new { id = createdExpense.Id },
                createdExpense
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
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
        try
        {
            var summary =
                await _expenseService.GetMonthlySummaryAsync(year, month);

            return Ok(summary);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}