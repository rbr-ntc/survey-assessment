## 2024-05-23 - Radio Input Accessibility
**Learning:** Hidden inputs (`display: none` or `.hidden` in Tailwind) remove elements from the accessibility tree, making them inaccessible to keyboard users and screen readers.
**Action:** Use `.sr-only` (screen reader only) class instead of `.hidden` for inputs that need to be visually hidden but remain accessible. Ensure the parent label has `:focus-within` styles to provide visual feedback when the hidden input is focused.
