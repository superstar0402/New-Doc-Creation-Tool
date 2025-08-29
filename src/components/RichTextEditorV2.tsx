import { useEffect, useRef } from "react";

export default function RichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleBeforeInput = (e: any) => {
    // This fires for Enter as "insertParagraph"
    if (e.inputType === "insertParagraph") {
      e.preventDefault();
      
      const sel = window.getSelection?.();
      if (!sel || !sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      
      // Insert <br> element
      const br = document.createElement('br');
      range.deleteContents();
      range.insertNode(br);
      
      // Insert <span> element after <br> for proper caret positioning
      const span = document.createElement('span');
      span.innerHTML = '&nbsp;'; // Add non-breaking space for visible width
      br.parentNode?.insertBefore(span, br.nextSibling);
      
      // Set caret at the beginning of the span
      const newRange = document.createRange();
      newRange.setStart(span, 0);
      newRange.collapse(true);
      
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Shift+Enter = soft break, like Word
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
    
    // Regular Enter key is handled by beforeInput event
    // This ensures consistent behavior across different browsers
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Normalize: ensure top-level children are blocks, not a wrapping <span>
    if (editor.firstChild?.nodeName === "SPAN") {
      const block = document.createElement("div");
      while (editor.firstChild) block.appendChild(editor.firstChild);
      editor.appendChild(block);
    }
    
    // Ensure there's always a visible space for caret positioning
    if (!editor.textContent || editor.textContent.trim() === '') {
      editor.innerHTML = '<div>&nbsp;</div>';
    }
  }, []);

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onBeforeInput={handleBeforeInput}
      onKeyDown={handleKeyDown}
      // Keep formatting features working; avoid nowrap
      style={{ whiteSpace: "pre-wrap", minHeight: "200px", outline: "none" }}
      className="border rounded p-2"
    >
      <div>&nbsp;</div>
    </div>
  );
} 