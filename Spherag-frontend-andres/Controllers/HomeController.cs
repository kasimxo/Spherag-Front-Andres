using Microsoft.AspNetCore.Mvc;
using Spherag_frontend_andres.Models;
using Spherag_frontend_andres.Services;
using System.Diagnostics;

namespace Spherag_frontend_andres.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IApiService _apiService;

        public HomeController(ILogger<HomeController> logger, IApiService apiService)
        {
            _logger = logger;
            _apiService = apiService;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> GetData(Int32 type, Int64 start, Int64 end)
        {

            var data = await _apiService.GETData(type, start, end);
            return new JsonResult(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetDataCaudal(Int64 start, Int64 end)
        {
            
            var data = await _apiService.GETCaudal( start,end);
            return new JsonResult(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetDataAcumulado(Int64 start, Int64 end) {
            
            var data = await _apiService.GETAcumulado(start, end);
            return new JsonResult(data);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
