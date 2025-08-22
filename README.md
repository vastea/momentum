# Momentum

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Momentum is an open-source, local-first, desktop to-do application built with Rust & React. It is designed from the ground up for keyboard-centric users who are obsessed with speed, focus, and data privacy.

## Built With

![Rust](https://img.shields.io/badge/-Rust-000000?style=flat-square&logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/-Tauri-24C8E2?style=flat-square&logo=tauri&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

## Philosophy

Momentum aims to be an extension of your mind—a digital second brain that seamlessly integrates into your workflow. Our core design principles are:

* **Undisturbed Flow**: Every interaction is optimized for the keyboard. The minimalist UI and silent operation protect your focus.
* **Information Noise Reduction**: Contextual views, a powerful search, and a clear organizational structure help you find the signal in the noise.
* **Instantaneous Response**: Built with Rust, every action from startup to task creation is engineered to feel instant (<100ms).
* **A Private Harbor**: Your data is yours. Everything is stored locally on your machine by default. You have 100% ownership and control.

## Key Features

* **Lightning-Fast Capture**: Use a global shortcut (`Alt+Space`) to bring up the Quick Add Palette from anywhere in your OS.
* **Structured Organization**: Organize tasks with projects, sub-tasks, priorities, and due dates.
* **Powerful Attachments**: Attach web URLs or local file paths directly to your tasks.
* **Smart Reminders**: Set reminders and get native system notifications so you never miss a deadline.
* **Cross-Platform**: Packaged with Tauri for a consistent experience on macOS, Windows, and Linux.
* **Secure & Local-First**: Your data lives on your machine. No cloud, no accounts, no tracking.

## Getting Started

### Installation

Head over to the [**Releases**](https://github.com/vastea/momentum/releases) page to download the latest version for your operating system.

### Development

Interested in contributing? We'd love your help!

1.  **Prerequisites**:
    * [Rust](https://www.rust-lang.org/)
    * [Node.js](https://nodejs.org/) with `pnpm`
    * Follow the Tauri [prerequisites guide](https://tauri.app/v1/guides/getting-started/prerequisites) for your specific OS to install necessary dependencies.

2.  **Clone the repository**:
    ```bash
    git clone [https://github.com/vastea/momentum.git](https://github.com/vastea/momentum.git)
    cd momentum
    ```

3.  **Install dependencies**:
    ```bash
    pnpm install
    ```

4.  **Run in development mode**:
    ```bash
    pnpm tauri dev
    ```

## How to Contribute

We welcome contributions of all kinds! Whether it's reporting a bug, suggesting a feature, or writing code, your help is appreciated. Please check out our `CONTRIBUTING.md` guide (coming soon) for more details.

## License

This project is licensed under the MIT License. See the root `LICENSE` file for details.
