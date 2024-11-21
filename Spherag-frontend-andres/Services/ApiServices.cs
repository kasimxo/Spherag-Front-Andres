using System.Text;
using System.Text.Json;

namespace Spherag_frontend_andres.Services
{
    public interface IApiService {

        Task<AuthResponse> POSTLoginToken();
        Task<ApiResponse> GETCaudal(string Token);
        Task<ApiResponse> GETAcumulado(string Token);
    }
    public class ApiServices : IApiService
    {
        private readonly HttpClient _httpClient;
        public ApiServices(HttpClient httpClient)
        {
            _httpClient = httpClient;
        } 


        public async Task<ApiResponse> GETCaudal(string Token) {
            string url = @"https://apicore.spherag.com/AtlasElement/Monitoring/92/1/0730805467000/1730805467000";
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", Token);
            var response = await _httpClient.GetAsync(url);
            var apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse>();
            return apiResponse;
        }

        public async Task<ApiResponse> GETAcumulado(string Token) {
            string url = @"https://apicore.spherag.com/AtlasElement/Monitoring/92/2/0730805467000/1730805467000";
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", Token);
            var response = await _httpClient.GetAsync(url);
            var apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse>();
            return apiResponse;
        }

        public async Task<AuthResponse> POSTLoginToken() {

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
            var authResponse = await response.Content.ReadFromJsonAsync<AuthResponse>();
            
            return authResponse;
        }
    }
}

