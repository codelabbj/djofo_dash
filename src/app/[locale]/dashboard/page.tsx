import React from "react";
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('welcome')}</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t('statistics')}</h3>
          <p>0</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p>0</p>
        </div>
        {/* <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>$0</p>
        </div> */}
      </div>
    </div>
  );
} 