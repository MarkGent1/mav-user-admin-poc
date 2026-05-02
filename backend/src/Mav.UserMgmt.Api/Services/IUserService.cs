namespace Mav.UserMgmt.Api.Services;

using Mav.UserMgmt.Api.DTOs;
using Mav.UserMgmt.Api.Models;

public interface IUserService
{
    Task<List<User>> GetAllUsersAsync();
    Task<User?> GetUserAsync(int id);
    Task<User> CreateUserAsync(CreateUserRequest request);
    Task<User?> UpdateUserAsync(int id, UpdateUserRequest request);
    Task<bool> DeleteUserAsync(int id);
}
