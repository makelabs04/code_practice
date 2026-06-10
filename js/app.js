// frontend/js/app.js
// ── MakeLabs Main Application ─────────────────────────────────────────

const API_BASE = 'http://localhost:5000/api';

// ── State ──────────────────────────────────────────────────────────────
const state = {
  currentLang: 'python',
  isRunning: false,
  pendingStdin: '',        // FIX: properly reset on each run
  inputHistory: [],
  executionTime: null,
  charCount: 0,
  lineCount: 1,
  editorHistory: {},
  resizing: false,
  theme: 'dark',
  backendOnline: false,

  // File Manager state
  files: [],               // Array of { id, name, language, content }
  activeFileId: null,
  fmCollapsed: false,
};

// ── Language Definitions ───────────────────────────────────────────────
const LANGUAGES = {
  java: {
    id: 'java', name: 'Java', icon: '☕', color: '#f89820', ext: '.java', engine: 'judge0',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        for (int i = 1; i <= 15; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
  },
  python: {
    id: 'python', name: 'Python', icon: '🐍', color: '#3572A5', ext: '.py', engine: 'piston',
    libsSupported: true,
    defaultCode: `# Python - MakeLabs Online Compiler
print("Hello, World!")

squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)

def greet(name):
    return f"Welcome to MakeLabs, {name}!"

print(greet("Developer"))`,
  },
  cpp: {
    id: 'cpp', name: 'C++', icon: '⚡', color: '#00599C', ext: '.cpp', engine: 'judge0',
    defaultCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    vector<string> langs = {"C++", "Java", "Python"};
    for (const auto& lang : langs) {
        cout << "Language: " << lang << endl;
    }
    return 0;
}`,
  },
  c: {
    id: 'c', name: 'C', icon: '🔧', color: '#A8B9CC', ext: '.c', engine: 'judge0',
    defaultCode: `#include <stdio.h>
#include <string.h>

int main() {
    printf("Hello, World!\\n");
    int arr[] = {1, 2, 3, 4, 5};
    int sum = 0, n = sizeof(arr)/sizeof(arr[0]);
    for (int i = 0; i < n; i++) sum += arr[i];
    printf("Sum: %d\\n", sum);
    printf("Average: %.1f\\n", (float)sum / n);
    return 0;
}`,
  },
  csharp: {
    id: 'csharp', name: 'C#', icon: '💜', color: '#68217A', ext: '.cs', engine: 'judge0',
    defaultCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        var evens = numbers.Where(n => n % 2 == 0).ToList();
        Console.WriteLine($"Even numbers: {string.Join(", ", evens)}");
        Console.WriteLine($"Sum: {numbers.Sum()}");
    }
}`,
  },
  javascript: {
    id: 'javascript', name: 'JavaScript', icon: '🌐', color: '#F7DF1E', ext: '.js', engine: 'piston',
    libsSupported: true,
    defaultCode: `// JavaScript - MakeLabs Online Compiler
console.log("Hello, World!");

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log("Doubled:", doubled);
console.log("Sum:", sum);`,
  },
  php: {
    id: 'php', name: 'PHP', icon: '🐘', color: '#777BB4', ext: '.php', engine: 'judge0',
    defaultCode: `<?php
echo "Hello, World!\\n";
$fruits = ["Apple", "Banana", "Cherry"];
foreach ($fruits as $index => $fruit) {
    echo ($index + 1) . ". " . $fruit . "\\n";
}
function factorial($n) {
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}
echo "5! = " . factorial(5) . "\\n";
?>`,
  },
  typescript: {
    id: 'typescript', name: 'TypeScript', icon: '💙', color: '#3178C6', ext: '.ts', engine: 'piston',
    libsSupported: true,
    defaultCode: `const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};

console.log(greet("World"));

interface Person { name: string; age: number; }
const people: Person[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];
people.forEach(p => console.log(\`\${p.name} is \${p.age} years old\`));`,
  },
  ruby: {
    id: 'ruby', name: 'Ruby', icon: '💎', color: '#CC342D', ext: '.rb', engine: 'piston',
    defaultCode: `puts "Hello, World!"
[1, 2, 3, 4, 5].each do |n|
  puts "Square: #{n * n}"
end
def greet(name) = "Welcome to MakeLabs, #{name}!"
puts greet("Developer")`,
  },
  go: {
    id: 'go', name: 'Go', icon: '🐹', color: '#00ADD8', ext: '.go', engine: 'piston',
    defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    nums := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, n := range nums { sum += n }
    fmt.Println("Sum:", sum)
}`,
  },
  rust: {
    id: 'rust', name: 'Rust', icon: '🦀', color: '#CE412B', ext: '.rs', engine: 'piston',
    defaultCode: `fn main() {
    println!("Hello, World!");
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled);
}`,
  },
  kotlin: {
    id: 'kotlin', name: 'Kotlin', icon: '🎯', color: '#7F52FF', ext: '.kt', engine: 'piston',
    defaultCode: `fun main() {
    println("Hello, World!")
    val numbers = listOf(1, 2, 3, 4, 5)
    println("Sum: \${numbers.sum()}")
    println("Doubled: \${numbers.map { it * 2 }}")
}`,
  },
  bash: {
    id: 'bash', name: 'Bash', icon: '🖥️', color: '#4EAA25', ext: '.sh', engine: 'piston',
    defaultCode: `#!/bin/bash
echo "Hello, World!"
NAME="MakeLabs"
echo "Welcome to $NAME!"
for i in {1..5}; do echo "Count: $i"; done
SUM=$((10 + 20))
echo "Sum: $SUM"`,
  },
  html: {
    id: 'html', name: 'HTML', icon: '🌍', color: '#E34F26', ext: '.html', engine: 'preview',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f0f4f8; }
    .card { background: white; border-radius: 12px; padding: 32px 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
    h1 { color: #e34f26; margin-bottom: 8px; }
    p  { color: #555; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, MakeLabs! 👋</h1>
    <p>Edit this HTML and click <strong>Run</strong> to preview.</p>
  </div>
</body>
</html>`,
  },
  css: {
    id: 'css', name: 'CSS', icon: '🎨', color: '#264DE4', ext: '.css', engine: 'preview',
    defaultCode: `/* CSS Preview — MakeLabs */
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  min-height: 100vh;
  display: flex; justify-content: center; align-items: center; margin: 0;
}
.box {
  background: white; border-radius: 16px; padding: 40px 48px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2); text-align: center;
}
.box h1 { color: #264de4; font-size: 2rem; margin-bottom: 12px; }
.box p  { color: #666; font-size: 1rem; }`,
  },
};

