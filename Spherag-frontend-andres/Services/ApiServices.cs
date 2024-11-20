namespace Spherag_frontend_andres.Services
{
    public interface IApiService {
        Task<Object> GetDataAsync(string parameter);
    }
    public class ApiServices : IApiService
    {
        public Task<object> GetDataAsync(string parameter)
        {
            throw new NotImplementedException();
        }
    }
}
