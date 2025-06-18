"use client";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from 'next-intl';
import { showToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';
import Image from 'next/image';

interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export default function MediaLibraryPage() {
  const t = useTranslations();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchMediaFiles = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        showToast.error(t('auth.loginError'));
        return;
      }

      const response = await fetch("https://api.djofo.bj/api/media", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        showToast.error(t('common.error'));
      }
    } catch (error) {
      console.error("Error fetching media files:", error);
      showToast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMediaFiles();
  }, [fetchMediaFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      showToast.error(t('media.noFilesSelected'));
      return;
    }

    setUploading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      showToast.error(t('auth.loginError'));
      setUploading(false);
      return;
    }

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("https://api.djofo.bj/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      showToast.success(t('media.uploadSuccess'));
      setSelectedFiles([]);
      fetchMediaFiles(); // Refresh the file list
    } catch (error) {
      console.error("Upload error:", error);
      showToast.error(t('media.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm(t('media.deleteConfirm'))) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showToast.error(t('auth.loginError'));
      return;
    }

    try {
      const response = await fetch(`https://api.djofo.bj/api/media/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        showToast.success(t('media.deleteSuccess'));
        setFiles(files.filter(file => file.id !== fileId));
      } else {
        showToast.error(t('media.deleteError'));
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast.error(t('media.deleteError'));
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type.startsWith(filterType);
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="media-library-page">
      <Toaster position="top-right" />
      <h1>{t('media.title')}</h1>

      <div className="upload-section" style={{ marginBottom: '2rem' }}>
        <div className="upload-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ flex: 1 }}
          />
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {uploading ? t('common.loading') : t('media.upload')}
          </button>
        </div>
        {selectedFiles.length > 0 && (
          <div className="selected-files">
            <h3>{t('media.selectedFiles')}:</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="filters" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          placeholder={t('media.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
        >
          <option value="all">{t('media.allTypes')}</option>
          <option value="image">{t('media.images')}</option>
          <option value="video">{t('media.videos')}</option>
          <option value="audio">{t('media.audio')}</option>
        </select>
      </div>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <div className="media-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {filteredFiles.map((file) => (
            <div key={file.id} className="media-item" style={{
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1rem',
              position: 'relative'
            }}>
              {file.type.startsWith('image/') ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    width={200}
                    height={150}
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                ) : (
                <div className="file-preview" style={{
                  width: '100%',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: '4px'
                }}>
                  {file.type.startsWith('video/') ? '🎥' : '📄'}
                </div>
              )}
              <div className="file-info" style={{ marginTop: '0.5rem' }}>
                <p style={{ margin: '0.5rem 0', wordBreak: 'break-all' }}>{file.name}</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {formatFileSize(file.size)}
                </p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  padding: '4px 8px',
                  backgroundColor: 'var(--error-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {t('common.delete')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 