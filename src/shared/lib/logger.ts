import {
    attachConsole,
    info as logInfo,
    warn as logWarn,
    error as logError,
    debug as logDebug,
    trace as logTrace,
} from '@tauri-apps/plugin-log';

// 这个变量确保我们只初始化一次
let isLoggerInitialized = false;

/**
 * @description 初始化应用的前端日志系统。
 * 这个函数应该在应用启动时只调用一次。
 */
export async function initializeLogger() {
    if (isLoggerInitialized) {
        return;
    }

    try {
        // tauri-plugin-log 的一个核心功能：
        // attachConsole() 会自动将所有的 console.log, console.warn, console.error 等
        // 调用重定向到 Rust 后端。
        // 这意味着我们现有的所有 console.log 语句都会自动被记录到文件中，无需任何修改！
        await attachConsole();
        isLoggerInitialized = true;
        logInfo('前端日志系统已成功初始化并附加到控制台。');
    } catch (e) {
        console.error('初始化前端日志系统失败:', e);
    }
}

// 我们也可以导出一组封装好的函数，以便在需要时更明确地调用。
// 实际上，在调用 attachConsole 后，直接使用 console.log() 等函数的效果是一样的。
export const logger = {
    info: logInfo,
    warn: logWarn,
    error: logError,
    debug: logDebug,
    trace: logTrace,
};