 🚀 Multi-Language Code Translator & IDE

> A lightweight, browser-based development environment (IDE) designed to write, translate, and execute code seamlessly across multiple programming languages.

<img width="1890" height="872" alt="Captura de pantalla 2026-10-30 093241" src="https://github.com/user-attachments/assets/79e64e9b-fdfe-493f-8fee-f3578a9945e6" />

 🌟 Key Features
- **Dual-Pane Interface**: Side-by-side workspace to manage source and target code concurrently.
- **Multi-Language Engine**: Translate and test basic logic between **Python, JavaScript, C++, Java, and C#**.
- **Integrated Interactive Terminal**: Custom output simulation (`print`, `console.log`) with dynamic user input handling (`input()`).
- **Clean Aesthetic**: Modern, minimalist light-themed design for an intuitive, distraction-free user experience.

<img width="920" height="872" alt="Captura de pantalla 2026-10-30 093512" src="https://github.com/user-attachments/assets/626bcdfd-e033-49b2-942e-512d493b5f29" /><img width="1875" height="823" alt="Captura de pantalla 2026-10-30 093641" src="https://github.com/user-attachments/assets/a036f107-af53-4de2-ac9c-697adb1779fd" />


 💡 How the `input()` Feature Works
To prevent browser security restrictions (`prompt()` blocks) from interrupting execution, the custom interpreter handles inputs dynamically:
1. Detects Python `input(...)` statements during line-by-line parsing.
2. Triggers a secure prompt dialog with automated fallback mechanisms.
3. Stores the input value directly into a local context dictionary (`context`) for immediate variable evaluation, printing, and string interpolation.

<img width="1875" height="823" alt="Captura de pantalla 2026-10-30 093641" src="https://github.com/user-attachments/assets/9c1013a8-41e8-45a0-a566-dc9494b8d187" />

 🛠️ Current Limitations & Considerations
- **Line-by-Line Simulation Engine**: Built using custom regex patterns and light evaluation logic for educational snippets. Advanced object-oriented patterns or complex multi-line loops have limited native execution.
- **Browser Security Context**: Dialog triggers depend on local browser permissions and environment settings.
