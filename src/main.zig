const std = @import("std");

const index =
    \\<!DOCTYPE html>
    \\<html lang="en">
    \\<head>
    \\    <meta charset="UTF-8">
    \\    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    \\    <title>Circle in a Box</title>
    \\    <style>
    \\        body {
    \\            background-color: #222; /* Fallback for older browsers */
    \\            background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    \\            height: 100vh; /* Ensure the gradient covers the whole viewport */
    \\            margin: 0; /* Remove default margin */
    \\            display: flex;
    \\            justify-content: center;
    \\            align-items: center;
    \\            color: #fff; /* Text color */
    \\            font-family: Arial, sans-serif; /* Font style */
    \\        }
    \\    </style>
    \\</head>
    \\<body>
    \\    <canvas id="myCanvas" width="400" height="300"></canvas>
    \\    <script>
    \\        // Function to draw a circle in a box on the canvas
    \\        function drawCircleInBox(canvasId) {
    \\            const canvas = document.getElementById(canvasId);
    \\            if (!canvas) {
    \\                console.error('Canvas element not found');
    \\                return;
    \\            }
    \\
    \\            const context = canvas.getContext('2d');
    \\            if (!context) {
    \\                console.error('2D context not found');
    \\                return;
    \\            }
    \\
    \\            // Set canvas size
    \\            const width = canvas.width;
    \\            const height = canvas.height;
    \\
    \\            // Draw the box
    \\            context.fillStyle = '#DDDDDD';
    \\            context.fillRect(0, 0, width, height);
    \\
    \\            // Draw the circle
    \\            const centerX = width / 2;
    \\            const centerY = height / 2;
    \\            const radius = Math.min(width, height) / 4;
    \\
    \\            context.beginPath();
    \\            context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    \\            context.fillStyle = '#FF0000';
    \\            context.fill();
    \\            context.stroke();
    \\        }
    \\
    \\        // Call the function when the window loads
    \\        window.onload = () => {
    \\            drawCircleInBox('myCanvas');
    \\        };
    \\    </script>
    \\</body>
    \\</html>
;

fn start_server() !void {
    const address = try std.net.Address.parseIp4("127.0.0.1", 8000);

    // Reuse address or wait 30s before reusing it. For dev we don't want
    // to wait 30s :)
    var stream = try std.net.Address.listen(address, .{ .reuse_address = true });
    defer stream.deinit();

    while (true) {
        // Wait for a connection
        const connection = try stream.accept();

        var read_buffer = [_]u8{0} ** 4096;
        var server = std.http.Server.init(connection, read_buffer[1..]);
        defer connection.stream.close();

        var request = try server.receiveHead();
        const headers = request.head;

        std.debug.print("{any}\n", .{headers});

        try request.respond(index, .{
            .extra_headers = &.{
                .{ .name = "content-type", .value = "text/html" },
            },
            .keep_alive = false,
        });
    }
}

pub fn main() !void {
    try start_server();
}