// ── SVG Icon Map (replaces emoji in lang tabs & sidebar) ───────────────
const LANG_SVG = {
  java:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M8.5 18s-1.5.9 1 1.2c2.9.4 4.5.3 7.7-.3 0 0 .9.5 2 1C13 22 4.3 20.4 8.5 18z"/><path d="M7.5 15.5s-1.7 1.3.9 1.5c3.3.3 5.9.3 10.4-.4 0 0 .6.6 1.6.9C11.3 19.4 2.5 17.6 7.5 15.5z"/><path d="M13.8 10.3c1.9 2.2-.5 4.1-.5 4.1s4.7-2.4 2.6-5.4c-2-2.8-3.5-4.2 4.7-9 0 0-12.8 3.2-6.8 10.3z"/><path d="M19 20.5s1.1.9-1.2 1.6c-4.3 1.3-17.9.8-21.7 0-1.4-.3 1.2-1.3 2-1.5.8-.2 1.3-.1 1.3-.1-1.5-1-9.8 2.1-4.2 3 15.2 2.4 27.7-1.1 23.8-3z"/><path d="M9 12.8s-6.9 1.6-2.4 2.2c1.8.3 5.5.2 8.9-.1 2.8-.3 5.6-.9 5.6-.9s-1 .4-1.7.9C13.4 16.2 5 15.7 2.8 15c-3.5-1.1 3.5-2.2 6.2-2.2z"/></svg>`,
  python:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M12 2C8.1 2 8.5 3.7 8.5 3.7V7h7v1H5.8S2 7.6 2 12s3.3 4 3.3 4h2V13.5s-.1-3.5 3.5-3.5h6.1s3.4.1 3.4-3.3V5.3S20.8 2 12 2z"/><circle cx="10" cy="5" r=".8"/><path d="M12 22c3.9 0 3.5-1.7 3.5-1.7V17H8.5v-1h9.7S22 16.4 22 12s-3.3-4-3.3-4h-2v2.5s.1 3.5-3.5 3.5H7.1S3.7 14 3.7 17.3V18.7S3.2 22 12 22z"/><circle cx="14" cy="19" r=".8"/></svg>`,
  cpp:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/><path d="M8 12h2M11 10v4M15 10v4M18 10v4M14 12h5"/></svg>`,
  c:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/><path d="M15 9.5A4.5 4.5 0 1 0 15 14.5"/></svg>`,
  csharp:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/><path d="M9 9.5A3 3 0 1 0 9 14.5"/><path d="M15 11h4M17 9v4"/></svg>`,
  javascript: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M12 17c0 2-1 3-2.5 3S7 18.5 7 17"/><path d="M17 10v6c0 1.5-.7 2-1.5 2s-1.5-.5-1.5-2v-6"/></svg>`,
  php:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M8 9.5h3c1.5 0 2 1 2 2s-.5 2-2 2H9M9 9.5v5M15 9.5h3c1 0 1.5.5 1.5 1.5S19 12.5 18 12.5h-3M15 9.5v5"/></svg>`,
  typescript: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M9 10H4M6.5 10v7M14 10v7M14 13h4c.8 0 1.5.7 1.5 1.5S18.8 16 18 16h-4"/></svg>`,
  ruby:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M4 15L2 9l6-5h8l6 5-2 6-6 5H10L4 15z"/><path d="M10 19l-4-4 1-9M14 19l4-4-1-9M8 4l2 6h4l2-6"/></svg>`,
  go:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M2 12h10M12 12c0-3 2-5 5-5s5 2 5 5-2 5-5 5h-3"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg>`,
  rust:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><circle cx="12" cy="12" r="9"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/><path d="M8 8l2 4-2 4h8l-2-4 2-4H8z"/></svg>`,
  kotlin:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M3 3h18L12 12l9 9H3V3z"/></svg>`,
  bash:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><rect x="2" y="3" width="20" height="18" rx="3"/><path d="M7 9l4 3-4 3M13 15h4"/></svg>`,
  html:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M4 3l1.6 18L12 23l6.4-2L20 3H4z"/><path d="M8 8h8l-.5 6L12 15.5 8.5 14 8.2 11h3.2l.1 1.5 1 .3 1-.3.2-2H8"/></svg>`,
  css:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M4 3l1.6 18L12 23l6.4-2L20 3H4z"/><path d="M8 8h8l-.3 4H8.5l.2 2.5 3.3 1 3.2-1 .2-2h3l-.5 5L12 19l-3.9-1.2L7.7 14"/></svg>`,
};

// SVG icons for sidebar
const SIDEBAR_SVG = {
  files:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M3 7h6l2 2h10v12H3V7z"/><path d="M3 4h10l2 2H3V4z" opacity=".5"/></svg>`,
  examples: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  help:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  moon:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  sun:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
};

// ── Extension → Language detection (VS Code style) ─────────────────────
const EXT_TO_LANG = {
  '.py': 'python', '.pyw': 'python',
  '.js': 'javascript', '.mjs': 'javascript',
  '.ts': 'typescript',
  '.java': 'java',
  '.cpp': 'cpp', '.cc': 'cpp', '.cxx': 'cpp',
  '.c': 'c',
  '.cs': 'csharp',
  '.php': 'php',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.kt': 'kotlin', '.kts': 'kotlin',
  '.sh': 'bash', '.bash': 'bash',
  '.html': 'html', '.htm': 'html',
  '.css': 'css',
};

function detectLangFromFilename(filename) {
  if (!filename) return null;
  const lower = filename.toLowerCase();
  const dotIdx = lower.lastIndexOf('.');
  if (dotIdx === -1) return null;
  return EXT_TO_LANG[lower.slice(dotIdx)] || null;
}

// ── CodeMirror Mode Map ─────────────────────────────────────────────────
const CM_MODE_MAP = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'text/typescript',
  java: 'text/x-java',
  cpp: 'text/x-c++src',
  c: 'text/x-csrc',
  csharp: 'text/x-csharp',
  php: 'application/x-httpd-php',
  ruby: 'text/x-ruby',
  go: 'text/x-go',
  rust: 'text/x-rustsrc',
  kotlin: 'text/x-kotlin',
  bash: 'text/x-sh',
  html: 'htmlmixed',
  css: 'css',
};

// ── Example Snippets ──────────────────────────────────────────────────
const EXAMPLES = [
  { title: 'FizzBuzz', lang: 'python', code: 'for i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)' },
  { title: 'Palindrome Checker', lang: 'javascript', code: 'function isPalindrome(str) {\n  const clean = str.replace(/[^A-Za-z0-9]/g, "").toLowerCase();\n  return clean === clean.split("").reverse().join("");\n}\nconsole.log(isPalindrome("A man, a plan, a canal: Panama"));\nconsole.log(isPalindrome("MakeLabs"));' },
  { title: 'Fibonacci', lang: 'java', code: 'public class Main {\n  public static void main(String[] args) {\n    int n = 10, first = 0, second = 1;\n    System.out.println("Fibonacci till " + n + " terms:");\n    for (int i = 1; i <= n; ++i) {\n      System.out.print(first + ", ");\n      int next = first + second; first = second; second = next;\n    }\n  }\n}' },
  { title: 'Selection Sort', lang: 'cpp', code: '#include <iostream>\nusing namespace std;\nvoid selectionSort(int arr[], int n) {\n  for (int i=0; i<n-1; i++) {\n    int min=i;\n    for (int j=i+1; j<n; j++) if (arr[j]<arr[min]) min=j;\n    swap(arr[min], arr[i]);\n  }\n}\nint main() {\n  int arr[] = {64,25,12,22,11};\n  int n = sizeof(arr)/sizeof(arr[0]);\n  selectionSort(arr, n);\n  for (int i=0; i<n; i++) cout << arr[i] << " ";\n  return 0;\n}' },
  { title: 'LINQ Query', lang: 'csharp', code: 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\nclass Program {\n  static void Main() {\n    var scores = new List<int> { 97, 92, 81, 60, 100, 75, 84 };\n    var high = scores.Where(s => s > 80).OrderByDescending(s => s);\n    foreach (var s in high) Console.WriteLine(s);\n  }\n}' },
  { title: 'Hello Go', lang: 'go', code: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello from Go!")\n  for i := 1; i <= 5; i++ { fmt.Printf("Count: %d\\n", i) }\n}' },
  { title: 'Hello Rust', lang: 'rust', code: 'fn main() {\n    let v: Vec<i32> = (1..=5).collect();\n    let sum: i32 = v.iter().sum();\n    println!("Numbers: {:?}", v);\n    println!("Sum: {}", sum);\n}' },
];

// ── Settings ────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = { fontSize: 15, tabSize: 4, lineWrap: true };

function openSettingsModal() {
  const settings = JSON.parse(localStorage.getItem('cc-settings')) || DEFAULT_SETTINGS;
  $('setting-font-size').value = settings.fontSize;
  $('setting-tab-size').value = settings.tabSize;
  $('setting-line-wrap').checked = settings.lineWrap;
  openModal('settings-modal');
}

function applySettings(settings) {
  if (!cmEditor) return;
  cmEditor.setOption('tabSize', parseInt(settings.tabSize));
  cmEditor.setOption('indentUnit', parseInt(settings.tabSize));
  cmEditor.setOption('lineWrapping', settings.lineWrap);
  const cmWrapper = document.querySelector('.CodeMirror');
  if (cmWrapper) cmWrapper.style.setProperty('font-size', `${settings.fontSize}px`, 'important');
  cmEditor.refresh();
}

function loadSettings() {
  applySettings(JSON.parse(localStorage.getItem('cc-settings')) || DEFAULT_SETTINGS);
}

document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = $('btn-save-settings');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const s = {
        fontSize: parseInt($('setting-font-size').value) || 15,
        tabSize: parseInt($('setting-tab-size').value) || 4,
        lineWrap: $('setting-line-wrap').checked,
      };
      localStorage.setItem('cc-settings', JSON.stringify(s));
      applySettings(s);
      closeModal('settings-modal');
      showToast('Settings saved!', 'success');
    });
  }
});

