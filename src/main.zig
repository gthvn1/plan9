const std = @import("std");

fn start_server() !void {
    const address = try std.net.Address.parseIp4("127.0.0.1", 8000);

    // Reuse address or wait 30s before reusing it. For dev we don't want
    // to wait 30s :)
    var stream = try std.net.Address.listen(address, .{ .reuse_address = true });
    defer stream.deinit();

    // Wait for a connection
    const connection = try stream.accept();

    var read_buffer = [_]u8{0} ** 4096;
    var server = std.http.Server.init(connection, read_buffer[1..]);

    const request = server.receiveHead();

    std.debug.print("{any}\n", .{request});
}

pub fn main() !void {
    try start_server();
}
