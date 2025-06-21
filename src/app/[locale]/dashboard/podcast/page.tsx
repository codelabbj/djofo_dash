"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/utils/toast';
import { Dialog } from '@radix-ui/react-dialog';
import { X, Video, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, Image, Table, Play, Pause, Upload, Music, Mic } from 'lucide-react';
import styles from "./page.module.css";

// Define MediaFile interface
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

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const t = useTranslations();
  
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
              aria-label={t('common.removeTag', { tag })}
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
          placeholder={tags.length === 0 ? (placeholder || t('common.tags')) : ''}
        />
      </div>
    </div>
  );
};

// --- Audio Preview Component ---
type AudioPreviewProps = {
  audioUrl: string;
  title: string;
};

const AudioPreview: React.FC<AudioPreviewProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = useTranslations();

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * duration;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      background: 'var(--card-bg)', 
      border: '1px solid var(--card-border)', 
      borderRadius: '12px', 
      padding: '16px', 
      margin: '8px 0' 
    }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={togglePlay}
          style={{
            background: 'var(--button-primary-bg)',
            color: 'var(--button-primary-text)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
            {title || t('podcast.audioPreview')}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '40px' }}>
              {formatTime(currentTime)}
            </span>
            
            <div
              style={{
                flex: 1,
                height: '4px',
                background: 'var(--background-secondary)',
                borderRadius: '2px',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={handleProgressClick}
            >
              <div
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  height: '100%',
                  background: 'var(--button-primary-bg)',
                  borderRadius: '2px'
                }}
              />
            </div>
            
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '40px' }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
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

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

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
        embedCode = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div>`;
      }
    } else if (url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      const videoId = match ? match[1] : null;
      if (videoId) {
        embedCode = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;"><iframe src="https://player.vimeo.com/video/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div>`;
      }
    } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
      embedCode = `<video controls style="width: 100%; max-width: 100%; height: auto; margin: 16px 0; border-radius: 8px;"><source src="${url}" type="video/${url.split('.').pop()}">${t('common.browserVideoSupport')}</video>`;
    } else {
      embedCode = `<div class="video-link" style="padding: 16px; background: var(--background-secondary); border-radius: 8px; margin: 16px 0; text-align: center;"><p style="margin: 0; color: var(--text-secondary);">📹 Video: <a href="${url}" target="_blank" style="color: var(--button-primary-bg); text-decoration: none;">${url}</a></p></div>`;
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
          <ToolbarButton icon={Bold} command="bold" isActive={activeFormats.has('bold')} title={t('common.bold')} />
          <ToolbarButton icon={Italic} command="italic" isActive={activeFormats.has('italic')} title={t('common.italic')} />
          <ToolbarButton icon={Underline} command="underline" isActive={activeFormats.has('underline')} title={t('common.underline')} />
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
          <ToolbarButton icon={List} command="insertUnorderedList" isActive={activeFormats.has('ul')} title={t('common.bulletList')} />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" isActive={activeFormats.has('ol')} title={t('common.numberedList')} />
        </div>
        <div className="toolbar-separator" />
        <div className="toolbar-group">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" isActive={activeFormats.has('left')} title={t('common.alignLeft')} />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" isActive={activeFormats.has('center')} title={t('common.alignCenter')} />
          <ToolbarButton icon={AlignRight} command="justifyRight" isActive={activeFormats.has('right')} title={t('common.alignRight')} />
        </div>
        <div className="toolbar-separator" />
        <div className="toolbar-group">
          <ToolbarButton icon={Video} title={t('common.insertVideo')} onClick={() => openUrlModal('video')} />
          <ToolbarButton icon={Link} title={t('common.insertLink')} onClick={() => openUrlModal('link')} />
          <ToolbarButton icon={Image} title={t('common.insertImage')} onClick={() => openUrlModal('image')} />
          <ToolbarButton icon={Table} command="insertHTML" value="<table border='1'><tr><td>Cell 1</td><td>Cell 2</td></tr></table>" title={t('common.insertTable')} />
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
              {modalType === 'video' && t('common.insertVideoUrl')}
              {modalType === 'link' && t('common.insertLinkUrl')}
              {modalType === 'image' && t('common.insertImageUrl')}
            </h3>
            <input
              type="text"
              className="form-input"
              placeholder={t('common.pasteUrlHere')}
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              style={{ width: '100%', marginBottom: 16 }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="submit-button" type="button" onClick={handleInsertUrl} style={{ minWidth: 100 }}>
                {t('common.insert')}
              </button>
              <button className="submit-button" type="button" onClick={() => setModalOpen(false)} style={{ background: 'var(--background-secondary)', color: 'var(--text-color)', minWidth: 100 }}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default function PodcastPage() {
  const router = useRouter();
  const t = useTranslations();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [duration, setDuration] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<number | string>(3); // Default to podcast
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileTab, setFileTab] = useState<'upload' | 'library' | 'link'>('upload');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedLibraryFiles, setSelectedLibraryFiles] = useState<MediaFile[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (fileTab === 'library' && mediaFiles.length === 0) {
      const fetchMedia = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;
        try {
          const response = await fetch('https://api.djofo.bj/api/media', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (response.ok) {
            const data = await response.json();
            setMediaFiles(data);
          }
        } catch (error) {
          console.error('Error fetching media:', error);
        }
      };
      fetchMedia();
    }
  }, [fileTab, mediaFiles.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFilesToUpload(files);
      
      // Create preview URL for audio files
      const audioFile = files.find(file => file.type.startsWith('audio/'));
      if (audioFile) {
        const url = URL.createObjectURL(audioFile);
        setAudioPreviewUrl(url);
      }
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
          showToast.success(t('podcast.messages.uploadSuccess'));
        } else {
          const errorData = await response.json();
          const errorMessage = `${t('podcast.messages.uploadError')}: ${errorData.detail || response.statusText}`;
          setError(errorMessage);
          showToast.error(errorMessage);
          return [];
        }
      } catch {
        const errorMessage = `${t('podcast.messages.uploadError')}: ${file.name}`;
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

    let finalFileUrls: string[] = [...uploadedFileUrls];
    
    // Upload new files
    if (filesToUpload.length > 0) {
      const newUrls = await uploadFiles();
      if (error) {
        setLoading(false);
        return;
      }
      finalFileUrls = [...finalFileUrls, ...newUrls];
    }
    
    // Add selected library files
    if (selectedLibraryFiles.length > 0) {
      finalFileUrls = [...finalFileUrls, ...selectedLibraryFiles.map(file => file.url)];
    }

    try {
      const response = await fetch("https://api.djofo.bj/api/podcasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          type: typeof selectedType === 'string' ? parseInt(selectedType) : selectedType,
          title,
          description,
          podcast: fullDescription,
          episodeNumber: episodeNumber ? parseInt(episodeNumber) : undefined,
          duration,
          publishDate: publishDate || undefined,
          tags,
          files: finalFileUrls,
        }),
      });

      if (response.ok) {
        setSuccess(t('podcast.messages.createSuccess'));
        showToast.success(t('podcast.messages.createSuccess'));
        
        // Reset form
        setTitle("");
        setDescription("");
        setFullDescription("");
        setEpisodeNumber("");
        setDuration("");
        setPublishDate("");
        setTags([]);
        setSelectedType(3);
        setFilesToUpload([]);
        setUploadedFileUrls([]);
        setSelectedLibraryFiles([]);
        setAudioPreviewUrl('');
        
        router.push('/dashboard/podcast');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || response.statusText;
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    } catch {
      setError(t('podcast.messages.createError'));
      showToast.error(t('podcast.messages.createError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["content-create-page"]}>
      <Toaster position="top-right" />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ 
          background: '#006b30', 
          borderRadius: '12px', 
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Mic size={24} color="white" />
        </div>
        <h1 style={{ margin: 0 }}>{t('podcast.create')} - Audio Podcast</h1>
      </div>

      {success && <p className={styles["success-message"]}>{success}</p>}
      {error && <p className={styles["error-message"]}>{error}</p>}

      <form className={styles["content-form"]} onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-color)' }}>{t('podcast.episodeInformation')}</h3>
          
          <div className={styles["form-group"]}>
            <label htmlFor="title">{t('common.title')} *</label>
            <input
              type="text"
              id="title"
              className={styles["form-input"]}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('podcast.titlePlaceholder')}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className={styles["form-group"]}>
              <label htmlFor="episodeNumber">{t('podcast.episodeNumber')}</label>
              <input
                type="number"
                id="episodeNumber"
                className={styles["form-input"]}
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(e.target.value)}
                placeholder={t('podcast.episodeNumberPlaceholder')}
              />
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="duration">{t('podcast.duration')}</label>
              <input
                type="text"
                id="duration"
                className={styles["form-input"]}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={t('podcast.durationPlaceholder')}
              />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="publishDate">{t('podcast.publishDate')}</label>
            <input
              type="date"
              id="publishDate"
              className={styles["form-input"]}
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="description">{t('podcast.shortDescription')}</label>
            <textarea
              id="description"
              className={styles["form-input"]}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('podcast.descriptionPlaceholder')}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Audio File Upload */}
        <div style={{ 
          background: 'var(--background-secondary)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={20} />
            {t('podcast.audioFile')}
          </h3>
          
          <div className={styles["tab-bar"]}>
            <button
              type="button"
              className={fileTab === 'upload' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setFileTab('upload')}
            >
              <Upload size={16} style={{ marginRight: '4px' }} />
              {t('podcast.uploadFile')}
            </button>
            <button
              type="button"
              className={fileTab === 'library' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setFileTab('library')}
            >
              {t('podcast.mediaLibrary')}
            </button>
            <button
              type="button"
              className={fileTab === 'link' ? styles.activeTab : styles.inactiveTab}
              onClick={() => setFileTab('link')}
            >
              {t('podcast.addByLink')}
            </button>
          </div>

          {fileTab === 'upload' && (
            <div>
              <input
                type="file"
                id="files"
                className={styles["file-input"]}
                accept="audio/*,video/*"
                onChange={handleFileChange}
                multiple
              />
              
              {audioPreviewUrl && (
                <AudioPreview audioUrl={audioPreviewUrl} title={title || 'Audio Preview'} />
              )}
              
              <div className={styles["file-previews"]}>
                {filesToUpload.map((file, idx) => (
                  <div key={idx} className={styles["file-preview"]} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {file.type.startsWith('audio/') ? <Music size={16} /> : <Video size={16} />}
                    {file.name}
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fileTab === 'library' && (
            <div>
              <div style={{ 
                maxHeight: 200, 
                overflowY: 'auto', 
                border: '1px solid #eee', 
                borderRadius: 8, 
                padding: 8, 
                background: '#fff' 
              }}>
                {mediaFiles.length === 0 ? (
                  <div style={{ color: '#888', textAlign: 'center', padding: 16 }}>
                    {t('podcast.messages.noPodcast')}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                    {mediaFiles.filter(file => file.type.startsWith('audio/') || file.type.startsWith('video/')).map((file) => (
                      <div
                        key={file.id}
                        style={{ 
                          border: selectedLibraryFiles.includes(file) ? '2px solid #007bff' : '1px solid #ddd', 
                          borderRadius: 8, 
                          padding: 12, 
                          cursor: 'pointer', 
                          background: selectedLibraryFiles.includes(file) ? '#f0f8ff' : '#fff',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setSelectedLibraryFiles((prev) => 
                          prev.includes(file) ? prev.filter(f => f !== file) : [...prev, file]
                        )}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 4 }}>
                          {file.type.startsWith('audio/') ? <Music size={16} /> : <Video size={16} />}
                          <div style={{ fontSize: 12, fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {file.name}
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: '#888' }}>
                          {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles["file-previews"]}>
                {selectedLibraryFiles.map((file, idx) => (
                  <div key={idx} className={styles["file-preview"]} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {file.type.startsWith('audio/') ? <Music size={16} /> : <Video size={16} />}
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {fileTab === 'link' && (
            <div>
              <input
                type="text"
                className={styles["form-input"]}
                placeholder={t('podcast.pasteAudioUrl')}
                value={linkInput}
                onChange={e => setLinkInput(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <button 
                type="button" 
                className={styles["submit-button"]} 
                style={{ width: 'auto', padding: '8px 18px', fontSize: 14 }} 
                onClick={() => {
                  if (linkInput.trim()) {
                    setUploadedFileUrls(prev => [...prev, linkInput.trim()]);
                    setLinkInput('');
                  }
                }}
              >
                {t('common.add')}
              </button>
              
              <div className={styles["file-previews"]}>
                {uploadedFileUrls.map((url, idx) => (
                  <div key={idx} className={styles["file-preview"]} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link size={16} />
                    {t('common.link')}: {url}
                    <button
                      type="button"
                      onClick={() => setUploadedFileUrls(prev => prev.filter((_, i) => i !== idx))}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#dc3545', 
                        cursor: 'pointer',
                        marginLeft: 'auto'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category & Tags */}
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-color)' }}>{t('podcast.categoriesTags')}</h3>
          
          <div className={styles["form-group"]}>
            <label htmlFor="podcastType">{t('common.type')}</label>
            <select
              id="podcastType"
              className={styles["form-select"]}
              value={selectedType}
              onChange={(e) => setSelectedType(parseInt(e.target.value))}
              required
            >
              <option value={1}>{t('podcast.types.blog')}</option>
              <option value={2}>{t('podcast.types.video')}</option>
              <option value={3}>{t('podcast.types.podcast')}</option>
              <option value={4}>{t('podcast.types.animation')}</option>
            </select>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="tags">{t('common.tags')}</label>
            <TagInput
              tags={tags}
              onTagsChange={setTags}
              placeholder={t('podcast.addTagsPlaceholder')}
            />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              {t('podcast.tagsHelp')}
            </small>
          </div>
        </div>

        {/* Show Notes / Full Description */}
        <div style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--card-border)', 
          borderRadius: '12px', 
          padding: '20px', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--text-color)' }}>{t('podcast.showNotes')}</h3>
          
          <div className={styles["form-group"]}>
            <label htmlFor="fullDescription">{t('podcast.episodeDescription')}</label>
            <RichTextEditor value={fullDescription} onChange={setFullDescription} />
            <small style={{ color: '#6c757d', fontSize: '12px' }}>
              {t('podcast.showNotesHelp')}
            </small>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '20px',
          borderTop: '1px solid #e9ecef'
        }}>
          
          
          <button 
            type="submit" 
            className={styles["submit-button"]} 
            disabled={loading}
            style={{ 
              
              alignItems: 'center', 
              gap: '8px',
              padding: '12px 32px',
              fontSize: '16px'
            }}
          >
            {loading ? (
              <>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid #ffffff40',
                  borderTop: '2px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                {t('common.loading')}
              </>
            ) : (
              <>
                <Mic size={16} />
                {t('podcast.create')}
              </>
            )}
          </button>
        </div>
        <button 
            type="button" 
            onClick={() => router.back()}
            style={{ 
              background: 'none', 
              border: '1px solid #6c757d', 
              color: '#6c757d',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {t('common.cancel')}
          </button>
      </form>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}