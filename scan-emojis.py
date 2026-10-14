#!/usr/bin/env python3
"""
Scan the YallaGrow codebase for emojis — REPORT ONLY, no changes.
Run from project root: python3 scan-emojis.py > emoji-report.txt

Outputs a report like:
  src/components/pages/HomePage.tsx:
     42: 🚀    <h1>🚀 Launch your growth</h1>
     87: 💬    <button>💬 Chat with us</button>

Send that report file back and we'll decide for each one:
  - Replace with an SVG icon
  - Remove entirely
  - Keep (rare, but possible)
"""

import os
import sys

PROJECT_ROOT = os.getcwd()
SKIP_DIRS = {'node_modules', '.next', '.git', 'dist', 'build', '.vercel', 'out'}
SCAN_DIRS = ['src', 'public']
EXTENSIONS = {'.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.md'}

EMOJI_RANGES = [
    (0x1F000, 0x1FFFF),
    (0x2600,  0x26FF),
    (0x2700,  0x27BF),
    (0x1F1E6, 0x1F1FF),
    (0x2300,  0x23FF),
]
MODIFIERS = {0xFE0E, 0xFE0F, 0x200D}

ALWAYS_KEEP = {
    0x2713, 0x2714, 0x2715, 0x2716, 0x2717, 0x2718,
    0x2605, 0x2606,
    0x2190, 0x2191, 0x2192, 0x2193,
    0x2794, 0x2795, 0x2796, 0x2797,
    0x25BA, 0x25C4,
    0x00B7, 0x2022, 0x25E6, 0x2043,
    0x2026, 0x2013, 0x2014,
    0x2018, 0x2019, 0x201C, 0x201D,
}

def is_emoji_char(ch):
    cp = ord(ch)
    if cp in ALWAYS_KEEP or cp in MODIFIERS:
        return False
    for lo, hi in EMOJI_RANGES:
        if lo <= cp <= hi:
            return True
    return False

def find_emojis_in_line(line):
    found = []
    for i, ch in enumerate(line):
        if is_emoji_char(ch):
            found.append((i, ch))
    return found

def main():
    file_hits = {}
    total_emojis = 0
    unique_emojis = {}

    for scan_dir in SCAN_DIRS:
        root = os.path.join(PROJECT_ROOT, scan_dir)
        if not os.path.isdir(root):
            continue
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for fname in filenames:
                ext = os.path.splitext(fname)[1].lower()
                if ext not in EXTENSIONS:
                    continue
                if fname.endswith('.emoji-backup'):
                    continue
                fpath = os.path.join(dirpath, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                except (UnicodeDecodeError, IOError):
                    continue
                hits = []
                for lineno, line in enumerate(lines, 1):
                    found = find_emojis_in_line(line)
                    if found:
                        for col, ch in found:
                            total_emojis += 1
                            unique_emojis[ch] = unique_emojis.get(ch, 0) + 1
                        emoji_str = ''.join(ch for _, ch in found)
                        context = line.rstrip('\n')
                        # Trim very long lines around the first emoji position
                        if len(context) > 120:
                            first_col = found[0][0]
                            start = max(0, first_col - 40)
                            end = min(len(context), first_col + 80)
                            prefix = '…' if start > 0 else ''
                            suffix = '…' if end < len(context) else ''
                            context = prefix + context[start:end] + suffix
                        hits.append((lineno, emoji_str, context.strip()))
                if hits:
                    rel = os.path.relpath(fpath, PROJECT_ROOT)
                    file_hits[rel] = hits

    print("=" * 70)
    print("EMOJI REPORT — YallaGrow codebase")
    print("=" * 70)
    print(f"Files with emojis: {len(file_hits)}")
    print(f"Total emoji occurrences: {total_emojis}")
    print(f"Unique emojis used: {len(unique_emojis)}")
    print()

    if unique_emojis:
        print("-" * 70)
        print("UNIQUE EMOJIS (by frequency):")
        print("-" * 70)
        sorted_emojis = sorted(unique_emojis.items(), key=lambda x: -x[1])
        for emoji, count in sorted_emojis:
            print(f"  {emoji}  ×{count}")
        print()

    if file_hits:
        print("-" * 70)
        print("PER-FILE BREAKDOWN:")
        print("-" * 70)
        # Sort files by number of emojis
        sorted_files = sorted(file_hits.items(), key=lambda x: -len(x[1]))
        for rel, hits in sorted_files:
            print()
            print(f"{rel}  ({len(hits)} emoji{'s' if len(hits) != 1 else ''}):")
            for lineno, emojis, context in hits:
                print(f"  L{lineno:4d}  {emojis}   {context}")
    else:
        print("Clean. No emojis found.")

if __name__ == '__main__':
    main()
