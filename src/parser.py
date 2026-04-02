import os
import re

with open("extracted_code.jsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

current_file = None
file_contents = {}

for line in lines:
    line_stripped = line.strip()
    # Check if line looks like a file path (no spaces, contains a dot, typically starts with src/ or is index.html or tailwind.config.ts)
    if (line_stripped.startswith("src/") or line_stripped in ["index.html", "tailwind.config.ts", "package.json", "tsconfig.json", "vite.config.ts"]) and not " " in line_stripped and "." in line_stripped:
        current_file = line_stripped
        file_contents[current_file] = []
    elif current_file is not None:
        file_contents[current_file].append(line)

for filepath, content in file_contents.items():
    directory = os.path.dirname(filepath)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(content)
        
print("Successfully parsed and wrote files:", list(file_contents.keys()), flush=True)
