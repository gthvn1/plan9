const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.resolveTargetQuery(std.zig.CrossTarget.parse(
        .{ .arch_os_abi = "wasm32-freestanding" },
    ) catch unreachable);

    const exe = b.addExecutable(.{
        .name = "math",
        .root_source_file = b.path("math.zig"),
        .target = target,
        .optimize = b.standardOptimizeOption(.{}),
    });

    exe.entry = .disabled;
    exe.rdynamic = true;
    b.installArtifact(exe);
}
