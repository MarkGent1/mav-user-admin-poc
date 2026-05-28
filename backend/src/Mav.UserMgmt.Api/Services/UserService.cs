namespace Mav.UserMgmt.Api.Services;

using Mav.UserMgmt.Api.Data;
using Mav.UserMgmt.Api.DTOs;
using Mav.UserMgmt.Api.Models;
using Microsoft.EntityFrameworkCore;

public class UserService(UserDbContext context) : IUserService
{
    private readonly UserDbContext _context = context;

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _context.Users.Where(u => !u.Deleted).ToListAsync();
    }

    public async Task<User?> GetUserAsync(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.Deleted);
    }

    public async Task<User> CreateUserAsync(CreateUserRequest request)
    {
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Role = request.Role,
            Deleted = false
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User?> UpdateUserAsync(int id, UpdateUserRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.Deleted);
        if (user == null)
        {
            return null;
        }

        user.Name = request.Name;
        user.Email = request.Email;
        user.Role = request.Role;

        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.Deleted);
        if (user == null)
        {
            return false;
        }

        user.Deleted = true;
        await _context.SaveChangesAsync();

        return true;
    }
}