// ── DOM Refs ──────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ── Init ──────────────────────────────────────────────────────────────
let cmEditor;
document.addEventListener('DOMContentLoaded', () => {

  cmEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'python',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
    extraKeys: {
      'Ctrl-/': 'toggleComment',
      'Cmd-/': 'toggleComment',
      'Ctrl-Enter': () => triggerRun(),
      'Cmd-Enter': () => triggerRun(),
    },
  });

  buildLangTabs();
  buildSidebarBtns();
  setLanguage('python');
  bindEditorEvents();
  bindResizeHandle();
  bindFmResizeHandle();
  bindTopbarActions();
  updateStatusBar();
  showWelcomeOutput();
  injectDynamicStyles();
  initFileManager();

  const savedTheme = localStorage.getItem('cc-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (cmEditor) cmEditor.setOption('theme', 'eclipse');
  }

  loadSettings();
  checkBackend();
  setInterval(checkBackend, 30000);
});

// ── Dynamic Styles injection ───────────────────────────────────────────
function injectDynamicStyles() {
  if (document.getElementById('_ml_dynamic_styles')) return;
  const style = document.createElement('style');
  style.id = '_ml_dynamic_styles';
  style.textContent = `
    .lang-tabs { display:flex!important; flex-direction:row!important; flex-wrap:nowrap!important; overflow-x:auto!important; overflow-y:hidden!important; gap:4px!important; scrollbar-width:thin!important; align-items:center!important; padding:0 4px!important; max-width:100%!important; }
    .lang-tabs::-webkit-scrollbar { height:3px!important; }
    .lang-tabs::-webkit-scrollbar-thumb { background:var(--border)!important; border-radius:2px!important; }
    .lang-tab { display:inline-flex!important; align-items:center!important; gap:5px!important; padding:5px 12px!important; white-space:nowrap!important; flex-shrink:0!important; cursor:pointer!important; border-radius:6px!important; font-size:12px!important; font-weight:500!important; border:1px solid transparent!important; background:transparent!important; color:var(--text-muted,#8b949e)!important; transition:all 0.15s ease!important; }
    .lang-tab:hover { background:rgba(255,255,255,0.06)!important; color:var(--text-primary,#e6edf3)!important; }
    .lang-tab.active { background:rgba(88,166,255,0.12)!important; border-color:rgba(88,166,255,0.35)!important; color:#58a6ff!important; }
    .squiggle-item { display:flex; align-items:flex-start; gap:10px; padding:7px 10px; margin-bottom:5px; border-radius:6px; background:rgba(248,81,73,0.08); border-left:3px solid #f85149; font-family:'JetBrains Mono',monospace; font-size:11px; line-height:1.6; color:#f85149; cursor:pointer; transition:background 0.15s; }
    .squiggle-item:hover { background:rgba(248,81,73,0.16); }
    .squiggle-item .sq-line { font-weight:700; min-width:50px; color:#ff7b72; }
    .squiggle-item .sq-msg { color:#e6edf3; font-family:'Poppins',sans-serif; font-size:11px; }
    .squiggle-item .sq-code { display:block; margin-top:3px; color:#8b949e; font-family:'JetBrains Mono',monospace; font-size:10px; }
    .error-badge { display:inline-flex; align-items:center; gap:4px; background:rgba(248,81,73,0.15); color:#f85149; border:1px solid rgba(248,81,73,0.3); border-radius:10px; padding:1px 8px; font-size:10px; font-weight:600; margin-left:8px; font-family:'Poppins',sans-serif; }
    .terminal-inline-input { background:transparent; border:none; border-bottom:1px solid var(--accent-green,#3dc96c); color:var(--accent-green,#3dc96c); outline:none; font-family:'JetBrains Mono',monospace; font-size:13px; min-width:120px; padding:0 2px; }
    #main { display:flex; flex:1; overflow:hidden; height:100%; }
    #ide-body { display:flex; flex:1; overflow:hidden; }
  `;
  document.head.appendChild(style);
}

// ── Backend Health Check ──────────────────────────────────────────────
async function checkBackend() {
  const pill = $('backend-status');
  if (!pill) return;
  const label = pill.querySelector('span:last-child');
  try {
    const r = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
    const d = await r.json();
    if (d.success) {
      pill.classList.remove('offline'); pill.classList.add('online');
      label.textContent = 'Backend Online';
      state.backendOnline = true;
    } else throw new Error();
  } catch {
    pill.classList.remove('online'); pill.classList.add('offline');
    label.textContent = 'Backend Offline';
    state.backendOnline = false;
  }
}

// ── Language Tabs ─────────────────────────────────────────────────────
function buildLangTabs() {
  const container = $('lang-tabs');
  container.innerHTML = '';
  Object.values(LANGUAGES).forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'lang-tab';
    btn.dataset.lang = lang.id;
    const svgIcon = LANG_SVG[lang.id] || `<span style="font-size:13px">${lang.icon}</span>`;
    let inner = `<span class="lang-icon">${svgIcon}</span><span class="lang-label">${lang.name}</span>`;
    if (lang.libsSupported) inner += `<span class="lib-badge">libs</span>`;
    btn.innerHTML = inner;
    btn.addEventListener('click', () => setLanguage(lang.id));
    container.appendChild(btn);
  });
  initLangScrollButtons();
}

function initLangScrollButtons() {
  const tabs = $('lang-tabs');
  const btnLeft = $('lang-scroll-left');
  const btnRight = $('lang-scroll-right');
  if (!tabs || !btnLeft || !btnRight) return;

  const SCROLL_AMOUNT = 160;

  function updateArrows() {
    btnLeft.disabled = tabs.scrollLeft <= 2;
    btnRight.disabled = tabs.scrollLeft + tabs.clientWidth >= tabs.scrollWidth - 2;
  }

  btnLeft.addEventListener('click', () => {
    tabs.scrollLeft -= SCROLL_AMOUNT;
    setTimeout(updateArrows, 250);
  });
  btnRight.addEventListener('click', () => {
    tabs.scrollLeft += SCROLL_AMOUNT;
    setTimeout(updateArrows, 250);
  });

  tabs.addEventListener('scroll', updateArrows, { passive: true });

  // Update on resize
  new ResizeObserver(updateArrows).observe(tabs);
  updateArrows();
}

function setLanguage(langId, fromFilePicker = false) {
  const lang = LANGUAGES[langId];
  if (!lang) return;

  // If switching via lang tab (not from openFile), save & close any open file
  if (!fromFilePicker) {
    if (state.activeFileId && cmEditor) {
      const currentFile = state.files.find(f => f.id === state.activeFileId);
      if (currentFile) {
        currentFile.content = cmEditor.getValue();
        saveFilesToStorage();
      }
    }
    state.activeFileId = null; // Now in scratch/tab mode
    // Save current scratch content
    if (state.currentLang && state.currentLang !== langId && cmEditor) {
      state.editorHistory[state.currentLang] = cmEditor.getValue();
    }
    state.currentLang = langId;
    const savedCode = state.editorHistory[langId];
    const newCode = savedCode !== undefined ? savedCode : lang.defaultCode;
    if (cmEditor) {
      cmEditor.setValue(newCode);
      cmEditor.setOption('mode', CM_MODE_MAP[langId] || 'text/plain');
    }
  } else {
    // Called from openFile — just set mode/lang, don't touch editor value
    state.currentLang = langId;
    if (cmEditor) {
      cmEditor.setOption('mode', CM_MODE_MAP[langId] || 'text/plain');
    }
  }

  $$('.lang-tab').forEach(t => t.classList.toggle('active', t.dataset.lang === langId));
  // Breadcrumb: show open file name in file mode, or main.ext in scratch mode
  const activeFile = state.files.find(f => f.id === state.activeFileId);
  $('editor-filename').textContent = activeFile ? activeFile.name : `main${lang.ext}`;
  $('editor-lang-badge').textContent = lang.name;
  $('status-lang').textContent = lang.name;
  clearErrorHighlights();
  updateEditorMeta();
  clearOutput();
}

