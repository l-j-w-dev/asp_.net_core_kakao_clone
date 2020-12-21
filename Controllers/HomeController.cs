using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using 채팅.Hubs;
using 채팅.Models;

namespace 채팅.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewData["like"] = "unlike";
            if (ChatHub.like.ContainsKey(HttpContext.Connection.RemoteIpAddress.ToString()))
            {
                ChatHub.like.TryGetValue(HttpContext.Connection.RemoteIpAddress.ToString(), out string v);
                ViewData["like"] = v;
            }
            return View();
        }

        public void Like()
        {
            if (!ChatHub.like.ContainsKey(HttpContext.Connection.RemoteIpAddress.ToString()))
            {
                ChatHub.like.TryAdd(HttpContext.Connection.RemoteIpAddress.ToString(), "like");
            }
            else
            {
                ChatHub.like.TryRemove(HttpContext.Connection.RemoteIpAddress.ToString(), out string like);
                ChatHub.like.TryAdd(HttpContext.Connection.RemoteIpAddress.ToString(), like == "like" ? "unlike" : "like");
            }
        }
    }
}
