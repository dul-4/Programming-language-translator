document.getElementById('sourceLang').addEventListener('change', translateCode);

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function clearEditor(type) {
    if (type === 'source') {
        document.getElementById('sourceCode').value = '';
        document.getElementById('sourceTerminal').textContent = '// Output will appear here...';
        document.getElementById('sourceTerminal').classList.remove('error');
    } else {
        document.getElementById('targetCode').value = '';
        document.getElementById('targetTerminal'.textContent = '// Output will appear here...');
        document.getElementById('targetTerminal').classList.remove('error');
    }
    translateCode();
}

function copyCode(type) {
    const code = document.getElementById(type === 'source' ? 'sourceCode' : 'targetCode').value;
    if (!code) return;
    navigator.clipboard.writeText(code);
    showToast('Copied to clipboard!');
}

function swapLanguages() {
    const srcLang = document.getElementById('sourceLang');
    const tgtLang = document.getElementById('targetLang');
    const srcCode = document.getElementById('sourceCode');
    const tgtCode = document.getElementById('targetCode');
    const temLang = srcLang.value;
    srcLang.value = tgtLang.value;
    tgtLang.value = tempLang; 
    const tempCode = srcCode.value;
    srcCode.value = tgtCode.value;
    tgtCode.value = tempCode;

    translateCode();
}

function translateCode() {
    const srcLang = document.getElementById('sourceLang').value;
    const tgtLang = document.getElementById('targetLang').value;
    const code = document.getElementById('sourceCode').value;
    const targetArea = document.getElementById('targetCode');

    if (!code.trim()) {
        targetArea.value = '';
        return;
    }

const ir = parseToIR(code, srcLang);
const translated = generateFromIR(ir, tgtLang);
targetArea.value = translated;
}

function parseToIR(code, lang) {
    let lines = code.split('\n');
    let statements = [];

    for (let line of lines) {
        let trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
        let printMatch = trimmed.match(/(?:print|std::cout|console\.log|System\.out\.println|COnsole\.WriteLine)\s*\((.*?)\)(?:;|(?=\s*$))/);
        if (printMatch) {
            statements.push({ type: 'print', value: printMatch[1].trim() });
            continue;
        }     

        let varMatch = trimmed.match(/^(?:let|var|int|float|double|String|std::String)?\s*([a-zA-Z_]\w*)\s*=\s*(.+?)(?:;)?$/);
        if (varMatch) {
            let val = varMatch[2].trim();
            if (val.endsWith(';')) val = val.slice(0, -1).trim();
            statements.push({ type: 'assign', name: varMatch[1], value: val });
            continue;
        }

        statements.push({ type: 'raw', value: trimmed });
    }
    return statements;
}

