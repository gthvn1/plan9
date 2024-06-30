const std = @import("std");

extern fn ilog(i32) void;

const Color = struct {
    color: u32,
    idx: usize,
    colors: []const u32,
};

const list_of_colors = [_]u32{ 0xbf616aff, 0xd08770ff, 0xebcb8bff, 0xa3be8cff, 0xb48eadff };

var global_color = Color{
    .color = list_of_colors[0],
    .idx = 0,
    .colors = list_of_colors[1..],
};

fn updateColor(self: *Color) void {
    ilog(@intCast(self.idx));
    self.idx = @mod(self.idx + 1, self.colors.len);
    ilog(@intCast(self.idx));
    ilog(@intCast(self.colors.len));
    self.color = self.colors[self.idx];
}

export fn draw(s: [*]u8, length: usize, capacity: usize) i32 {
    // For testing just fill the canvas using #4c566a
    updateColor(&global_color);
    ilog(@intCast(global_color.color));
    for (0..length) |idx| {
        if (4 * idx + 3 >= capacity)
            return -1;
        s[4 * idx + 0] = @as(u8, @truncate(global_color.color >> 24)); // R.ed
        s[4 * idx + 1] = @as(u8, @truncate(global_color.color >> 16)); // G.reen
        s[4 * idx + 2] = @as(u8, @truncate(global_color.color >> 8)); // B.lue
        s[4 * idx + 3] = @as(u8, @truncate(global_color.color)); // A.lpha
    }

    return 0;
}

export fn speak(s: [*]u8, length: usize, capacity: usize) i32 {
    _ = length;
    _ = capacity;

    const sentence = "All your codebase are belong to us";
    const dest: []u8 = @ptrCast(s[0..sentence.len]);

    std.mem.copyForwards(u8, dest, sentence);

    ilog(sentence.len);

    return sentence.len;
}