// ── Editor Events ─────────────────────────────────────────────────────
function bindEditorEvents() {
  cmEditor.on('change', () => {
    updateEditorMeta();
    const val = cmEditor.getValue();
    // If a file is open, always save to that file's content in state.files
    if (state.activeFileId) {
      const activeFile = state.files.find(f => f.id === state.activeFileId);
      if (activeFile) {
        activeFile.content = val;
        // Debounced persist to localStorage
        clearTimeout(state._saveTimer);
        state._saveTimer = setTimeout(() => saveFilesToStorage(), 500);
      }
    } else {
      // No file open — use language-keyed history (tab-switching mode)
      state.editorHistory[state.currentLang] = val;
    }
    scheduleLint();
  });
  cmEditor.on('cursorActivity', updateEditorMeta);
}

function updateEditorMeta() {
  if (!cmEditor) return;
  const val = cmEditor.getValue();
  const cursor = cmEditor.getCursor();
  $('editor-lines').textContent = `${cmEditor.lineCount()} lines`;
  $('editor-cursor').textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
  $('status-chars').textContent = `${val.length} chars`;
}

// ── Run Code ──────────────────────────────────────────────────────────
function triggerRun() {
  const code = cmEditor ? cmEditor.getValue().trim() : '';
  if (!code) { showToast('Editor is empty. Write some code first!', 'warning'); return; }
  setOutputTab('output');
  if (state.currentLang === 'html' || state.currentLang === 'css') {
    runCode();
  } else {
    // Reset stdin state for a fresh run
    state.pendingStdin = '';       // FIX Bug 6: always reset stdin on new run
    state.inputHistory = [];
    runCode();
  }
}

