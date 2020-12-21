using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using 채팅.Models;

namespace 채팅.Hubs
{

    public class ChatHub : Hub
    {

        public static ConcurrentDictionary<string, ChatModel> users = new ConcurrentDictionary<string, ChatModel>();
        public static ConcurrentDictionary<string, string> like = new ConcurrentDictionary<string, string>(); 
        public override async Task OnConnectedAsync()
        {
            ChatModel user = new ChatModel();
            user.id = Context.ConnectionId;
            user.nickname = user.id.Substring(0, 5);
            user.color = "rgb(" + (new Random().Next(0, 255)) + ", " + (new Random().Next(0, 255)) + ", " + (new Random().Next(0, 255)) + ")";
            users.TryAdd(Context.ConnectionId, user);
            await Clients.Caller.SendAsync("Enter", user.nickname, user.color);
            await Clients.All.SendAsync("Counter", users.Count());
            await Clients.All.SendAsync("EnterAlert", user.nickname);
            await Clients.Caller.SendAsync("Like", likeCount());
            await base.OnConnectedAsync();
        }

        public async Task SendChat(string message)
        {
            if(message.Length < 1)
            {
                return;
            }
            users.TryGetValue(Context.ConnectionId, out var user);
            DateTime dat = DateTime.Now;
            string time = dat.ToString("tt h:mm");
            await Clients.All.SendAsync("RecvChat", user.nickname, message, user.color, time);
        }
        public async Task Like()
        {
            int i = likeCount();
            await Clients.All.SendAsync("Like", likeCount());
        }
        public int likeCount()
        {
            int likeCount = 0;
            foreach (var item in like)
            {
                if(item.Value == "like")
                {
                    likeCount++;
                }
            }
            return likeCount;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
           users.TryRemove(Context.ConnectionId, out var user);
           await Clients.Others.SendAsync("Counter", users.Count());
           await Clients.Others.SendAsync("ExitAlert", user.nickname);
        }
    }
}
