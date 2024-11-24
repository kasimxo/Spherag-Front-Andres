using System.Diagnostics;
using System.Text;
using System.Text.Json;

namespace Spherag_frontend_andres.Services
{
    public interface IApiService {

        Task<ApiResponse> GETCaudal(Int64 start, Int64 end);
        Task<ApiResponse> GETAcumulado(Int64 start, Int64 end);
    }
    public class ApiServices : IApiService
    {
        private readonly HttpClient _httpClient;
        private AuthResponse? _token;
        public ApiServices(HttpClient httpClient)
        {
            _httpClient = httpClient;
            
        } 


        public async Task<ApiResponse> GETCaudal(Int64 start, Int64 end) {
            await EnsureLogin();
            string url = $@"https://apicore.spherag.com/AtlasElement/Monitoring/92/1/{start}/{end}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse>();
            return apiResponse;
        }

        public async Task<ApiResponse> GETAcumulado(Int64 start, Int64 end) {
            await EnsureLogin();
            string url = $@"https://apicore.spherag.com/AtlasElement/Monitoring/92/2/{start}/{end}";
            Debug.WriteLine("GETAcumulado token: " );
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var apiResponse = await response.Content.ReadFromJsonAsync<ApiResponse>();
            return apiResponse;
        }

        private async Task EnsureLogin() {
            if (_token == null)
            {
                Debug.WriteLine("Token is null");
                await POSTLoginToken();
            }
            else if (IsExpired(_token.AccessToken.Expiration))
            {
                Debug.WriteLine("Token is expired");
                await RefreshToken();
            }
            else {
                Debug.WriteLine("Token is fine");
            }
        }
        private async Task RefreshToken()
        {
            if (IsExpired(_token!.RefreshToken.Expiration))
            {
                await POSTLoginToken();
            } else
            {
                //Lacking url for refreshing token
                await POSTLoginToken();
            }
            
        }
        private Boolean IsExpired(string date) {
            DateTime expirationDate = DateTime.Parse(date);
            if (DateTime.UtcNow > expirationDate) {
                return true;
            }
            return false;
        }
        private async Task  POSTLoginToken() {

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
            _token = await response.Content.ReadFromJsonAsync<AuthResponse>();
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _token.AccessToken.Token);
            return;
        }
    }
}

