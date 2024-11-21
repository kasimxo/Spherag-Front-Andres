using System.Text;
using System.Text.Json;

namespace Spherag_frontend_andres.Services
{
    public interface IApiService {
        Task<Object> GetDataAsync(string parameter);
        Task<Object> POSTLoginToken();
    }
    public class ApiServices : IApiService
    {
        private readonly HttpClient _httpClient;
        public ApiServices(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public Task<object> GetDataAsync(string parameter)
        {
            throw new NotImplementedException();
        }

        public async Task<object> POSTLoginToken() {

            //No necesitamos parámetros porque la url siempre será
            //la misma y el contenido también.
            //Estos datos los guardaremos en algún archivo .conf

            string url = @"https://api.spherag.com/Authentication/Login";

            string body = @"{
                  ""username"": ""federico.front.test@spherag.com"",
                  ""password"": ""d1KKaI6*1LCTF(=]£y?u""
                }";

            var content = new StringContent(body, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            throw new Exception(await response.Content.ReadAsStringAsync());
            var data = new Object();
            return (Task<object>)data;
        }
    }
}

