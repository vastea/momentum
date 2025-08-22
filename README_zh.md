# Momentum

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Momentum 是一款基于 Rust 与 React 构建的、本地优先的开源桌面待办事项应用。它为追求速度、专注与数据私有的键盘玩家而生。

## Built With

![Rust](https://img.shields.io/badge/-Rust-000000?style=flat-square&logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/-Tauri-24C8E2?style=flat-square&logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

## 设计哲学

Momentum 旨在成为用户思想的延伸——一个能与之建立深度信任、毫不费力地融入其工作心流的数字第二大脑。我们的核心设计原则是：

* **无扰心流 (Undisturbed Flow)**: 每一个交互都为键盘深度优化。极简的界面与静默的运行机制，全力守护您的专注力。
* **信息降噪 (Information Noise Reduction)**: 通过情境化视图、强大的搜索和清晰的组织结构，帮您从信息的噪音中提炼出信号。
* **即时响应 (Instantaneous Response)**: 基于 Rust 构建，从启动到任务创建的每一个核心操作，都追求低于 100 毫秒的即时反馈。
* **私密港湾 (A Private Harbor)**: 您的数据只属于您。默认情况下，所有信息都存储在您的本地设备上，您拥有 100% 的所有权和控制权。

## 核心功能

* **闪电捕捉**: 使用全局快捷键 (`Alt+Space`) 从操作系统的任何地方唤出“快速添加”面板，瞬间记录灵感。
* **结构化组织**: 通过项目、子任务、优先级和截止日期，清晰地组织您的每一个任务。
* **强大的附件系统**: 为您的任务附上网络链接（URL）或本地文件路径。
* **智能提醒**: 设置提醒，并通过原生的系统通知，确保您不会错过任何一个最后期限。
* **跨平台支持**: 使用 Tauri 打包，在 macOS、Windows 和 Linux 上提供一致的原生体验。
* **安全与本地优先**: 您的数据只存在于您的电脑上。没有云端，没有账户，没有追踪。

## 开始使用

### 安装

请前往 [**Releases**](https://github.com/vastea/momentum/releases) 页面，下载适配您操作系统的最新版本。

### 参与开发

我们非常欢迎您参与贡献！

1.  **环境准备**:
    * 安装 [Rust](https://www.rust-lang.org/)
    * 安装 [Node.js](https://nodejs.org/) 和 `pnpm`
    * 根据 [Tauri 官方文档](https://tauri.app/v1/guides/getting-started/prerequisites) 为您的操作系统安装所需的环境依赖。

2.  **克隆仓库**:
    ```bash
    git clone [https://github.com/vastea/momentum.git](https://github.com/vastea/momentum.git)
    cd momentum
    ```

3.  **安装依赖**:
    ```bash
    pnpm install
    ```

4.  **以开发模式运行**:
    ```bash
    pnpm tauri dev
    ```

## 如何贡献

我们欢迎任何形式的贡献！无论是报告 Bug、提出功能建议还是贡献代码，我们都非常感谢。请查阅我们的 `CONTRIBUTING.md` 指南（即将推出）以获取更多信息。

## 许可协议

本项目采用 MIT 许可协议开源，详情请参阅根目录下的 `LICENSE` 文件。
