# Djofo Admin Dashboard

A modern admin dashboard for djofo.bj built with Next.js 15 and React 19.

## Features

- Content Management System
- Rich Text Editor (Lexical)
- File Upload
- Internationalization (i18n)
- Authentication
- Configuration Dialog
- Toast Notifications

## Configuration Dialog

The dashboard includes a configuration dialog that allows users to adjust settings for the editor and content. This is implemented using Radix UI Dialog.

### Usage

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

### Styling

You can style the dialog by adding CSS for `.dialog-overlay` and `.dialog-content` classes.

## Toast Notifications

The dashboard uses `react-hot-toast` for displaying temporary notifications to users.

### Usage

```jsx
import { toast } from 'react-hot-toast';

// On success
toast.success('Content saved successfully!');

// On error
toast.error('Failed to save content.');
```

### Setup

Make sure to include the `<Toaster />` component in your app root:

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

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js 15
- React 19
- Lexical (Rich Text Editor)
- Radix UI
- react-hot-toast
- i18n (next-intl)

## License

MIT