async function runCode() {
  if (state.isRunning) return;

  const code = cmEditor.getValue().trim();
  if (!code) { showToast('Editor is empty. Write some code first!', 'warning'); return; }

  state.isRunning = true;
  clearLintTimeout();
  const startTime = Date.now();

  const runBtn = $('run-btn');
  runBtn.classList.add('loading');
  runBtn.innerHTML = '<div class="spinner"></div> Running...';
  setOutputTab('output');
  showExecStatus('running', 'Executing your code...');

  const terminal = $('output-terminal');
  terminal.innerHTML = `
    <div class="output-line system">▶ Running ${LANGUAGES[state.currentLang].name} code...</div>
    <div class="output-line system pulse">● Waiting for output</div>
  `;

  // HTML/CSS: preview in browser, no backend
  if (state.currentLang === 'html' || state.currentLang === 'css') {
    const elapsed = Date.now() - startTime;
    state.executionTime = elapsed;
    renderOutput('', '', elapsed, 0);
    state.isRunning = false;
    runBtn.classList.remove('loading');
    runBtn.innerHTML = '<span class="run-icon">▶</span> Run';
    return;
  }

  const stdin = state.pendingStdin || '';

  try {
    const response = await fetch(`${API_BASE}/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: state.currentLang, source_code: code, stdin }),
    });
    const data = await response.json();
    const elapsed = Date.now() - startTime;
    state.executionTime = elapsed;
    if (data.success) {
      renderOutput(data.output, data.error, elapsed, data.exit_code, data.engine);
    } else {
      renderError(data.message || 'Execution failed', elapsed);
    }
  } catch (err) {
    const elapsed = Date.now() - startTime;
    renderApiError(elapsed);
  } finally {
    state.isRunning = false;
    runBtn.classList.remove('loading');
    runBtn.innerHTML = '<span class="run-icon">▶</span> Run';
  }
}

// ── Stdin Bar ─────────────────────────────────────────────────────────
function showStdinBar() {
  const terminal = $('output-terminal');
  const lines = terminal.querySelectorAll('.output-line:not(.system)');
  const lastLine = lines[lines.length - 1];
  const promptText = lastLine ? lastLine.textContent : '';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'terminal-inline-input';
  input.autocomplete = 'off';
  input.spellcheck = false;

  if (lastLine) {
    lastLine.style.display = 'flex';
    lastLine.style.alignItems = 'center';
    lastLine.appendChild(input);
  } else {
    const div = document.createElement('div');
    div.className = 'output-line';
    div.style.display = 'flex';
    div.appendChild(input);
    terminal.appendChild(div);
  }

  setTimeout(() => input.focus(), 50);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value;
      const span = document.createElement('span');
      span.style.color = 'var(--accent-green)';
      span.style.marginLeft = '6px';
      span.textContent = val;
      input.replaceWith(span);
      state.inputHistory = state.inputHistory || [];
      state.inputHistory.push({ prompt: promptText, value: val });
      state.pendingStdin = (state.pendingStdin || '') + val + '\n';
      runCode();
    }
  });
}

// FIX Bug 1: Only ONE hideStdinBar definition — with both behaviors
function hideStdinBar() {
  const wrap = $('inline-input-prompt');
  if (wrap) wrap.style.display = 'none';
  // Disable any inline input fields that are still in the terminal
  $$('.terminal-inline-input').forEach(el => el.disabled = true);
}

// ── Render Output ─────────────────────────────────────────────────────
// ── Project Link Resolver ─────────────────────────────────────────────
// Replaces <link href="file.css"> and <script src="file.js"> with inline
// content from state.files, so the iframe preview works without a server.
function resolveProjectLinks(html) {
  // Helper: find a file in state.files by basename (case-insensitive)
  function findFile(href) {
    if (!href) return null;
    // Strip any leading ./ or path components — match by filename only
    const name = href.replace(/^.*[\/]/, '').toLowerCase();
    return state.files.find(f => f.name.toLowerCase() === name) || null;
  }

  // 1. Inline <link rel="stylesheet" href="..."> → <style>...</style>
  html = html.replace(
    /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*\/?>/gi,
    (match, href) => {
      const file = findFile(href);
      if (file) return `<style>/* inlined: ${escapeHtml(file.name)} */
${file.content}
</style>`;
      return match; // leave untouched if not found in project
    }
  );

  // Also catch reversed attribute order: href before rel
  html = html.replace(
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["'][^>]*\/?>/gi,
    (match, href) => {
      const file = findFile(href);
      if (file) return `<style>/* inlined: ${escapeHtml(file.name)} */
${file.content}
</style>`;
      return match;
    }
  );

  // 2. Inline <script src="..."> → <script>...</script>
  html = html.replace(
    /<script([^>]+)src=["']([^"']+)["']([^>]*)><\/script>/gi,
    (match, pre, src, post) => {
      const file = findFile(src);
      if (file) return `<script${pre}${post}>/* inlined: ${escapeHtml(file.name)} */
${file.content}
</script>`;
      return match;
    }
  );

  return html;
}

function renderOutput(stdout, stderr, elapsed, exitCode, engine) {
  hideStdinBar();
  const terminal = $('output-terminal');
  terminal.innerHTML = '';

  // HTML/CSS Preview
  if (state.currentLang === 'html' || state.currentLang === 'css') {
    const code = cmEditor.getValue();
    let previewSrc;

    if (state.currentLang === 'css') {
      // Pure CSS preview — wrap in a demo page
      previewSrc = `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="box"><h1>CSS Preview</h1><p>Your styles are applied here.</p></div></body></html>`;
    } else {
      // HTML preview — resolve any linked project files inline
      previewSrc = resolveProjectLinks(code);
    }

    const frame = document.createElement('iframe');
    frame.style.cssText = 'width:100%;height:100%;border:none;background:#fff;border-radius:4px;display:block;';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    frame.srcdoc = previewSrc;
    terminal.style.padding = '0';
    terminal.style.overflow = 'hidden';
    terminal.style.display = 'flex';
    terminal.style.flexDirection = 'column';
    terminal.appendChild(frame);
    showExecStatus('success', `Preview rendered in ${elapsed}ms`);
    updateStatusBar('success', `✓ Preview ready in ${elapsed}ms`);
    $('tab-badge-output').classList.remove('visible');
    clearErrorHighlights();
    updateInfoPanel(elapsed, 0, 'HTML/CSS Preview rendered', '', engine);
    return;
  }

  terminal.style.padding = '';
  terminal.style.overflow = '';
  terminal.style.display = '';
  terminal.style.flexDirection = '';

  const header = document.createElement('div');
  header.className = 'output-line system';
  header.textContent = `▶ ${LANGUAGES[state.currentLang].name} | Exit: ${exitCode} | ${elapsed}ms`;
  terminal.appendChild(header);

  const divider = document.createElement('div');
  divider.className = 'output-line system';
  divider.textContent = '─'.repeat(40);
  terminal.appendChild(divider);

  // Reconstruct stdout with user-typed input inline
  let displayStdout = stdout || '';
  if (state.inputHistory && state.inputHistory.length > 0) {
    state.inputHistory.forEach(item => {
      if (item.prompt) {
        displayStdout = displayStdout.replace(item.prompt, item.prompt + item.value + '\n');
      }
    });
  }

  // Detect if program is waiting for input (EOF / missing input crash)
  const isEofError = stderr && (
    stderr.includes('NoSuchElementException') ||
    stderr.includes('EOFError') ||
    (state.currentLang === 'csharp' && stderr.includes('NullReferenceException'))
  );
  const looksLikePrompt = isEofError ||
    (displayStdout && !displayStdout.endsWith('\n') && !stderr && exitCode === 0);

  if (looksLikePrompt) {
    if (displayStdout) {
      displayStdout.split('\n').forEach(line => {
        const el = document.createElement('div');
        el.className = 'output-line';
        el.textContent = line;
        terminal.appendChild(el);
      });
    }
    showStdinBar();
    showExecStatus('running', 'Waiting for input...');
    updateStatusBar('normal', '⌨ Waiting for input…');
    return;
  }

  // Normal output
  if (displayStdout) {
    displayStdout.split('\n').forEach(line => {
      const el = document.createElement('div');
      el.className = 'output-line';
      el.textContent = line;
      terminal.appendChild(el);
    });
  } else if (!stderr) {
    const el = document.createElement('div');
    el.className = 'output-line system';
    el.textContent = '(no output)';
    terminal.appendChild(el);
  }

  if (stderr) {
    const errHeader = document.createElement('div');
    errHeader.className = 'output-line error';
    errHeader.textContent = '⚠ stderr:';
    terminal.appendChild(errHeader);

    stderr.split('\n').forEach(line => {
      if (!line.trim()) return;
      const el = document.createElement('div');
      el.className = 'output-line error';
      el.textContent = line;
      terminal.appendChild(el);
    });

    const errorLines = parseErrorLines(stderr, exitCode);
    if (errorLines.length > 0) {
      highlightErrorLinesCM(errorLines);
      appendErrorSquiggles(terminal, errorLines);
    }
  } else {
    clearErrorHighlights();
  }

  if (exitCode === 0) {
    hideStdinBar();
    showExecStatus('success', `Finished in ${elapsed}ms`);
    updateStatusBar('success', `✓ Ran successfully in ${elapsed}ms`);
    $('tab-badge-output').classList.remove('visible');
    clearErrorHighlights();
    const successLine = document.createElement('div');
    successLine.className = 'output-line success-banner';
    successLine.textContent = '=== Code Execution Successful ===';
    terminal.appendChild(successLine);
  } else {
    hideStdinBar();
    showExecStatus('error', `Exited with code ${exitCode}`);
    updateStatusBar('error', `✗ Exit code ${exitCode}`);
    $('tab-badge-output').classList.add('visible');
  }

  updateInfoPanel(elapsed, exitCode, stdout, stderr, engine);
}

function renderError(msg, elapsed) {
  hideStdinBar();
  const terminal = $('output-terminal');
  terminal.innerHTML = `
    <div class="output-line system">▶ ${LANGUAGES[state.currentLang].name} | ${elapsed}ms</div>
    <div class="output-line system">${'─'.repeat(40)}</div>
    <div class="output-line error">✗ Error: ${escapeHtml(msg)}</div>
  `;
  showExecStatus('error', msg);
  updateStatusBar('error', `✗ ${msg}`);
  $('tab-badge-output').classList.add('visible');
}

function renderApiError(elapsed) {
  hideStdinBar();
  const terminal = $('output-terminal');
  terminal.innerHTML = `
    <div class="output-line system">▶ ${LANGUAGES[state.currentLang].name} | ${elapsed}ms</div>
    <div class="output-line system">${'─'.repeat(40)}</div>
    <div class="output-line error">✗ Cannot connect to MakeLabs API server.</div>
    <div class="output-line system">Make sure the backend is running: <code>npm run dev</code></div>
  `;
  showExecStatus('error', 'API server not running');
  updateStatusBar('error', '✗ API offline');
}

function updateInfoPanel(elapsed, exitCode, stdout, stderr, engine) {
  const lang = LANGUAGES[state.currentLang];
  $('info-lang').textContent = lang.name;
  $('info-time').textContent = `${elapsed}ms`;
  if ($('info-engine')) $('info-engine').textContent = engine || lang.engine || '—';
  $('info-exit').textContent = exitCode;
  $('info-exit').className = 'value ' + (exitCode === 0 ? 'green' : 'red');
  $('info-lines-out').textContent = stdout ? stdout.split('\n').length : 0;
  $('info-errors').textContent = stderr ? stderr.split('\n').filter(l => l.trim()).length : 0;
  $('info-errors').className = 'value ' + (stderr ? 'red' : 'green');
}

// ── Error Line Parsing ────────────────────────────────────────────────
function parseErrorLines(stderr, exitCode) {
  if (!stderr || exitCode === 0) return [];
  const errors = [];
  const lines = stderr.split('\n');
  const lang = state.currentLang;

  const patterns = {
    python: [/File\s+"[^"]*",\s+line\s+(\d+)/gi, /line\s+(\d+)/gi],
    java: [/\.java:(\d+):/gi, /line\s+(\d+)/gi],
    c: [/\.c:(\d+):\d+:/gi, /\.c:(\d+):/gi],
    cpp: [/\.cpp:(\d+):\d+:/gi, /\.cpp:(\d+):/gi],
    csharp: [/\((\d+),\d+\):\s*error/gi, /line\s+(\d+)/gi],
    javascript: [/:(\d+):\d+\)?$/gm, /evalmachine\.__anonymous__:(\d+)/gi],
    typescript: [/:(\d+):\d+/gi],
    php: [/on line\s+(\d+)/gi, /in\s+\S+\s+on\s+line\s+(\d+)/gi],
    ruby: [/:(\d+):/gi],
    go: [/:(\d+):\d+:/gi],
    rust: [/-->\s+[^:]+:(\d+):\d+/gi],
    kotlin: [/:(\d+):\d+/gi],
    bash: [/line\s+(\d+)/gi],
  };

  const langPatterns = patterns[lang] || [/line\s+(\d+)/gi];
  const seen = new Set();

  for (const pattern of langPatterns) {
    for (const line of lines) {
      let match;
      const re = new RegExp(pattern.source, pattern.flags);
      while ((match = re.exec(line)) !== null) {
        const lineNum = parseInt(match[1], 10);
        if (!isNaN(lineNum) && lineNum > 0 && !seen.has(lineNum)) {
          seen.add(lineNum);
          const msg = extractErrorMessage(line, lang);
          errors.push({ line: lineNum, message: msg, raw: line.trim() });
        }
      }
    }
  }
  return errors.slice(0, 10);
}

function extractErrorMessage(line, lang) {
  const cleaned = line.trim();
  return cleaned
    .replace(/^[^\s:]+:\d+:\d+:\s*/, '')
    .replace(/^[^\s:]+:\d+:\s*/, '')
    .replace(/^\s*\^\s*$/, '')
    .replace(/^error:/i, '⚠ ')
    .replace(/^warning:/i, '⚡ ')
    .trim() || cleaned;
}

// ── Error Highlights via CodeMirror (FIX Bug 3: was using raw textarea) ──
let _cmErrorMarkers = [];

function highlightErrorLinesCM(errorLines) {
  clearErrorHighlights();
  if (!cmEditor) return;
  errorLines.forEach(({ line }) => {
    const lineIdx = line - 1;
    if (lineIdx >= 0 && lineIdx < cmEditor.lineCount()) {
      const marker = cmEditor.addLineClass(lineIdx, 'background', 'cm-error-line');
      _cmErrorMarkers.push({ lineIdx, marker });
    }
  });
}

function clearErrorHighlights() {
  if (cmEditor && _cmErrorMarkers.length > 0) {
    _cmErrorMarkers.forEach(({ lineIdx }) => {
      cmEditor.removeLineClass(lineIdx, 'background', 'cm-error-line');
    });
  }
  _cmErrorMarkers = [];
  // Also clear any legacy overlay if present
  const overlay = document.getElementById('_error_overlay');
  if (overlay) overlay.remove();
}

// ── Error Squiggle Panel (FIX Bug 2: was using editor.value, now uses cmEditor) ─
function appendErrorSquiggles(terminal, errorLines) {
  if (!errorLines.length) return;
  // FIX Bug 2: Use cmEditor.getValue() not textarea.value
  const codeLines = cmEditor ? cmEditor.getValue().split('\n') : [];

  const sep = document.createElement('div');
  sep.className = 'output-line system';
  sep.textContent = '─'.repeat(40);
  terminal.appendChild(sep);

  const heading = document.createElement('div');
  heading.className = 'output-line system';
  heading.innerHTML = `⚠ Syntax / Runtime Errors <span class="error-badge">✗ ${errorLines.length} error${errorLines.length > 1 ? 's' : ''}</span>`;
  terminal.appendChild(heading);

  const panel = document.createElement('div');
  panel.className = 'error-squiggle-panel';

  errorLines.forEach(({ line, message }) => {
    const codeLine = codeLines[line - 1] || '';
    const item = document.createElement('div');
    item.className = 'squiggle-item';
    item.innerHTML = `
      <span class="sq-line">Ln ${line}</span>
      <span>
        <span class="sq-msg">${escapeHtml(message)}</span>
        ${codeLine.trim() ? `<span class="sq-code">${escapeHtml(codeLine.trim())}</span>` : ''}
      </span>
    `;
    item.addEventListener('click', () => jumpToLine(line));
    panel.appendChild(item);
  });
  terminal.appendChild(panel);
}

function jumpToLine(lineNum) {
  if (!cmEditor) return;
  cmEditor.setCursor({ line: lineNum - 1, ch: 0 });
  cmEditor.focus();
  showToast(`Jumped to line ${lineNum}`, 'info');
}

// ── Live Lint ─────────────────────────────────────────────────────────
let _lintTimeout = null;
function scheduleLint() {
  clearLintTimeout();
  _lintTimeout = setTimeout(() => lintCurrentCode(), 800);
}
function clearLintTimeout() {
  if (_lintTimeout) { clearTimeout(_lintTimeout); _lintTimeout = null; }
}

function lintCurrentCode() {
  if (!cmEditor) return;
  const code = cmEditor.getValue();
  const lang = state.currentLang;
  const errors = [];
  if (lang === 'python') errors.push(...lintPython(code));
  else if (lang === 'javascript' || lang === 'typescript') errors.push(...lintJavaScript(code));
  else if (lang === 'java') errors.push(...lintJava(code));
  else if (lang === 'php') errors.push(...lintPHP(code));
  if (errors.length > 0) highlightErrorLinesCM(errors);
  else clearErrorHighlights();
}

function lintPython(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    if (line.startsWith('\t') && code.includes('    ')) errors.push({ line: lineNum, message: 'Inconsistent indentation' });
    if (/^print\s+[^(]/.test(trimmed) && !trimmed.startsWith('#')) errors.push({ line: lineNum, message: 'print() requires parentheses in Python 3' });
  });
  return errors.slice(0, 8);
}

function lintJavaScript(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (/if\s*\([^=!<>]*[^=!<>]=[^=][^)]*\)/.test(trimmed)) errors.push({ line: i + 1, message: 'Possible assignment in condition (did you mean ==?)' });
  });
  return errors.slice(0, 8);
}

function lintJava(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (/System\.out\.print(ln)?\(.*\)\s*$/.test(trimmed) && !trimmed.endsWith(';')) errors.push({ line: i + 1, message: 'Missing semicolon after println()' });
  });
  return errors.slice(0, 8);
}

function lintPHP(code) {
  const errors = [];
  code.split('\n').forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;
    if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(trimmed) && !trimmed.startsWith('$')) errors.push({ line: i + 1, message: 'PHP variables must start with $' });
  });
  return errors.slice(0, 8);
}

// ── UI Control ────────────────────────────────────────────────────────
function setOutputTab(tabId) {
  $$('.output-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  $$('.output-panel').forEach(p => p.classList.toggle('active', p.id === `${tabId}-panel`));
}

function showExecStatus(type, msg) {
  const el = $('exec-status');
  el.className = `exec-status ${type}`;
  const icons = { running: '⟳', success: '✓', error: '✗' };
  el.innerHTML = `<span>${icons[type]}</span> ${escapeHtml(msg)}`;
}

function updateStatusBar(st = 'normal', msg = null) {
  const bar = $('status-bar');
  bar.className = st === 'error' ? 'error-state' : st === 'success' ? 'success-state' : '';
  if (msg) $('status-msg').textContent = msg;
}

function clearOutput() {
  hideStdinBar();
  showWelcomeOutput();
  showExecStatus('running', 'Ready');
  $('tab-badge-output').classList.remove('visible');
  updateStatusBar('normal', '');
  $('info-lang').textContent = LANGUAGES[state.currentLang].name;
}

function showWelcomeOutput() {
  $('output-terminal').innerHTML = `<div class="output-placeholder"><div class="ph-icon">▷</div><p>Click <strong>Run</strong> to execute</p></div>`;
}

// ── Toggle Theme ──────────────────────────────────────────────────────
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  const themeBtn = Array.from($$('button')).find(b => b.dataset.tooltip === 'Toggle Theme');
  if (isLight) {
    if (themeBtn) themeBtn.innerHTML = SIDEBAR_SVG.sun;
    showToast('Light Theme', 'info');
    localStorage.setItem('cc-theme', 'light');
    if (cmEditor) cmEditor.setOption('theme', 'eclipse');
  } else {
    if (themeBtn) themeBtn.innerHTML = SIDEBAR_SVG.moon;
    showToast('Dark Theme', 'info');
    localStorage.setItem('cc-theme', 'dark');
    if (cmEditor) cmEditor.setOption('theme', 'dracula');
  }
}

// ── Topbar Event Binding ──────────────────────────────────────────────
function bindTopbarActions() {
  // FIX Bug 4: Run button no longer auto-shows stdin bar; just runs code
  $('run-btn').addEventListener('click', () => triggerRun());

  const askAiBtn = $('btn-ask-ai');
  if (askAiBtn) askAiBtn.addEventListener('click', () => askAI());

  $('btn-reset').addEventListener('click', () => {
    const defaultCode = LANGUAGES[state.currentLang].defaultCode;
    cmEditor.setValue(defaultCode);
    // In file mode: update file content; in scratch mode: update history
    if (state.activeFileId) {
      const f = state.files.find(f => f.id === state.activeFileId);
      if (f) { f.content = defaultCode; saveFilesToStorage(); }
    } else {
      state.editorHistory[state.currentLang] = defaultCode;
    }
    updateEditorMeta(); clearErrorHighlights();
    showToast('Reset to default code', 'info');
  });

  $('btn-clear').addEventListener('click', () => {
    if (!cmEditor.getValue().trim()) { showToast('Editor is already empty', 'info'); return; }
    cmEditor.setValue('');
    if (state.activeFileId) {
      const f = state.files.find(f => f.id === state.activeFileId);
      if (f) { f.content = ''; saveFilesToStorage(); }
    } else {
      state.editorHistory[state.currentLang] = '';
    }
    updateEditorMeta(); clearErrorHighlights(); clearOutput();
    showToast('Editor cleared!', 'success');
  });

  $('btn-copy').addEventListener('click', () => {
    const code = cmEditor.getValue();
    if (!code.trim()) { showToast('Nothing to copy', 'warning'); return; }
    navigator.clipboard.writeText(code).then(() => showToast('Code copied!', 'success'));
  });

  $('btn-save').addEventListener('click', () => openModal('save-modal'));
  $('btn-do-save').addEventListener('click', saveSnippet);

  $$('.output-tab').forEach(tab => tab.addEventListener('click', () => setOutputTab(tab.dataset.tab)));
  $$('.modal-close').forEach(btn =>
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id))
  );
  $$('.modal-overlay').forEach(o =>
    o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); })
  );

  $('btn-copy-url').addEventListener('click', () =>
    navigator.clipboard.writeText($('share-url').value).then(() => showToast('URL copied!', 'success'))
  );

  $('btn-web-share').addEventListener('click', async () => {
    try { await navigator.share({ title: 'MakeLabs Snippet', url: $('share-url').value }); }
    catch {}
  });

  const wbtn = $('btn-whatsapp-share');
  if (wbtn) {
    wbtn.addEventListener('click', () => {
      const url = encodeURIComponent($('share-url').value);
      window.open(`https://wa.me/?text=Check out my code: ${url}`, '_blank');
    });
  }
}

