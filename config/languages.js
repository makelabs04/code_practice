// backend/config/languages.js

const LANGUAGES = {
  python: {
    id: 'python',
    name: 'Python',
    pistonRuntime: 'python',
    pistonVersion: '3.10.0',
    judge0Id: 71,
    extension: '.py',
    executionEngine: 'piston', // Use Piston for library support (numpy, requests, etc.)
    defaultCode: `# Python - MakeLabs Online Compiler
print("Hello, World!")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)

# Function example
def greet(name):
    return f"Welcome to MakeLabs, {name}!"

print(greet("Developer"))`,
    icon: '🐍',
    color: '#3572A5',
  },

  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    pistonRuntime: 'javascript',
    pistonVersion: '18.15.0',
    judge0Id: 63,
    extension: '.js',
    executionEngine: 'piston', // Piston runs Node.js — supports most built-ins
    defaultCode: `// JavaScript - MakeLabs Online Compiler
console.log("Hello, World!");

// Arrow functions & array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);`,
    icon: '🌐',
    color: '#F7DF1E',
  },

  java: {
    id: 'java',
    name: 'Java',
    pistonRuntime: 'java',
    pistonVersion: '15.0.2',
    judge0Id: 62,
    extension: '.java',
    executionEngine: 'judge0',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");

        // FizzBuzz example
        for (int i = 1; i <= 15; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
    icon: '☕',
    color: '#f89820',
  },

  cpp: {
    id: 'cpp',
    name: 'C++',
    pistonRuntime: 'c++',
    pistonVersion: '10.2.0',
    judge0Id: 54,
    extension: '.cpp',
    executionEngine: 'judge0',
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
    icon: '⚡',
    color: '#00599C',
  },

  c: {
    id: 'c',
    name: 'C',
    pistonRuntime: 'c',
    pistonVersion: '10.2.0',
    judge0Id: 50,
    extension: '.c',
    executionEngine: 'judge0',
    defaultCode: `#include <stdio.h>
#include <string.h>

int main() {
    printf("Hello, World!\\n");

    int arr[] = {1, 2, 3, 4, 5};
    int sum = 0;
    int n = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }
    printf("Sum: %d\\n", sum);
    printf("Average: %.1f\\n", (float)sum / n);

    return 0;
}`,
    icon: '🔧',
    color: '#A8B9CC',
  },

  csharp: {
    id: 'csharp',
    name: 'C#',
    pistonRuntime: 'csharp',
    pistonVersion: '6.12.0',
    judge0Id: 51,
    extension: '.cs',
    executionEngine: 'judge0',
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
    icon: '💜',
    color: '#68217A',
  },

  php: {
    id: 'php',
    name: 'PHP',
    pistonRuntime: 'php',
    pistonVersion: '8.2.3',
    judge0Id: 68,
    extension: '.php', // FIXED: was `ext` — now `extension` to match all others
    executionEngine: 'judge0',
    defaultCode: `<?php
echo "Hello, World!\\n";

// Arrays and loops
$fruits = ["Apple", "Banana", "Cherry"];
foreach ($fruits as $index => $fruit) {
    echo ($index + 1) . ". " . $fruit . "\\n";
}

// Functions
function factorial($n) {
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}

echo "5! = " . factorial(5) . "\\n";
echo "Welcome to MakeLabs!\\n";
?>`,
    icon: '🐘',
    color: '#777BB4',
  },

  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    pistonRuntime: 'typescript',
    pistonVersion: '5.0.3',
    judge0Id: 74,
    extension: '.ts',
    executionEngine: 'piston',
    defaultCode: `// TypeScript - MakeLabs Online Compiler
const greet = (name: string): string => {
  return \`Hello, \${name}!\`;
};

console.log(greet("World"));

interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];

people.forEach(p => console.log(\`\${p.name} is \${p.age} years old\`));`,
    icon: '💙',
    color: '#3178C6',
  },

  ruby: {
    id: 'ruby',
    name: 'Ruby',
    pistonRuntime: 'ruby',
    pistonVersion: '3.0.1',
    judge0Id: 72,
    extension: '.rb',
    executionEngine: 'piston',
    defaultCode: `# Ruby - MakeLabs Online Compiler
puts "Hello, World!"

# Blocks and iterators
[1, 2, 3, 4, 5].each do |n|
  puts "Number: #{n * n}"
end

# Method definition
def greet(name)
  "Welcome to MakeLabs, #{name}!"
end

puts greet("Developer")`,
    icon: '💎',
    color: '#CC342D',
  },

  go: {
    id: 'go',
    name: 'Go',
    pistonRuntime: 'go',
    pistonVersion: '1.16.2',
    judge0Id: 60,
    extension: '.go',
    executionEngine: 'piston',
    defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")

    // Slice and range
    nums := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, n := range nums {
        sum += n
    }
    fmt.Println("Sum:", sum)
}`,
    icon: '🐹',
    color: '#00ADD8',
  },

  rust: {
    id: 'rust',
    name: 'Rust',
    pistonRuntime: 'rust',
    pistonVersion: '1.50.0',
    judge0Id: 73,
    extension: '.rs',
    executionEngine: 'piston',
    defaultCode: `fn main() {
    println!("Hello, World!");

    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);

    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled);
}`,
    icon: '🦀',
    color: '#CE412B',
  },

  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    pistonRuntime: 'kotlin',
    pistonVersion: '1.4.31',
    judge0Id: 78,
    extension: '.kt',
    executionEngine: 'piston',
    defaultCode: `fun main() {
    println("Hello, World!")

    val numbers = listOf(1, 2, 3, 4, 5)
    val sum = numbers.sum()
    val doubled = numbers.map { it * 2 }

    println("Sum: $sum")
    println("Doubled: $doubled")
}`,
    icon: '🎯',
    color: '#7F52FF',
  },

  bash: {
    id: 'bash',
    name: 'Bash',
    pistonRuntime: 'bash',
    pistonVersion: '5.1.0',
    judge0Id: 46,
    extension: '.sh',
    executionEngine: 'piston',
    defaultCode: `#!/bin/bash
echo "Hello, World!"

# Variables
NAME="MakeLabs"
echo "Welcome to $NAME!"

# Loop
for i in {1..5}; do
  echo "Count: $i"
done

# Arithmetic
SUM=$((10 + 20))
echo "Sum: $SUM"`,
    icon: '🖥️',
    color: '#4EAA25',
  },

  html: {
    id: 'html',
    name: 'HTML',
    pistonRuntime: null,
    pistonVersion: null,
    judge0Id: null,
    extension: '.html', // FIXED: was `ext` — now `extension`
    executionEngine: 'preview', // Rendered in-browser, no backend needed
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>My Page</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f0f4f8;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 32px 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      text-align: center;
    }
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
    icon: '🌍',
    color: '#E34F26',
  },

  css: {
    id: 'css',
    name: 'CSS',
    pistonRuntime: null,
    pistonVersion: null,
    judge0Id: null,
    extension: '.css', // FIXED: was `ext` — now `extension`
    executionEngine: 'preview',
    defaultCode: `/* CSS Preview — MakeLabs */
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.box {
  background: white;
  border-radius: 16px;
  padding: 40px 48px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  text-align: center;
}

.box h1 {
  color: #264de4;
  font-size: 2rem;
  margin-bottom: 12px;
}

.box p {
  color: #666;
  font-size: 1rem;
}`,
    icon: '🎨',
    color: '#264DE4',
  },
};

module.exports = LANGUAGES;