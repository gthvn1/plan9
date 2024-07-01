const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.resolveTargetQuery(std.zig.CrossTarget.parse(
        .{ .arch_os_abi = "wasm32-freestanding" },
    ) catch unreachable);

    const optimize = b.standardOptimizeOption(.{});

    const math_wasm = b.addExecutable(.{
        .name = "math",
        .root_source_file = b.path("math.zig"),
        .target = target,
        .optimize = optimize,
    });

    math_wasm.entry = .disabled;
    math_wasm.rdynamic = true;
    b.installArtifact(math_wasm);

    const json_wasm = b.addExecutable(.{
        .name = "json",
        .root_source_file = b.path("json.zig"),
        .target = target,
        .optimize = optimize,
    });

    json_wasm.entry = .disabled;
    json_wasm.rdynamic = true;
    b.installArtifact(json_wasm);
}
