# Dashboard Features Documentation

## Configuration Dialog and Toast Message Display

### 1. Configuration Dialog
A configuration dialog is typically a modal or popup that allows users to adjust settings (for the editor, content, etc.). In a modern React/Next.js app, you can use:
- **Radix UI Dialog** (you already have `@radix-ui/react-dialog` installed)
- Or a simple custom modal component

**Common uses:**  
- Editor settings (font size, theme, etc.)
- Content publishing options
- Confirmation dialogs

**Example usage with Radix UI:**
```jsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <button>Open Config</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="dialog-overlay" />
    <Dialog.Content className="dialog-content">
      <Dialog.Title>Configuration</Dialog.Title>
      {/* Your config form here */}
      <Dialog.Close asChild>
        <button>Close</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```
You can style `.dialog-overlay` and `.dialog-content` in your CSS.

### 2. Toast Message Display
Toast messages are small notifications that appear temporarily, usually at the bottom or top of the screen, to inform users of success, errors, or other events.

You already have `react-hot-toast` installed, which is a great choice!

**Example usage:**
```jsx
import { toast } from 'react-hot-toast';

// On success
toast.success('Content saved successfully!');

// On error
toast.error('Failed to save content.');
```
You can call these in your API handlers, form submissions, etc.

**To display the toasts, make sure you have the Toaster component in your app root:**
```jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* ...rest of your app */}
    </>
  );
}
```

### Implementation Notes
- The configuration dialog is currently implemented in the content creation page (`src/app/[locale]/dashboard/content/page.tsx`)
- Toast notifications are used throughout the application for user feedback
- Both features are styled to match the application's theme
- The configuration dialog currently supports toggling read-only mode for the editor
- Toast notifications are positioned at the top-right of the screen 