async function saveSnippet() {
  const title = $('snippet-title').value.trim() || 'Untitled Snippet';
  const code = cmEditor.getValue();
  const isPublic = $('snippet-public').checked;
  try {
    const res = await fetch(`${API_BASE}/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, language: state.currentLang, source_code: code, is_public: isPublic }),
    });
    const data = await res.json();
    if (data.success) {
      closeModal('save-modal');
      const shareUrl = `${window.location.origin}/snippet/${data.id}`;
      $('share-url').value = shareUrl;
      openModal('share-modal');
      showToast('Snippet saved!', 'success');
    } else { showToast(data.message || 'Save failed', 'error'); }
  } catch {
    closeModal('save-modal');
    showToast('Backend connection required', 'warning');
  }
}

// ── Sidebar ───────────────────────────────────────────────────────────
function buildSidebarBtns() {
  const actions = [
    { icon: SIDEBAR_SVG.files,    tooltip: 'File Manager', action: () => toggleFileManager() },
    { icon: SIDEBAR_SVG.examples, tooltip: 'Examples', action: () => { populateExamples(); openModal('examples-modal'); } },
    { icon: SIDEBAR_SVG.settings, tooltip: 'Settings', action: () => openSettingsModal() },
    { icon: SIDEBAR_SVG.help,     tooltip: 'Help', action: () => openModal('help-modal') },
  ];
  const sidebar = $('sidebar');
  sidebar.innerHTML = '';
  actions.forEach(({ icon, tooltip, action }) => {
    const btn = document.createElement('button');
    btn.className = 'sidebar-btn';
    btn.dataset.tooltip = tooltip;
    btn.innerHTML = icon;
    btn.id = tooltip === 'File Manager' ? 'btn-toggle-fm' : '';
    btn.addEventListener('click', action);
    sidebar.appendChild(btn);
  });
  const sep = document.createElement('div');
  sep.className = 'sidebar-sep';
  sidebar.appendChild(sep);
  const themeBtn = document.createElement('button');
  themeBtn.className = 'sidebar-btn';
  themeBtn.id = 'btn-theme-toggle';
  themeBtn.dataset.tooltip = 'Toggle Theme';
  themeBtn.innerHTML = SIDEBAR_SVG.moon;
  themeBtn.addEventListener('click', toggleTheme);
  sidebar.appendChild(themeBtn);
}
function populateExamples() {
  const container = $('examples-container');
  if (!container) return;
  container.innerHTML = '';
  EXAMPLES.forEach(ex => {
    const lang = LANGUAGES[ex.lang];
    if (!lang) return;
    const card = document.createElement('div');
    card.className = 'example-card';
    card.innerHTML = `<div class="ex-title">${escapeHtml(ex.title)}</div><div class="ex-lang"><span>${lang.icon}</span> ${lang.name}</div>`;
    card.addEventListener('click', () => {
      setLanguage(ex.lang);
      cmEditor.setValue(ex.code);
      closeModal('examples-modal');
      showToast(`Loaded ${ex.title}`, 'success');
    });
    container.appendChild(card);
  });
}

// ── Resize Handle (Editor ↔ Output) ─────────────────────────────────
function bindResizeHandle() {
  const handle = $('resize-handle');
  const outputPane = $('output-pane');
  const main = $('main');
  let startX, startWidth;
  handle.addEventListener('mousedown', e => {
    state.resizing = true; startX = e.clientX; startWidth = outputPane.offsetWidth;
    handle.classList.add('dragging'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!state.resizing) return;
    const delta = startX - e.clientX;
    const newWidth = Math.min(Math.max(startWidth + delta, 250), main.offsetWidth * 0.7);
    outputPane.style.width = newWidth + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (state.resizing) { state.resizing = false; handle.classList.remove('dragging'); document.body.style.cursor = ''; document.body.style.userSelect = ''; }
  });
}

// ── File Manager Resize Handle ────────────────────────────────────────
function bindFmResizeHandle() {
  const handle = $('fm-resize-handle');
  const fmPanel = $('file-manager-panel');
  if (!handle || !fmPanel) return;
  let dragging = false, startX, startWidth;
  handle.addEventListener('mousedown', e => {
    dragging = true; startX = e.clientX; startWidth = fmPanel.offsetWidth;
    document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const newWidth = Math.min(Math.max(startWidth + (e.clientX - startX), 140), 400);
    fmPanel.style.width = newWidth + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; document.body.style.cursor = ''; document.body.style.userSelect = ''; }
  });
}

// ── File Manager ──────────────────────────────────────────────────────
function initFileManager() {
  // Load saved files from localStorage
  const saved = localStorage.getItem('ml-files');
  if (saved) {
    try { state.files = JSON.parse(saved); } catch { state.files = []; }
  }

  renderFileTree();

  // Bind FM buttons
  const btnNew = $('btn-fm-new-file');
  if (btnNew) btnNew.addEventListener('click', openNewFileModal);

  const btnCollapse = $('btn-fm-collapse');
  if (btnCollapse) btnCollapse.addEventListener('click', () => toggleFileManager(false));

  const btnDownload = $('btn-fm-download');
  if (btnDownload) btnDownload.addEventListener('click', downloadAllFilesAsZip);

  // Bind new-file modal
  buildLangPicker();
  const btnCreate = $('btn-create-file');
  if (btnCreate) btnCreate.addEventListener('click', createNewFile);

  const nameInput = $('new-file-name');
  if (nameInput) {
    nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') createNewFile(); });
  }
}

function saveFilesToStorage() {
  localStorage.setItem('ml-files', JSON.stringify(state.files));
}

function toggleFileManager(forceOpen) {
  const fmPanel = $('file-manager-panel');
  if (!fmPanel) return;
  if (forceOpen === false || !fmPanel.classList.contains('collapsed')) {
    fmPanel.classList.add('collapsed');
    state.fmCollapsed = true;
  } else {
    fmPanel.classList.remove('collapsed');
    state.fmCollapsed = false;
  }
}

function renderFileTree() {
  const tree = $('fm-tree');
  if (!tree) return;

  if (state.files.length === 0) {
    tree.innerHTML = '<div class="fm-empty">No files yet.<br/>Click <strong>+ New File</strong> to start.</div>';
    return;
  }

  tree.innerHTML = '';
  state.files.forEach(file => {
    const lang = LANGUAGES[file.language];
    const item = document.createElement('div');
    item.className = 'fm-file' + (file.id === state.activeFileId ? ' active' : '');
    item.dataset.fileId = file.id;

    // Always detect lang from extension for icon
    const detectedLangForIcon = detectLangFromFilename(file.name) || file.language;
    const svgFileIcon = LANG_SVG[detectedLangForIcon]
      ? `<span class="fm-file-icon" style="color:${LANGUAGES[detectedLangForIcon]?.color||'#8b949e'}">${LANG_SVG[detectedLangForIcon]}</span>`
      : `<span class="fm-file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>`;
    const renameIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
    const deleteIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
    item.innerHTML = `
      ${svgFileIcon}
      <span class="fm-file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
      <span class="fm-file-actions">
        <button class="fm-file-action-btn" data-action="rename" title="Rename">${renameIcon}</button>
        <button class="fm-file-action-btn" data-action="delete" title="Delete">${deleteIcon}</button>
      </span>
    `;

    item.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'delete') { deleteFile(file.id); return; }
      if (action === 'rename') { startRenameFile(file.id, item); return; }
      openFile(file.id);
    });

    tree.appendChild(item);
  });
}

