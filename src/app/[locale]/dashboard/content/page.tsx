"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/utils/toast';
import { Dialog } from '@radix-ui/react-dialog';
import { X, Video, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Image, Table } from 'lucide-react';
import React, { useRef } from 'react';
import styles from './page.module.css';

interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// --- TagInput Component ---
type TagInputProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
};
const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={`tag-input-wrapper${isInputFocused ? ' focused' : ''}`}>
      <div className="tag-input-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag-chip">
            {tag}
            <button
              type="button"
              className="tag-remove"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          className="tag-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setIsInputFocused(false);
            if (inputValue.trim()) addTag();
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      </div>
    </div>
  );
};

// --- RichTextEditor Component ---
type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type ToolbarButtonProps = {
  icon: React.ElementType;
  command?: string;
  value?: string;
  isActive?: boolean;
  title: string;
  onClick?: () => void;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'video' | 'link' | 'image' | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const t = useTranslations();
  // const lastValueRef = useRef<string>("");

  // Set initial value only on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  const openUrlModal = (type: 'video' | 'link' | 'image') => {
    setModalType(type);
    setUrlInput('');
    setModalOpen(true);
  };

  const handleInsertUrl = () => {
    if (!urlInput) return;
    if (modalType === 'video') {
      insertVideo(urlInput);
    } else if (modalType === 'link') {
      execCommand('createLink', urlInput);
    } else if (modalType === 'image') {
      execCommand('insertImage', urlInput);
    }
    setModalOpen(false);
    setUrlInput('');
  };

  const insertVideo = (url: string) => {
    let embedCode = '';
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const videoId = match ? match[1] : null;
      if (videoId) {
        embedCode = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;">
          <iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>`;
      }
    } else if (url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      const videoId = match ? match[1] : null;
      if (videoId) {
        embedCode = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;">
          <iframe src="https://player.vimeo.com/video/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>`;
      }
    } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
      embedCode = `<video controls style=\"width: 100%; max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;\"><source src=\"${url}\" type=\"video/${url.split('.').pop()}\">${t('common.browserVideoSupport')}</video>`;
    } else {
      embedCode = `<div class="video-link" style="padding: 16px; background: #f3f4f6; border-radius: 8px; margin: 16px 0; text-align: center;">
        <p style="margin: 0; color: #6b7280;">📹 Video: <a href="${url}" target="_blank" style="color: #3b82f6; text-decoration: none;">${url}</a></p>
      </div>`;
    }
    if (embedCode) execCommand('insertHTML', embedCode);
  };

  const execCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (value !== undefined) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command);
    }
    updateActiveFormats();
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    if (document.queryCommandState('justifyLeft')) formats.add('left');
    if (document.queryCommandState('justifyCenter')) formats.add('center');
    if (document.queryCommandState('justifyRight')) formats.add('right');
    setActiveFormats(formats);
  };

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, command, value, isActive, title, onClick }) => (
    <button
      type="button"
      className={`toolbar-btn${isActive ? ' active' : ''}`}
      onClick={onClick || (() => execCommand(command!, value))}
      title={title}
      tabIndex={-1}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="rich-editor-container">
      <div className="rich-editor-toolbar">
        <div className="toolbar-group">
          <ToolbarButton icon={Bold} command="bold" isActive={activeFormats.has('bold')} title="Bold" />
          <ToolbarButton icon={Italic} command="italic" isActive={activeFormats.has('italic')} title="Italic" />
          <ToolbarButton icon={Underline} command="underline" isActive={activeFormats.has('underline')} title="Underline" />
        </div>
        <div className="toolbar-separator" />
        <div className="toolbar-group">
          <select className="font-select" onChange={(e) => execCommand('fontName', e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
          </select>
          <select className="size-select" onChange={(e) => execCommand('fontSize', e.target.value)}>
            <option value="1">10px</option>
            <option value="2">13px</option>
            <option value="3">16px</option>
            <option value="4">18px</option>
            <option value="5">24px</option>
            <option value="6">32px</option>
            <option value="7">48px</option>
          </select>
        </div>
        <div className="toolbar-separator" />
        <div className="toolbar-group">
          <ToolbarButton icon={List} command="insertUnorderedList" isActive={activeFormats.has('ul')} title="Bullet List" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" isActive={activeFormats.has('ol')} title="Numbered List" />
        </div>
        <div className="toolbar-separator" />
        <div className="toolbar-group">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" isActive={activeFormats.has('left')} title="Align Left" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" isActive={activeFormats.has('center')} title="Align Center" />
          <ToolbarButton icon={AlignRight} command="justifyRight" isActive={activeFormats.has('right')} title="Align Right" />
        </div>
        <div className="toolbar-separator" />
        <div className="toolbar-group">
          <ToolbarButton icon={Video} title="Insert Video" onClick={() => openUrlModal('video')} />
          <ToolbarButton icon={Link} title="Insert Link" onClick={() => openUrlModal('link')} />
          <ToolbarButton icon={Image} title="Insert Image" onClick={() => openUrlModal('image')} />
          <ToolbarButton icon={Table} command="insertHTML" value="<table border='1'><tr><td>Cell 1</td><td>Cell 2</td></tr></table>" title="Insert Table" />
        </div>
      </div>
      <div
        ref={editorRef}
        className="rich-editor-content"
        contentEditable
        onInput={handleInput}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        suppressContentEditableWarning={true}
        style={{ minHeight: 200 }}
      />
      {/* Modal for URL input */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <div className="modal-backdrop" style={{ display: modalOpen ? 'block' : 'none' }}>
          <div className="modal-content" style={{ padding: 24, borderRadius: 12, maxWidth: 400, margin: '10% auto', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: 16 }}>
              {modalType === 'video' && 'Insert Video URL'}
              {modalType === 'link' && 'Insert Link URL'}
              {modalType === 'image' && 'Insert Image URL'}
            </h3>
            <input
              type="text"
              className="form-input"
              placeholder="Paste URL here..."
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              style={{ width: '100%', marginBottom: 16 }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="submit-button" type="button" onClick={handleInsertUrl} style={{ minWidth: 100 }}>
                Insert
              </button>
              <button className="submit-button" type="button" onClick={() => setModalOpen(false)} style={{ background: '#eee', color: '#333', minWidth: 100 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

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
  const [fileTab, setFileTab] = useState<'upload' | 'library' | 'link'>('upload');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedLibraryFiles, setSelectedLibraryFiles] = useState<MediaFile[]>([]);
  const [linkInput, setLinkInput] = useState('');

  // Fetch media files for library tab
  useEffect(() => {
    if (fileTab === 'library' && mediaFiles.length === 0) {
      const fetchMedia = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        const response = await fetch('https://api.djofo.bj/api/media', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          setMediaFiles(data);
        }
      };
      fetchMedia();
    }
  }, [fileTab, mediaFiles.length]);

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

  return (
    <div className={styles["content-create-page"]}>
      <Toaster position="top-right" />
      <h1>{t('content.create')}</h1>
      {success && <p className={styles["success-message"]}>{success}</p>}
      {error && <p className={styles["error-message"]}>{error}</p>}
      <form className={styles["content-form"]} onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="title">{t('common.title')}</label>
          <input
            type="text"
            id="title"
            className={styles["form-input"]}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('common.title')}
            required
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="contentType">{t('common.type')}</label>
          <select
            id="contentType"
            className={styles["form-select"]}
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
        <div className={styles["form-group"]}>
          <label htmlFor="tags">{t('common.tags')}</label>
          <TagInput
            tags={tags}
            onTagsChange={setTags}
            placeholder={t('common.tags')}
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="files">{t('common.files')}</label>
          <div className={styles["tab-bar"]}>
            <button
              type="button"
              className={fileTab === 'upload' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setFileTab('upload')}
            >
              {t('content.uploadFile')}
            </button>
            <button
              type="button"
              className={fileTab === 'library' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setFileTab('library')}
            >
              {t('content.mediaLibrary')}
            </button>
            <button
              type="button"
              className={fileTab === 'link' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setFileTab('link')}
            >
              {t('content.addByLink')}
            </button>
          </div>
          {fileTab === 'upload' && (
            <div>
              <input
                type="file"
                id="files"
                className={styles["file-input"]}
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                multiple
              />
              <div className={styles["file-previews"]}>
                {filesToUpload.map((file, idx) => (
                  <div key={idx} className={styles["file-preview"]}>{file.name}</div>
                ))}
              </div>
            </div>
          )}
          {fileTab === 'library' && (
            <div>
              <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 8, background: '#fafbfc' }}>
                {mediaFiles.length === 0 ? (
                  <div style={{ color: '#888', textAlign: 'center', padding: 16 }}>{t('content.messages.noContent')}</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {mediaFiles.map((file) => (
                      <div
                        key={file.id}
                        style={{ border: selectedLibraryFiles.includes(file) ? '2px solid var(--benin-green)' : '1px solid #ddd', borderRadius: 8, padding: 8, cursor: 'pointer', background: '#fff', minWidth: 80 }}
                        onClick={() => setSelectedLibraryFiles((prev) => prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file])}
                      >
                        <div style={{ fontSize: 12, marginBottom: 4 }}>{file.name}</div>
                        <div style={{ fontSize: 10, color: '#888' }}>{file.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles["file-previews"]}>
                {selectedLibraryFiles.map((file, idx) => (
                  <div key={idx} className={styles["file-preview"]}>{file.name}</div>
                ))}
              </div>
            </div>
          )}
          {fileTab === 'link' && (
            <div>
              <input
                type="text"
                className={styles["form-input"]}
                placeholder={t('content.pasteLink')}
                value={linkInput}
                onChange={e => setLinkInput(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <button type="button" className={styles["submit-button"]} style={{ width: 'auto', padding: '8px 18px', fontSize: 14 }} onClick={() => {
                if (linkInput.trim()) {
                  setUploadedFileUrls(prev => [...prev, linkInput.trim()]);
                  setLinkInput('');
                }
              }}>{t('common.add')}</button>
              <div className={styles["file-previews"]}>
                {uploadedFileUrls.map((url, idx) => (
                  <div key={idx} className={styles["file-preview"]}>{t('common.link')}: {url}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="fullContent">{t('common.content')}</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>
        <button type="submit" className={styles["submit-button"]} disabled={loading}>
          {loading ? t('common.loading') : t('content.create')}
        </button>
      </form>
    </div>
  );
}