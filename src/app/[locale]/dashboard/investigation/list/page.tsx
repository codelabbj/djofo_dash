"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import styles from "../page.module.css";
import { Plus, Pencil, Trash2 } from "lucide-react";

const exampleInvestigation = [
  {
    id: 1,
    title: "How to investigate with Djofo Dashboard",
    type: 1,
    tags: ["guide", "investigation"],
    files: ["/files/guide.pdf"],
    investigation: "This is a guide to using the investigation module."
  },
  {
    id: 2,
    title: "Investigation Video Tutorial",
    type: 2,
    tags: ["video", "tutorial"],
    files: ["/videos/tutorial.mp4"],
    investigation: "Watch our investigation tutorial."
  },
  {
    id: 3,
    title: "Investigation: Djofo Insights",
    type: 3,
    tags: ["investigation", "insights"],
    files: ["/investigations/insights.pdf"],
    investigation: "Read our investigation insights."
  },
  {
    id: 4,
    title: "Animated Investigation Guide",
    type: 4,
    tags: ["animation", "guide"],
    files: ["/animations/guide.gif"],
    investigation: "See the animated investigation guide."
  },
];

const typeLabels = ["blog", "video", "podcast", "animation"];

export default function InvestigationListPage() {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredInvestigation = exampleInvestigation.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className={styles["content-list-container"]} style={{ 
      marginTop: 40, 
      marginBottom: 40, 
      borderRadius: 12, 
      boxShadow: 'var(--card-shadow)', 
      padding: 32,
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-color)' }} className={styles["content-list-title"]}>{t('investigation.list')}</h2>
        <div className={styles.headerActions}>
          <button
            className={styles.searchButton}
            style={{ minWidth: 160, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => router.push("/dashboard/investigation")}
          >
            <Plus style={{ width: 20, height: 20 }} />
            {t('investigation.create')}
          </button>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          className={styles["form-input"]}
          placeholder={t('common.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320, maxWidth: '100%' }}
        />
      </div>
      {filteredInvestigation.length === 0 ? (
        <div className={styles["no-content"]} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>{t('investigation.messages.noInvestigation')}</div>
      ) : (
        <table className={styles["content-table"]} style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'var(--background-secondary)' }} className={styles["content-table-header-row"]}>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--text-color)', borderTopLeftRadius: 8 }} className={styles["content-table-header"]}>ID</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--text-color)' }} className={styles["content-table-header"]}>{t('common.title')}</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--text-color)' }} className={styles["content-table-header"]}>{t('common.type')}</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--text-color)' }} className={styles["content-table-header"]}>{t('common.tags')}</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--text-color)' }} className={styles["content-table-header"]}>Files</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--text-color)', borderTopRightRadius: 8 }} className={styles["content-table-header"]}>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestigation.map((item, idx) => (
              <tr key={item.id} style={{ 
                background: idx % 2 === 0 ? 'var(--card-bg)' : 'var(--background-secondary)', 
                transition: 'background 0.2s' 
              }} className={styles["content-table-row"]}>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--divider-color)' }} className={styles["content-table-cell"]}>{item.id}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--divider-color)' }} className={styles["content-table-cell"]}>{item.title}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--divider-color)' }} className={styles["content-table-cell"]}>{t(`content.types.${typeLabels[item.type-1]}`)}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--divider-color)' }} className={styles["content-table-cell"]}>{item.tags.join(', ')}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--divider-color)' }} className={styles["content-table-cell"]}>{item.files && item.files.length > 0 ? item.files.map((f, i) => <span key={i} style={{ display: 'inline-block', marginRight: 6 }}>{f}</span>) : '-'}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--divider-color)', display: 'flex', gap: 8, alignItems: 'center' }} className={styles["content-table-cell"]}>
                  <button className={styles.iconButton} title={t('common.edit')}>
                    <Pencil size={18} />
                  </button>
                  <button className={styles.iconButtonDanger} title={t('common.delete')}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 