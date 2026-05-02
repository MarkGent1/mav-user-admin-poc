namespace Mav.UserMgmt.Api.Tests;

using Mav.UserMgmt.Api.Controllers;
using Mav.UserMgmt.Api.DTOs;
using Mav.UserMgmt.Api.Models;
using Mav.UserMgmt.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

public class UsersControllerTests
{
    [Fact]
    public async Task GetUsers_ReturnsOkResult()
    {
        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.GetAllUsersAsync()).ReturnsAsync(new List<User>());

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.GetUsers();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public async Task GetUsers_ReturnsEmptyList_WhenNoUsersExist()
    {
        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.GetAllUsersAsync()).ReturnsAsync(new List<User>());

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.GetUsers();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<List<UserResponse>>(okResult.Value);
        Assert.Empty(response);
    }

    [Fact]
    public async Task GetUsers_ReturnsListOfUsers_WhenUsersExist()
    {
        var users = new List<User>
        {
            new User { Id = 1, Name = "Alice", Email = "alice@example.com", Role = "Admin" },
            new User { Id = 2, Name = "Bob", Email = "bob@example.com", Role = "User" }
        };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.GetAllUsersAsync()).ReturnsAsync(users);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.GetUsers();

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<List<UserResponse>>(okResult.Value);
        Assert.Equal(2, response.Count);
        Assert.Equal(1, response[0].Id);
        Assert.Equal("Alice", response[0].Name);
        Assert.Equal("alice@example.com", response[0].Email);
        Assert.Equal("Admin", response[0].Role);
        Assert.Equal(2, response[1].Id);
        Assert.Equal("Bob", response[1].Name);
        Assert.Equal("bob@example.com", response[1].Email);
        Assert.Equal("User", response[1].Role);
    }
}
