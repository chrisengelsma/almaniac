#!/usr/bin/env python3
"""Tap-test Almaniac on Android via uiautomator + adb input."""

from __future__ import annotations

import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET


def adb(*args: str) -> str:
    return subprocess.check_output(["adb", *args], text=True).strip()


def dump_ui() -> ET.Element:
    subprocess.run(["adb", "shell", "uiautomator", "dump", "/sdcard/ui.xml"], check=True, capture_output=True)
    subprocess.run(["adb", "pull", "/sdcard/ui.xml", "/tmp/almaniac-ui.xml"], check=True, capture_output=True)
    return ET.parse("/tmp/almaniac-ui.xml").getroot()


def find_node(root: ET.Element, label: str) -> tuple[str, str] | tuple[None, None]:
    for node in root.iter("node"):
        desc = node.attrib.get("content-desc", "")
        text = node.attrib.get("text", "")
        if desc == label or text == label:
            return label, node.attrib.get("bounds", "")
    return None, None


def center(bounds: str) -> tuple[int, int]:
    match = re.match(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]", bounds)
    if not match:
        raise ValueError(f"Bad bounds: {bounds}")
    x1, y1, x2, y2 = map(int, match.groups())
    return (x1 + x2) // 2, (y1 + y2) // 2


def tap(x: int, y: int) -> None:
    subprocess.run(["adb", "shell", "input", "tap", str(x), str(y)], check=True)
    time.sleep(0.9)


def display_line() -> str:
    out = adb("shell", "dumpsys", "window", "displays")
    return next(line.strip() for line in out.splitlines() if "init=" in line)


def webview_bounds(root: ET.Element) -> str | None:
    for node in root.iter("node"):
        if "WebView" in node.attrib.get("class", ""):
            return node.attrib.get("bounds")
    return None


def close_settings_if_open() -> None:
    root = dump_ui()
    _, bounds = find_node(root, "Close customize panel")
    if bounds:
        tap(300, 500)


def run_orientation(label: str, user_rotation: str) -> list[str]:
    adb("shell", "settings", "put", "system", "accelerometer_rotation", "0")
    adb("shell", "settings", "put", "system", "user_rotation", user_rotation)
    adb("shell", "am", "force-stop", "app.engelsma.almaniac")
    time.sleep(0.5)
    adb("shell", "am", "start", "-n", "app.engelsma.almaniac/.MainActivity")
    time.sleep(3)
    close_settings_if_open()

    lines = [f"\n== {label} ==", display_line()]
    root = dump_ui()
    lines.append(f"WebView: {webview_bounds(root)}")

    tests = [
        ("Jump to date", "Go to date"),
        ("Customize calendars and settings", "Close customize panel"),
        ("Go to today", None),
    ]

    for button_desc, expected_after in tests:
        root = dump_ui()
        _, bounds = find_node(root, button_desc)
        if not bounds:
            lines.append(f"FAIL {button_desc}: not found in UI tree")
            continue

        cx, cy = center(bounds)
        tap(cx, cy)
        root_after = dump_ui()

        if expected_after:
            _, found = find_node(root_after, expected_after)
            status = "PASS" if found else "FAIL"
            lines.append(f"{status} {button_desc}: tap ({cx},{cy}) bounds {bounds}")
            if found and expected_after == "Close customize panel":
                close_settings_if_open()
            elif found and expected_after == "Go to date":
                _, cancel_bounds = find_node(root_after, "Cancel")
                if cancel_bounds:
                    tap(*center(cancel_bounds))
        else:
            lines.append(f"INFO {button_desc}: tap ({cx},{cy}) bounds {bounds}")

        # Offset probe: 80px below button center should not open settings/date
        if button_desc == "Customize calendars and settings":
            root = dump_ui()
            _, bounds = find_node(root, button_desc)
            if bounds:
                cx, cy = center(bounds)
                tap(cx, cy + 80)
                root_after = dump_ui()
                _, opened = find_node(root_after, "Close customize panel")
                lines.append(
                    f"{'FAIL' if opened else 'PASS'} offset +80y: tap ({cx},{cy + 80}) "
                    f"{'incorrectly opened settings' if opened else 'did not open settings'}"
                )
                if opened:
                    close_settings_if_open()

    return lines


def main() -> int:
    try:
        adb("get-state")
    except subprocess.CalledProcessError:
        print("No adb device connected", file=sys.stderr)
        return 1

    lines = ["Almaniac tablet tap test"]
    lines.extend(run_orientation("LANDSCAPE", "0"))
    lines.extend(run_orientation("PORTRAIT", "1"))
    print("\n".join(lines))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
