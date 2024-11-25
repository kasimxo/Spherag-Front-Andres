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
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ApiServices(HttpClient httpClient, IHttpContextAccessor httpContextAccessor)
        {
            _httpClient = httpClient;
            _httpContextAccessor = httpContextAccessor;
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

            var token = _httpContextAccessor.HttpContext.Request.Cookies["AuthToken"];

            if (token == null)
            {
                Debug.WriteLine("Token is null");
                await POSTLoginToken();
            } else {
                Debug.WriteLine("Token is fine");
                _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }
        }
        private async Task RefreshToken()
        {
            throw new NotImplementedException();
            
        }
        private async Task  POSTLoginToken() {
            string url = @"https://api.spherag.com/Authentication/Login";

            string body = @"{
                  ""username"": ""federico.front.test@spherag.com"",
                  ""password"": ""d1KKaI6*1LCTF(=]£y?u""
                }";

            var content = new StringContent(body, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();
            _token = await response.Content.ReadFromJsonAsync<AuthResponse>();

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.Parse(_token.AccessToken.Expiration)
            };

            _httpContextAccessor.HttpContext.Response.Cookies.Append("AuthToken", _token.AccessToken.Token, cookieOptions);

            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _token.AccessToken.Token);
            return;
        }
    }
}

