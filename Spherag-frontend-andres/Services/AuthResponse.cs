namespace Spherag_frontend_andres.Services
{
    public class AuthResponse
    {
        public required TokenInfo AccessToken { get; set; }
        public required TokenInfo RefreshToken { get; set; }
    }

    public class TokenInfo { 
        public required string Token { get; set;  }
        public required string Expiration { get; set; }
        public bool EmailConfirmed {  get; set; }
    }
}
