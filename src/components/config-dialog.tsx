import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { showToast } from '@/utils/toast';

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigChange: (config: { readOnly: boolean }) => void;
  initialConfig: { readOnly: boolean };
}

export function ConfigDialog({ open, onOpenChange, onConfigChange, initialConfig }: ConfigDialogProps) {
  const t = useTranslations();
  const [config, setConfig] = useState(initialConfig);

  const handleConfigChange = (key: keyof typeof config, value: boolean) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
    showToast.success(t('editor.readOnly') + ' ' + (value ? t('common.enabled') : t('common.disabled')));
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          position: 'fixed',
          inset: 0,
          zIndex: 1000
        }} />
        <Dialog.Content className="dialog-content" style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '450px',
          maxHeight: '85vh',
          padding: '20px',
          zIndex: 1001
        }}>
          <Dialog.Title style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'var(--text-color)'
          }}>
            {t('common.configuration')}
          </Dialog.Title>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-color)'
            }}>
              <input
                type="checkbox"
                checked={config.readOnly}
                onChange={(e) => handleConfigChange('readOnly', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              {t('editor.readOnly')}
            </label>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px'
          }}>
            <Dialog.Close asChild>
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-color)',
                  cursor: 'pointer'
                }}
              >
                {t('common.close')}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 