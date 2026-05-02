namespace Mav.UserMgmt.Api.Services;

using Mav.UserMgmt.Api.Models;

public interface IUserService
{
    Task<List<User>> GetAllUsersAsync();
}
