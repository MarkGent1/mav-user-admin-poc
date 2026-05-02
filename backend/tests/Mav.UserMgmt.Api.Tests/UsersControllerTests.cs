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
    public async Task GetUser_ReturnsOkResult()
    {
        var user = new User { Id = 1, Name = "Alice", Email = "alice@example.com", Role = "Admin", Deleted = false };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.GetUserAsync(1)).ReturnsAsync(user);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.GetUser(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        var response = Assert.IsType<UserResponse>(okResult.Value);
        Assert.Equal(1, response.Id);
        Assert.Equal("Alice", response.Name);
        Assert.Equal("alice@example.com", response.Email);
        Assert.Equal("Admin", response.Role);
    }

    [Fact]
    public async Task GetUser_ReturnsNotFound_WhenUserNotFound()
    {
        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.GetUserAsync(999)).ReturnsAsync((User?)null);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.GetUser(999);

        Assert.IsType<NotFoundObjectResult>(result);
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

    [Fact]
    public async Task CreateUser_ReturnsCreatedResult()
    {
        var request = new CreateUserRequest { Name = "Charlie", Email = "charlie@example.com", Role = "User" };
        var createdUser = new User { Id = 1, Name = "Charlie", Email = "charlie@example.com", Role = "User", Deleted = false };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.CreateUserAsync(request)).ReturnsAsync(createdUser);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.CreateUser(request);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, createdResult.StatusCode);
        var response = Assert.IsType<UserResponse>(createdResult.Value);
        Assert.Equal(1, response.Id);
        Assert.Equal("Charlie", response.Name);
        Assert.Equal("charlie@example.com", response.Email);
        Assert.Equal("User", response.Role);
    }

    [Fact]
    public async Task CreateUser_PersistsUser()
    {
        var request = new CreateUserRequest { Name = "Charlie", Email = "charlie@example.com", Role = "User" };
        var createdUser = new User { Id = 1, Name = "Charlie", Email = "charlie@example.com", Role = "User", Deleted = false };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.CreateUserAsync(request)).ReturnsAsync(createdUser);

        var controller = new UsersController(mockUserService.Object);

        await controller.CreateUser(request);

        mockUserService.Verify(s => s.CreateUserAsync(request), Times.Once);
    }

    [Fact]
    public async Task UpdateUser_ReturnsOkResult()
    {
        var request = new UpdateUserRequest { Name = "Charlie Updated", Email = "charlie.updated@example.com", Role = "Admin" };
        var updatedUser = new User { Id = 1, Name = "Charlie Updated", Email = "charlie.updated@example.com", Role = "Admin", Deleted = false };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.UpdateUserAsync(1, request)).ReturnsAsync(updatedUser);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.UpdateUser(1, request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        var response = Assert.IsType<UserResponse>(okResult.Value);
        Assert.Equal(1, response.Id);
        Assert.Equal("Charlie Updated", response.Name);
        Assert.Equal("charlie.updated@example.com", response.Email);
        Assert.Equal("Admin", response.Role);
    }

    [Fact]
    public async Task UpdateUser_UpdatesUser()
    {
        var request = new UpdateUserRequest { Name = "Charlie Updated", Email = "charlie.updated@example.com", Role = "Admin" };
        var updatedUser = new User { Id = 1, Name = "Charlie Updated", Email = "charlie.updated@example.com", Role = "Admin", Deleted = false };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.UpdateUserAsync(1, request)).ReturnsAsync(updatedUser);

        var controller = new UsersController(mockUserService.Object);

        await controller.UpdateUser(1, request);

        mockUserService.Verify(s => s.UpdateUserAsync(1, request), Times.Once);
    }

    [Fact]
    public async Task UpdateUser_ReturnsNotFound_WhenUserNotFound()
    {
        var request = new UpdateUserRequest { Name = "Charlie Updated", Email = "charlie.updated@example.com", Role = "Admin" };

        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.UpdateUserAsync(999, request)).ReturnsAsync((User?)null);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.UpdateUser(999, request);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteUser_ReturnsNoContent()
    {
        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.DeleteUserAsync(1)).ReturnsAsync(true);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.DeleteUser(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteUser_DeletesUser()
    {
        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.DeleteUserAsync(1)).ReturnsAsync(true);

        var controller = new UsersController(mockUserService.Object);

        await controller.DeleteUser(1);

        mockUserService.Verify(s => s.DeleteUserAsync(1), Times.Once);
    }

    [Fact]
    public async Task DeleteUser_ReturnsNotFound_WhenUserNotFound()
    {
        var mockUserService = new Mock<IUserService>();
        mockUserService.Setup(s => s.DeleteUserAsync(999)).ReturnsAsync(false);

        var controller = new UsersController(mockUserService.Object);

        var result = await controller.DeleteUser(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }
}
