import { useTranslations } from 'next-intl'

export default function TestTranslationPage() {
  const t = useTranslations('common')

  return (
    <div style={{ padding: '20px' }}>
      <h1>Translation Test Page</h1>
      <p>This page tests if the translation system is working correctly.</p>
      
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Translation Results:</h3>
        <p><strong>Welcome message:</strong> {t('welcome', { fallback: 'Welcome (fallback)' })}</p>
        <p><strong>Dashboard title:</strong> {t('dashboard', { fallback: 'Dashboard (fallback)' })}</p>
        <p><strong>Content title:</strong> {t('content', { fallback: 'Content (fallback)' })}</p>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Debug Information:</h3>
        <p>If you see fallback messages above, it means the translation files are not being loaded correctly.</p>
        <p>If you see actual translated text, the system is working properly.</p>
      </div>
    </div>
  )
} 