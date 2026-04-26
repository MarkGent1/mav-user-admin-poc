namespace Mav.UserMgmt.Api.Controllers;

using Mav.UserMgmt.Api.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    public IActionResult GetUsers()
    {
        throw new NotImplementedException();
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