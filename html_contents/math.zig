const std = @import("std");

extern fn ilog(i32) void;

export fn draw(s: [*]u8, length: usize, capacity: usize) i32 {
    // For testing just fill the canvas using #4c566a
    for (0..length) |idx| {
        if (4 * idx + 3 >= capacity)
            return -1;
        s[4 * idx + 0] = 0x4C; // R.ed
        s[4 * idx + 1] = 0x56; // G.reen
        s[4 * idx + 2] = 0x6A; // B.lue
        s[4 * idx + 3] = 0xFF; // A.lpha
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
