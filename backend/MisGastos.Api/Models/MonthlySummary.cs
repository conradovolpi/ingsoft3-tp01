namespace MisGastos.Api.Models;

public class MonthlySummary
{
    public int Year { get; set; }

    public int Month { get; set; }

    public decimal Total { get; set; }

    public Dictionary<string, decimal> ByCategory { get; set; } = new();
}