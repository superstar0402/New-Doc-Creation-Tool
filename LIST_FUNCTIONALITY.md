# Microsoft Word-like List Functionality

This document describes the bulleted and numbered list functionality implemented in the Rich Text Editor component.

## Features

### Bulleted Lists
- **Create**: Click the bullet list button (•) or use the toolbar
- **Continue**: Press Enter to create a new bullet item
- **Exit**: Press Enter on an empty bullet item to exit the list
- **Indent**: Use Tab to increase indentation, Shift+Tab to decrease
- **Convert**: Select multiple lines and click the bullet button to convert them

### Numbered Lists
- **Create**: Click the numbered list button (1.) or use the toolbar
- **Continue**: Press Enter to create a new numbered item (auto-increments)
- **Exit**: Press Enter on an empty numbered item to exit the list
- **Indent**: Use Tab to increase indentation, Shift+Tab to decrease
- **Convert**: Select multiple lines and click the numbered button to convert them

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Continue list or exit if empty |
| `Tab` | Increase indentation (max 5 levels) |
| `Shift + Tab` | Decrease indentation |
| `Backspace` | Remove list formatting when cursor is at beginning |

### List Behavior

1. **Auto-continuation**: When you press Enter in a list, it automatically continues the list
2. **Smart numbering**: Numbered lists automatically increment (1, 2, 3, etc.)
3. **Indentation levels**: Supports up to 5 levels of indentation
4. **Mixed content**: Lists work seamlessly with formatted text (bold, italic, etc.)
5. **Selection conversion**: Select multiple lines and convert them to lists

### Visual Indicators

- List buttons show active state when cursor is in a list
- Bullet button highlights when in a bullet list
- Numbered button highlights when in a numbered list
- Proper indentation is visually maintained

### Technical Implementation

- Uses contenteditable div with span elements for formatting
- Maintains list structure through text patterns and indentation
- Preserves cursor position during list operations
- Integrates with existing text formatting system
- Handles edge cases like empty list items and list termination

## Usage Examples

### Creating a Bulleted List
1. Click the bullet button (•) in the toolbar
2. Type your first item
3. Press Enter to continue
4. Type your next item
5. Press Enter on an empty item to exit

### Creating a Numbered List
1. Click the numbered button (1.) in the toolbar
2. Type your first item
3. Press Enter to continue (auto-numbers 2, 3, etc.)
4. Type your next item
5. Press Enter on an empty item to exit

### Converting Existing Text
1. Select multiple lines of text
2. Click either bullet or numbered list button
3. Each line becomes a list item

### Indenting List Items
1. Place cursor in a list item
2. Press Tab to increase indentation
3. Press Shift+Tab to decrease indentation
4. Up to 5 levels of indentation supported 