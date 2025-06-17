import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'var(--success-color)',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'var(--error-color)',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
  loading: (message: string) => {
    toast.loading(message, {
      position: 'top-right',
      style: {
        background: 'var(--loading-color)',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
}; 