using MisGastos.Api.Models;
using MisGastos.Api.Repositories;
using MisGastos.Api.Services;
using Moq;

namespace MisGastos.Tests;

public class ExpenseServiceTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(13)]
    [InlineData(-1)]
    public void IsValidMonth_MesFueraDeRango_EsInvalido(int month)
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();
        var service = new ExpenseService(repository.Object);

        // Act
        var result = service.IsValidMonth(month);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(6)]
    [InlineData(12)]
    public void IsValidMonth_MesDentroDelRango_EsValido(int month)
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();
        var service = new ExpenseService(repository.Object);

        // Act
        var result = service.IsValidMonth(month);

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void IsValidYear_AnioNoPositivo_EsInvalido(int year)
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();
        var service = new ExpenseService(repository.Object);

        // Act
        var result = service.IsValidYear(year);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-100)]
    public void IsValidExpense_MontoNoPositivo_EsInvalido(double amount)
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();
        var service = new ExpenseService(repository.Object);

        var expense = new Expense
        {
            Description = "Supermercado",
            Amount = (decimal)amount,
            Category = "Comida",
            Date = DateTime.Today
        };

        // Act
        var result = service.IsValidExpense(expense);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void IsValidExpense_DescripcionVacia_EsInvalido(string description)
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();
        var service = new ExpenseService(repository.Object);

        var expense = new Expense
        {
            Description = description,
            Amount = 1000,
            Category = "Comida",
            Date = DateTime.Today
        };

        // Act
        var result = service.IsValidExpense(expense);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetMonthlySummaryAsync_GastosDelMes_SumaElTotalCorrectamente()
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();

        repository
            .Setup(r => r.GetByMonthAsync(2026, 10))
            .ReturnsAsync(new List<Expense>
            {
                new() { Amount = 1000, Category = "Comida" },
                new() { Amount = 500, Category = "Transporte" },
                new() { Amount = 250, Category = "Comida" }
            });

        var service = new ExpenseService(repository.Object);

        // Act
        var result = await service.GetMonthlySummaryAsync(2026, 10);

        // Assert
        Assert.Equal(1750m, result.Total);
    }

    [Fact]
    public async Task GetMonthlySummaryAsync_GastosDeVariasCategorias_AgrupaCorrectamente()
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();

        repository
            .Setup(r => r.GetByMonthAsync(2026, 10))
            .ReturnsAsync(new List<Expense>
            {
                new() { Amount = 1000, Category = "Comida" },
                new() { Amount = 500, Category = "Transporte" },
                new() { Amount = 250, Category = "Comida" }
            });

        var service = new ExpenseService(repository.Object);

        // Act
        var result = await service.GetMonthlySummaryAsync(2026, 10);

        // Assert
        Assert.Equal(1250m, result.ByCategory["Comida"]);
        Assert.Equal(500m, result.ByCategory["Transporte"]);
    }

    [Fact]
    public async Task CreateExpenseAsync_GastoValido_GuardaUnaSolaVez()
    {
        // Arrange
        var repository = new Mock<IExpenseRepository>();

        var service = new ExpenseService(repository.Object);

        var expense = new Expense
        {
            Description = "Nafta",
            Amount = 20000,
            Category = "Transporte",
            Date = DateTime.Today
        };

        // Act
        await service.CreateExpenseAsync(expense);

        // Assert
        repository.Verify(
            r => r.AddAsync(expense),
            Times.Once
        );
    }
}