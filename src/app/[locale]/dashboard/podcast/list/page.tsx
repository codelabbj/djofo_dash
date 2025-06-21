"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import styles from "../page.module.css";
import { Plus, Pencil, Trash2 } from "lucide-react";

const examplePodcast = [
  {
    id: 1,
    title: "How to create a podcast with Djofo Dashboard",
    type: 1,
    tags: ["guide", "podcast"],
    files: ["/files/guide.pdf"],
    podcast: "This is a guide to using the podcast module."
  },
  {
    id: 2,
    title: "Podcast Video Tutorial",
    type: 2,
    tags: ["video", "tutorial"],
    files: ["/videos/tutorial.mp4"],
    podcast: "Watch our podcast tutorial."
  },
  {
    id: 3,
    title: "Podcast: Djofo Insights",
    type: 3,
    tags: ["podcast", "insights"],
    files: ["/podcasts/insights.mp3"],
    podcast: "Listen to our podcast insights."
  },
  {
    id: 4,
    title: "Animated Podcast Guide",
    type: 4,
    tags: ["animation", "guide"],
    files: ["/animations/guide.gif"],
    podcast: "See the animated podcast guide."
  },
];

const typeLabels = ["blog", "video", "podcast", "animation"];

export default function PodcastListPage() {
  const t = useTranslations();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredPodcast = examplePodcast.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className={styles["content-list-container"]} style={{ marginTop: 40, marginBottom: 40, borderRadius: 12, boxShadow: '0 2px 16px var(--shadow)', padding: 32, background: 'var(--background-secondary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--foreground)' }} className={styles["content-list-title"]}>{t('podcast.list')}</h2>
        <div className={styles.headerActions}>
          <button
            className={styles.searchButton}
            style={{ minWidth: 160, display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => router.push("/dashboard/podcast")}
          >
            <Plus style={{ width: 20, height: 20 }} />
            {t('podcast.create')}
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
          style={{ width: 320, maxWidth: '100%', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
        />
      </div>
      {filteredPodcast.length === 0 ? (
        <div className={styles["no-content"]} style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 32 }}>{t('podcast.messages.noPodcast')}</div>
      ) : (
        <table className={styles["content-table"]} style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: 'var(--background-secondary)' }} className={styles["content-table-header-row"]}>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--foreground)', borderTopLeftRadius: 8 }} className={styles["content-table-header"]}>ID</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--foreground)' }} className={styles["content-table-header"]}>{t('common.title')}</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--foreground)' }} className={styles["content-table-header"]}>{t('common.type')}</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--foreground)' }} className={styles["content-table-header"]}>{t('common.tags')}</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--foreground)' }} className={styles["content-table-header"]}>Files</th>
              <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: 'var(--foreground)', borderTopRightRadius: 8 }} className={styles["content-table-header"]}>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPodcast.map((item, idx) => (
              <tr key={item.id} style={{ background: idx % 2 === 0 ? 'var(--background)' : 'var(--background-secondary)', transition: 'background 0.2s' }} className={styles["content-table-row"]}>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }} className={styles["content-table-cell"]}>{item.id}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }} className={styles["content-table-cell"]}>{item.title}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }} className={styles["content-table-cell"]}>{t(`content.types.${typeLabels[item.type-1]}`)}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }} className={styles["content-table-cell"]}>{item.tags.join(', ')}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--foreground)' }} className={styles["content-table-cell"]}>{item.files && item.files.length > 0 ? item.files.map((f, i) => <span key={i} style={{ display: 'inline-block', marginRight: 6 }}>{f}</span>) : '-'}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' }} className={styles["content-table-cell"]}>
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