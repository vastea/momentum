// src/shared/api/tauri.ts

import { invoke as tauriInvoke } from "@tauri-apps/api/core";

/**
 * A type-safe wrapper around the tauri `invoke` function.
 *
 * @param cmd The command to invoke.
 * @param args The arguments to pass to the command.
 * @returns A promise that resolves with the command's return value.
 */
export function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
    return tauriInvoke(cmd, args);
}