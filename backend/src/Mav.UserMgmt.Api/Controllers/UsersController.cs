namespace Mav.UserMgmt.Api.Controllers;

using Mav.UserMgmt.Api.DTOs;
using Mav.UserMgmt.Api.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            var response = users.Select(u => new UserResponse
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            }).ToList();

            return Ok(response);
        }
        catch
        {
            return StatusCode(500, "An unexpected error occurred while retrieving users.");
        }
    }

    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        throw new NotImplementedException();
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] CreateUserRequest request)
    {
        throw new NotImplementedException();
    }

    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        throw new NotImplementedException();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        throw new NotImplementedException();
    }
}
