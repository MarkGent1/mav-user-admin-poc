namespace Mav.UserMgmt.Api.Services;

using Mav.UserMgmt.Api.Data;
using Mav.UserMgmt.Api.Models;
using Microsoft.EntityFrameworkCore;

public class UserService : IUserService
{
    private readonly UserDbContext _context;

    public UserService(UserDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }
}