function openFile(fileId) {
  const file = state.files.find(f => f.id === fileId);
  if (!file) return;

  // Save the current editor content back to the currently open file BEFORE switching
  if (state.activeFileId && state.activeFileId !== fileId && cmEditor) {
    const currentFile = state.files.find(f => f.id === state.activeFileId);
    if (currentFile) {
      currentFile.content = cmEditor.getValue();
      saveFilesToStorage();
    }
  }

  state.activeFileId = fileId;
  // Detect language from filename extension (VS Code style)
  const detectedLang = detectLangFromFilename(file.name) || file.language;
  if (file.language !== detectedLang) file.language = detectedLang;

  // Set language (syntax highlighting + mode) WITHOUT loading from editorHistory
  const lang = LANGUAGES[detectedLang];
  if (lang && cmEditor) {
    state.currentLang = detectedLang;
    cmEditor.setOption('mode', CM_MODE_MAP[detectedLang] || 'text/plain');
    $$('.lang-tab').forEach(t => t.classList.toggle('active', t.dataset.lang === detectedLang));
    $('editor-lang-badge').textContent = lang.name;
    $('status-lang').textContent = lang.name;
    clearErrorHighlights();
    clearOutput();
  }

  // Load THIS file's own content — never from editorHistory
  cmEditor.setValue(file.content);
  $('editor-filename').textContent = file.name;
  updateEditorMeta();
  renderFileTree();
  showToast(`Opened ${file.name}`, 'info');
}

