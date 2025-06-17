"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ToolbarPlugin } from "@lexical/react/LexicalToolbarPlugin";
import { HeadingNode, $createHeadingNode } from "@lexical/rich-text";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LinkNode } from "@lexical/link";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection, EditorState } from "lexical";

// Lexical Theme (can be expanded later)
const theme = {
  // Example styles - you'll likely want to add more
  // These will be basic for now, matching your globals.css as much as possible
  root: "lexical-editor-root",
  contentEditable: "lexical-content-editable",
  placeholder: "lexical-placeholder",
};

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  return (
    <div className="lexical-toolbar">
      <button type="button" onClick={() => editor.dispatchCommand('bold', undefined)}><b>B</b></button>
      <button type="button" onClick={() => editor.dispatchCommand('italic', undefined)}><i>I</i></button>
      <button type="button" onClick={() => editor.dispatchCommand('underline', undefined)}><u>U</u></button>
      <button type="button" onClick={() => editor.dispatchCommand('insertUnorderedList', undefined)}>• List</button>
      <button type="button" onClick={() => editor.dispatchCommand('insertOrderedList', undefined)}>1. List</button>
      <button type="button" onClick={() => editor.dispatchCommand('insertLink', { url: prompt('Enter URL') || '' })}>🔗</button>
      <button type="button" onClick={() => editor.dispatchCommand('formatHeading', { level: 1 })}>H1</button>
      <button type="button" onClick={() => editor.dispatchCommand('formatHeading', { level: 2 })}>H2</button>
    </div>
  );
}

function HtmlSyncPlugin({ onHtmlChange }: { onHtmlChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  return (
    <OnChangePlugin
      onChange={(editorState: EditorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onHtmlChange(html);
        });
      }}
    />
  );
}

interface LexicalEditorProps {
  value: string; // HTML string
  onChange: (value: string) => void; // Callback for HTML string
  readOnly?: boolean;
}

export const LexicalEditor = ({ value, onChange, readOnly = false }: LexicalEditorProps) => {
  const initialConfig = {
    namespace: "RichTextEditor",
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
    editorState: (editor: unknown) => {
      if (value) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");
        editor.update(() => {
          const nodes = $generateNodesFromDOM(editor, dom);
          $getRoot().clear();
          $getRoot().append(...nodes);
        });
      }
    },
  };

  return (
    <div className="lexical-editor-container" style={{ border: "1px solid var(--header-border)", borderRadius: "4px", background: "var(--card-bg)", padding: 0 }}>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="lexical-content-editable" style={{ minHeight: 200, padding: 12 }} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <HtmlSyncPlugin onHtmlChange={onChange} />
      </LexicalComposer>
    </div>
  );
}; 