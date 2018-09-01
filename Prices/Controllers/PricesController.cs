using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.IO;

namespace Prices.Controllers
{
    public class PricesController : ApiController
    {
        [AllowAnonymous]
        [HttpGet]
        [Route("api/FetchCheesePrices")]
        public HttpResponseMessage GetPrices()
        {
            var json = File.ReadAllText(System.Web.HttpContext.Current.Server.MapPath(@"~/App_Data/data.json"));

            return new HttpResponseMessage()
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json"),
                StatusCode = HttpStatusCode.OK
            };
        }

    }
}