function generateFromIR(statements, lang) {
    let OutputLines = [];

    if (lang === 'cpp') {
        OutputLines.push('#include <iostream>');
        OutputLines.push('#include <string>');
        OutputLines.push('');
        OutputLines.push('int main() {');
        for (let stmt of statements) {
            if (stmt.type === 'print') {
                let val = stmt.value;
                if (val.startsWith('"') || val.startsWith("'")) {
                    val = '"' + val.slice(1, -1) + '"';
                }
                OutputLines.push(`    std::cout << ${val} << std::endl;`);
            } else if (stmt.type === 'assign') {
                let type = 'auto';
                let val = stmt.value;
                if (/^["'].*["']$/.test(val)) type = 'std::string';
                else if (/^\d+$/.test(val)) type = 'int';
                else if (/^\d+\.\d+$/.test(val)) type = 'double';
                OutputLines.push(`    ${type} ${stmt.name} = ${val};`);
            } else if (stmt.type === 'raw') {
                OutputLines.push(`    ${stmt.value};`);
            }
        }
        OutputLines.push('    return 0;');
        OutputLines.push('}');
    }
    else if (lang === 'python') {
        for (let stmt of statements) {
            if (stmt.type === 'print') {
                OutputLines.push(`print(${stmt.value})`);
            } else if (stmt.type === 'assign') {
                OutputLines.push(`${stmt.name} = ${stmt.value}`);
            } else if (stmt.type === 'raw') {
                OutputLines.push(`${stmt.value}`);
            }
        }
    }
    else if (lang === 'javascript') {
        for (let stmt of statements) {
            if (stmt.type === 'print') {
                OutputLines.push(`console.log(${stmt.value});`);
            } else if (stmt.type === 'assign') {
                OutputLines.push(`let ${stmt.name} = ${stmt.value};`);
            } else if (stmt.type == 'raw') {
                OutputLines.push(`${stmt.value};`);
            }
        }
    }
    else if (lang === 'java') {
        OutputLines.push('public class Main {');
        OutputLines.push(`   public static void main(String[] args) {`);
        for (let stmt of statements) {
            if (stmt.type === 'print') {
                OutputLines.push(`      System.out.println(${stmt.value});`);
            } else if (stmt.type === 'assign') {
                let type = 'var';
                let val = stmt.value;
                if (/^["'].*["']$/.test(val)) type = 'String';
                else if (/^\d+$/.test(val)) type = 'int';
                else if (/^\d+\.\d+$/.test(val)) type = 'double';
                OutputLines.push(`         ${type} ${stmt.name} = ${val};`);
            } else if (stmt.type === 'raw') {
                OutputLines.push(`        ${stmt.value};`);
            }
        }
        OutputLines.push('    }');
        OutputLines.push('}');
    }
    else if (lang === 'csharp') {
        OutputLines.push('using System;');
        OutputLines.push('');
        OutputLines.push('class Program {');
        OutputLines.push('    static void Main() {');
        for (let stmt of statements) {
            if (stmt.type === 'print') {
                OutputLines.push(`       Console.WriteLine(${stmt.value});`);
            } else if (stmt.type === 'assign') {
                OutputLines.push(`        var ${stmt.name} = ${stmt.value};`);
            } else if (stmt.type === 'raw') {
                OutputLines.push(`        ${stmt.value};`);
            }
        }
        OutputLines.push('    }');
        OutputLines.push('}');
    }

    return OutputLines.join('\n');
}

function runCode(type) {
    const lang = document.getElementById(type === 'source' ? 'sourceLang' : 'targetLang').value;
    const code = document.getElementById(type === 'source' ? "sourceCode" : 'targetCode').value;
    const term = document.getElementById(type === 'source' ? 'sourceTerminal' : 'targetTerminal');

    term.classList.remove('error');
    term.textContent = '';

    if (!code.trim()) {
        term.textContent = 'Error: No code to run.';
        term.classList.add('error');
        return;
    }

try {
    let logs = [];
    let simulatedPrint = (...args) => {
        logs.push(args.join(' '));
    };

    if (lang === 'python') {
        let lines = code.split('\n');
        let context = {};
        for (let line of lines) {
            let trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;

            let inputMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*input\s*\((.*?)\)$/);
            if (inputMatch) {
                let varName = inputMatch[1];
                let promptExpr = inputMatch[2];
                let promptText = evaluateExpression(promptExpr, context);
                let userInputValue = window.promt ? promt(promptText || "Enter a value:") : "My name";
                if  (userInputValue = null) userInputValue = "";

                context[varName] = userInputValue;
                simulatedPrint(promptText.replace(/["']/g, '') + " " + userInputValue);
                continue;
            }

            let pMatch = trimmed.match(/^print\s*\((.*?)\)$/);
            if (pMatch) {
                let expr = pMatch[1].trim();

                if (expr.startsWith('f"') || expr.startsWith("f'")) {
                    let quoteChar = expr[1];
                    let innerContent = expr.slice(2, -1);
                    let evaluatedString = innerContent.replace(/\{([^}]+)\}/g, (match, varName) => {
                        varName = varName.trim();
                        return context[varName] !== undefined ? context[varName] : match;
                    });
                    simulatedPrint(evaluatedString);
                } else {
                    let evaluated = evaluateExpression(expr, context);
                    simulatedPrint(evaluated);
                }
            } else {
                let vMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
                if (vMatch) {
                    context[vMatch[1]] = evaluateExpression(vMatch[2], context);
                }
            }
        }
    } else if (lang === 'javascript') {
        let logsJs = [];
        let customConsole = { log: (...args) => logsJs.push(args.join(' ')) };
        let runJs = new Function('console', code);
        runJs(customConsole);
        logs = logsJs;
    } else {
        let matches = Array.from(code.matchAll(/(?:std::cout|System\.out\.println|Console\.WriteLine)\s*(?:<<|\()\s*([^;]+)/g));
        for (let match of matches) {
            let content = match[1] || '';
            content = content.replace(/["']/g, '').replace(/<<\s*std::endl/g, '').replace(/\);\s*$/, '').trim();
            if (content) logs.push(content);
        }
        if (logs.length === 0) {
            let fallbackMatch = code.match(/"([^"]+)"/);
            if (fallbackMatch) {
                logs.push(fallbackMatch[1]);
            } else {
                logs.push(`[Simulated ${lang.toUpperCase()} execution successful.]`);
            }
        }
    }

    term.textContent = logs.length > 0 ? logs.join('\n') : `[Program executed with no output]`;
} catch (err) {
    term.textContent = `RunTime Error: ${err.message}`;
    term.classList.add('error');
}
}
function evaluateExpression(expr, context) {
    expr = expr.trim();
    if (/^["'].*["']$/.test(expr)) {
        return expr.slice(1, -1);
    }
    if (context[expr] !== undefined) {
        return context[expr];
    }
    return expr;
}
