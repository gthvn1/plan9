const std = @import("std");

extern fn ilog(i32) void;

export fn sayHello(s: [*]u8, length: usize, capacity: usize) i32 {
    _ = length;

    const hello = "hello";
    const dest: []u8 = @ptrCast(s[0..capacity]);

    std.mem.copyForwards(u8, dest, hello);
    return hello.len;
}

export fn add(n1: i32, n2: i32) i32 {
    ilog(38);
    return n1 + n2;
}