function deleteFile(fileId) {
  state.files = state.files.filter(f => f.id !== fileId);
  if (state.activeFileId === fileId) state.activeFileId = null;
  saveFilesToStorage();
  renderFileTree();
  showToast('File deleted', 'info');
}

function startRenameFile(fileId, itemEl) {
  const file = state.files.find(f => f.id === fileId);
  if (!file) return;
  const nameEl = itemEl.querySelector('.fm-file-name');
  const oldName = file.name;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'fm-rename-input';
  input.value = oldName;
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = () => {
    const newName = input.value.trim();
    if (newName && newName !== oldName) {
      file.name = newName;
      // Re-detect language from new extension
      const newLang = detectLangFromFilename(newName);
      if (newLang) file.language = newLang;
      saveFilesToStorage();
      // Update breadcrumb if this is the active file
      if (state.activeFileId === fileId) {
        $('editor-filename').textContent = newName;
        if (newLang && LANGUAGES[newLang]) {
          $('editor-lang-badge').textContent = LANGUAGES[newLang].name;
        }
      }
      showToast(`Renamed to ${newName}`, 'success');
    }
    renderFileTree();
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
    if (e.key === 'Escape') { input.value = oldName; input.blur(); }
  });
}

// New File Modal — VS Code style: detect language from extension
let _selectedLangForNewFile = 'python';

function buildLangPicker() {
  // No longer needed — language auto-detected from filename extension
}

function _updateNewFilePreview() {
  const nameInput = $('new-file-name');
  if (!nameInput) return;
  const name = nameInput.value.trim();
  const lang = detectLangFromFilename(name);
  const preview = $('new-file-lang-preview');
  if (!preview) return;
  if (lang && LANGUAGES[lang]) {
    const svgIcon = LANG_SVG[lang] || '';
    preview.innerHTML = svgIcon + '<span>' + LANGUAGES[lang].name + '</span>';
    preview.className = 'nf-lang-preview detected';
    _selectedLangForNewFile = lang;
  } else if (name) {
    preview.innerHTML = '<span>Unknown extension — plain text</span>';
    preview.className = 'nf-lang-preview unknown';
    _selectedLangForNewFile = 'python';
  } else {
    preview.innerHTML = '<span>Type a filename to detect language</span>';
    preview.className = 'nf-lang-preview empty';
  }
}

function openNewFileModal() {
  const nameInput = $('new-file-name');
  if (nameInput) {
    nameInput.value = '';
    nameInput.removeEventListener('input', _updateNewFilePreview);
    nameInput.addEventListener('input', _updateNewFilePreview);
  }
  _updateNewFilePreview();
  openModal('new-file-modal');
  setTimeout(() => nameInput && nameInput.focus(), 100);
}
function createNewFile() {
  const nameInput = $('new-file-name');
  const name = nameInput ? nameInput.value.trim() : '';
  if (!name) { showToast('Please enter a file name', 'warning'); return; }

  // Detect language from extension (VS Code style); fallback to _selectedLangForNewFile
  const lang = detectLangFromFilename(name) || _selectedLangForNewFile;
  const id = 'f_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const defaultContent = (LANGUAGES[lang] && LANGUAGES[lang].defaultCode) || '';
  const newFile = {
    id,
    name,
    language: lang,
    content: defaultContent,
  };

  state.files.push(newFile);
  saveFilesToStorage();
  renderFileTree();
  closeModal('new-file-modal');
  openFile(id);
  showToast(`Created ${name}`, 'success');
}

// Download all files as ZIP (simple multi-file download via anchor links)
function downloadAllFilesAsZip() {
  if (state.files.length === 0) {
    showToast('No files to download', 'warning');
    return;
  }
  // Download each file individually (no JSZip dependency needed)
  state.files.forEach(file => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  });
  showToast(`Downloaded ${state.files.length} file(s)`, 'success');
}

// ── Modal Helpers ─────────────────────────────────────────────────────
function openModal(id) { const el = $(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = $(id); if (el) el.classList.remove('open'); }

// ── Toast ─────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${escapeHtml(msg)}`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── AI Assistant ──────────────────────────────────────────────────────
let currentChatHistory = [];

async function askAI() {
  if (!cmEditor) return;
  const code = cmEditor.getValue().trim();
  if (!code) { showToast('Please write some code first!', 'warning'); return; }

  currentChatHistory = [
    { role: 'system', content: 'You are a helpful coding tutor. Keep explanations concise, formatted in markdown, and always end by asking the user what they want to do next.' },
    { role: 'user', content: `Language: ${state.currentLang}\nCode:\n${code}\n\nExplain this code and suggest an improvement.` },
  ];

  openModal('ai-modal');
  $('ai-chat-history').innerHTML = '';
  $('ai-chat-input').value = '';

  appendChatMessage('AI', '<div class="spinner" style="border-top-color: var(--text-primary); width: 14px; height: 14px;"></div> Thinking...');
  await fetchAiResponse();
}

async function fetchAiResponse() {
  try {
    const response = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatHistory: currentChatHistory }),
    });
    const data = await response.json();
    const chatContainer = $('ai-chat-history');
    chatContainer.removeChild(chatContainer.lastChild);
    if (data.success) {
      currentChatHistory.push(data.reply);
      appendChatMessage('AI', data.reply.content);
    } else {
      appendChatMessage('System', '❌ ' + (data.message || 'Analysis failed.'));
    }
  } catch {
    $('ai-chat-history').removeChild($('ai-chat-history').lastChild);
    appendChatMessage('System', '❌ Could not connect to the backend server.');
  }
}

function appendChatMessage(sender, text) {
  const chatContainer = $('ai-chat-history');
  const msgDiv = document.createElement('div');
  const isUser = sender === 'You';
  msgDiv.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
  msgDiv.style.backgroundColor = isUser ? '#a371f7' : 'var(--bg-tertiary)';
  msgDiv.style.color = isUser ? '#fff' : 'var(--text-primary)';
  msgDiv.style.padding = '12px 16px';
  msgDiv.style.borderRadius = '8px';
  msgDiv.style.maxWidth = '85%';
  msgDiv.style.whiteSpace = 'pre-wrap';
  msgDiv.style.lineHeight = '1.6';
  msgDiv.style.border = isUser ? 'none' : '1px solid var(--border)';
  msgDiv.innerHTML = `<strong style="font-size:11px; opacity:0.8; display:block; margin-bottom:4px; text-transform:uppercase;">${sender}</strong>${text}`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  const btnAiSend = $('btn-ai-send');
  const aiInput = $('ai-chat-input');
  if (btnAiSend && aiInput) {
    const sendFollowUp = () => {
      const text = aiInput.value.trim();
      if (!text) return;
      appendChatMessage('You', text);
      currentChatHistory.push({ role: 'user', content: text });
      aiInput.value = '';
      appendChatMessage('AI', '<div class="spinner" style="border-top-color: var(--text-primary); width: 14px; height: 14px;"></div> Thinking...');
      fetchAiResponse();
    };
    btnAiSend.addEventListener('click', sendFollowUp);
    aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendFollowUp(); });
  }
});

// Expose globally for external use
window.runCode = runCode;
window.setLanguage = setLanguage;
window.jumpToLine = jumpToLine;