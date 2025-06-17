"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { LexicalEditor } from "@/components/lexical-editor";
import { ConfigDialog } from "@/components/config-dialog";
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/utils/toast';
import { Dialog } from '@radix-ui/react-dialog';

interface ContentItem {
  id: number;
  title: string;
  content: string;
  type: number;
  tags: string[];
  files: string[];
}

export default function ContentCreatePage() {
  const router = useRouter();
  const t = useTranslations();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<number | string>(1);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editorConfig, setEditorConfig] = useState({ readOnly: false });
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [editItem, setEditItem] = useState<ContentItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState(1);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editFiles, setEditFiles] = useState<string[]>([]);
  const [editContent, setEditContent] = useState('');

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      setTags([...tags, e.currentTarget.value.trim()]);
      e.currentTarget.value = "";
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFilesToUpload(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (): Promise<string[]> => {
    const urls: string[] = [];
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError(t('auth.loginError'));
      showToast.error(t('auth.loginError'));
      return [];
    }

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("https://api.djofo.bj/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            urls.push(data.url);
          } else if (data.files && data.files.length > 0) {
            urls.push(data.files[0].url);
          }
          showToast.success(t('content.messages.uploadSuccess'));
        } else {
          const errorData = await response.json();
          const errorMessage = `${t('content.messages.uploadError')}: ${errorData.detail || response.statusText}`;
          setError(errorMessage);
          showToast.error(errorMessage);
          return [];
        }
      } catch {
        // File upload error
        const errorMessage = `${t('content.messages.uploadError')}: ${file.name}`;
        setError(errorMessage);
        showToast.error(errorMessage);
        return [];
      }
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError(t('auth.loginError'));
      showToast.error(t('auth.loginError'));
      setLoading(false);
      return;
    }

    let finalFileUrls: string[] = [];
    if (filesToUpload.length > 0) {
      finalFileUrls = await uploadFiles();
      if (error) {
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("https://api.djofo.bj/api/pubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type: typeof selectedType === 'string' ? parseInt(selectedType) : selectedType,
          title,
          content,
          tags,
          files: finalFileUrls,
        }),
      });

      if (response.ok) {
        setSuccess(t('content.messages.createSuccess'));
        showToast.success(t('content.messages.createSuccess'));
        setTitle("");
        setContent("");
        setTags([]);
        setSelectedType(1);
        setFilesToUpload([]);
        setUploadedFileUrls([]);
        router.push('/dashboard/content');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || response.statusText;
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    } catch {
      // Content creation error
      setError(t('content.messages.createError'));
      showToast.error(t('content.messages.createError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      setLoadingContent(true);
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await fetch('https://api.djofo.bj/api/pubs', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setContentList(Array.isArray(data) ? data : data.results || []);
        } else {
          showToast.error(t('content.messages.fetchError'));
        }
      } catch {
        showToast.error(t('content.messages.fetchError'));
      } finally {
        setLoadingContent(false);
      }
    };
    fetchContent();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('content.messages.deleteConfirm'))) return;
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://api.djofo.bj/api/pubs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        setContentList((prev) => prev.filter((item) => item.id !== id));
        showToast.success(t('content.messages.deleteSuccess'));
      } else {
        showToast.error(t('content.messages.deleteError'));
      }
    } catch {
      showToast.error(t('content.messages.deleteError'));
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditType(item.type);
    setEditTags(item.tags);
    setEditFiles(item.files);
    setEditContent(item.content);
    setEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`https://api.djofo.bj/api/pubs/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...editItem,
          title: editTitle,
          type: editType,
          tags: editTags,
          files: editFiles,
          content: editContent,
        }),
      });
      if (response.ok) {
        const updated = { ...editItem, title: editTitle, type: editType, tags: editTags, files: editFiles, content: editContent };
        setContentList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        showToast.success(t('content.messages.updateSuccess'));
        setEditModalOpen(false);
      } else {
        showToast.error(t('content.messages.updateError'));
      }
    } catch {
      showToast.error(t('content.messages.updateError'));
    }
  };

  return (
    <div className="content-create-page">
      <Toaster position="top-right" />
      <h1>{t('content.create')}</h1>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {t('common.configuration')}
      </button>

      <ConfigDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfigChange={setEditorConfig}
        initialConfig={editorConfig}
      />

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
      <form className="content-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">{t('common.title')}</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contentType">{t('common.type')}</label>
          <select
            id="contentType"
            value={selectedType}
            onChange={(e) => setSelectedType(parseInt(e.target.value))}
            required
          >
            <option value={1}>{t('content.types.blog')}</option>
            <option value={2}>{t('content.types.video')}</option>
            <option value={3}>{t('content.types.podcast')}</option>
            <option value={4}>{t('content.types.animation')}</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tags">{t('common.tags')}</label>
          <div className="tag-input-container">
            {tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="remove-tag-button">x</button>
              </span>
            ))}
            <input
              type="text"
              id="tags"
              placeholder={t('common.tags')}
              onKeyDown={handleTagInput}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="files">{t('common.files')}</label>
          <input
            type="file"
            id="files"
            accept="image/*,video/*,audio/*"
            onChange={handleFileChange}
            multiple
          />
          <div className="file-previews">
            {filesToUpload.map((file, idx) => (
              <p key={idx}>{file.name}</p>
            ))}
            {uploadedFileUrls.map((url, idx) => (
              <p key={`uploaded-${idx}`}>{t('common.upload')}: {url}</p>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="fullContent">{t('common.content')}</label>
          <LexicalEditor value={content} onChange={setContent} readOnly={editorConfig.readOnly} />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? t('common.loading') : t('content.create')}
        </button>
      </form>
      {/* Content List Section */}
      <div className="content-list-container" style={{ marginTop: 40, marginBottom: 40, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', background: '#fff', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>{t('content.list')}</h2>
        </div>
        {loadingContent ? (
          <p>{t('common.loading')}</p>
        ) : contentList.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>{t('content.messages.noContent')}</div>
        ) : (
          <table className="content-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#f7f7fa' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: '#333', borderTopLeftRadius: 8 }}> {t('common.title')} </th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: '#333' }}> {t('common.type')} </th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: '#333' }}> {t('common.tags')} </th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 500, color: '#333', borderTopRightRadius: 8 }}> {t('common.actions')} </th>
              </tr>
            </thead>
            <tbody>
              {contentList.map((item, idx) => (
                <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#f7f7fa', transition: 'background 0.2s' }}>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{item.title}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{t(`content.types.${['blog','video','podcast','animation'][item.type-1]}`)}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>{item.tags.join(', ')}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #eee' }}>
                    <button onClick={() => handleEdit(item)} style={{ marginRight: 8, padding: '6px 14px', borderRadius: 5, border: 'none', background: 'var(--primary-color, #2563eb)', color: '#fff', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}>{t('common.edit')}</button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 14px', borderRadius: 5, border: 'none', background: '#f87171', color: '#fff', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s' }}>{t('common.delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* End Content List Section */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        {editItem && (
          <div className="edit-modal">
            <h3>{t('content.edit')}</h3>
            <form onSubmit={handleUpdate} className="content-form">
              <div className="form-group">
                <label htmlFor="editTitle">{t('common.title')}</label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editType">{t('common.type')}</label>
                <select
                  id="editType"
                  value={editType}
                  onChange={(e) => setEditType(parseInt(e.target.value))}
                  required
                >
                  <option value={1}>{t('content.types.blog')}</option>
                  <option value={2}>{t('content.types.video')}</option>
                  <option value={3}>{t('content.types.podcast')}</option>
                  <option value={4}>{t('content.types.animation')}</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editTags">{t('common.tags')}</label>
                <input
                  type="text"
                  id="editTags"
                  value={editTags.join(', ')}
                  onChange={(e) => setEditTags(e.target.value.split(',').map(tag => tag.trim()))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editFiles">{t('common.files')}</label>
                <input
                  type="text"
                  id="editFiles"
                  value={editFiles.join(', ')}
                  onChange={(e) => setEditFiles(e.target.value.split(',').map(f => f.trim()))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editContent">{t('common.content')}</label>
                <LexicalEditor value={editContent} onChange={setEditContent} />
              </div>
              <button type="submit" className="submit-button">
                {t('common.save')}
              </button>
            </form>
          </div>
        )}
      </Dialog>
    </div>
  );
} 