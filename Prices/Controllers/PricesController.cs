using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Text;
using System.IO;
using System.Data.SQLite;
using System.Data;
using Newtonsoft;

namespace Prices.Controllers
{
    public class PricesController : ApiController
    {
        /*
         * Version1: Read the data from JSON file
         */
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


        /*
         * Version2: Read the data from SQLite database
         */
        [AllowAnonymous]
        [HttpGet]
        [Route("api/FetchCheesePrices_v2")]
        public IHttpActionResult GetPrices_v2()
        {
            DataTable dt = new DataTable();

            //Get Sqlite database path:
            string DBPath = System.Web.HttpContext.Current.Server.MapPath(@"~/App_Data/data.db");
            string connectionString = @"Data Source=" + DBPath + "; Version=3; FailIfMissing=True;";

            //Connect and read the data:
            using (SQLiteConnection conn = new SQLiteConnection(connectionString))
            {
                string sql = "SELECT * FROM prices";
                using (SQLiteCommand cmd = new SQLiteCommand(sql, conn))
                {
                    using (SQLiteDataAdapter da = new SQLiteDataAdapter(cmd))
                    {
                        da.Fill(dt);
                    }
                }
            }



            /*
             * Format the returned JSON data to be as what in data.json: 
             * */
            var dtAsEnumerable = dt.AsEnumerable();

            //select distinct the cheese names:
            List<object> names = dtAsEnumerable
                   .GroupBy(r => new { name = r["name"] })
                   .Select(g => g.Key.name).ToList();


            //select distinct the years:
            List<object> years = dt.AsEnumerable()
                 .GroupBy(r => new { year = r["year"] })
                 .Select(g => g.Key.year).ToList();


            //group the prices for each name:
            List<object> prices = new List<object>();
            List<object> prices_details;
            DataRow[] dr;
            for (int i = 0; i < names.Count; i++) {
                prices_details = new List<object>();
                for (int j = 0; j < years.Count; j++)
                {
                    dr = dt.Select("name='" + names[i] + "' and year = " + years[j]);
                    
                    //if there's no price in certain year then add 0:
                    prices_details.Add((dr.Length > 0) ? dr[0]["price"] : 0);
                }
                prices.Add(new { name = names[i], price_data = prices_details });
            }
            
            return Ok(new { cheese_data = new {names=names,years=years,prices=prices }});
        }
        
    }
}
