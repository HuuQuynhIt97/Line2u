using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Evse.Data;
using Evse.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Evse.Hubs
{
    public  class LogInHub: Hub
    {
        public override Task OnConnectedAsync()
    {
        var name = Context.GetHttpContext().Request.Query["name"];
        return Clients.All.SendAsync("Send", $"{name} joined the chat");
    }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var name = Context.GetHttpContext().Request.Query["name"];
            return Clients.All.SendAsync("Send", $"{name} left the chat");
        }
        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has left the group {groupName}.");
        }
    }
}
