const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});

    const exe = b.addExecutable(.{
        .name = "http_server",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
    });

    b.installArtifact(exe);
}
