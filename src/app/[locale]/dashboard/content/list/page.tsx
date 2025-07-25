"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import styles from "../page.module.css";
import { Plus, Pencil, Trash2 } from "lucide-react";

const exampleContent = [
  {
    id: 1,
    title: "How to use Djofo Dashboard",
    type: 1,
    tags: ["guide", "dashboard"],
    files: ["/files/guide.pdf"],
    content: "This is a guide to using the dashboard."
  },
  {
    id: 2,
    title: "Djofo Video Tutorial",
    type: 2,
    tags: ["video", "tutorial"],
    files: ["/videos/tutorial.mp4"],
    content: "Watch our video tutorial."
  },
  {
    id: 3,
    title: "Podcast: Djofo Insights",
    type: 3,
    tags: ["podcast", "insights"],
    files: ["/podcasts/insights.mp3"],
    content: "Listen to our podcast."
  },
  {
    id: 4,
    title: "Animated Walkthrough",
    type: 4,
    tags: ["animation", "walkthrough"],
    files: ["/animations/walkthrough.gif"],
    content: "See the animated walkthrough."
  },
];

const typeLabels = ["blog", "video", "podcast", "animation"];

export default function ContentListPage() {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredContent = exampleContent.filter(item => {
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
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-color)' }} className={styles["content-list-title"]}>{t('content.list')}</h2>
        <div className={styles.headerActions}>
          <button
            className={styles.searchButton}
            style={{ minWidth: 160, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => router.push("/dashboard/content")}
          >
            <Plus style={{ width: 20, height: 20 }} />
            {t('content.create')}
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
      {filteredContent.length === 0 ? (
        <div className={styles["no-content"]} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>{t('content.messages.noContent')}</div>
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
            {filteredContent.map((item, idx) => (
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