"use client";
import { useState, useEffect, useCallback } from "react";
import { Upload, Trash2, FileText, Video, FileImage } from "lucide-react";
import { useTranslations } from 'next-intl';
import { showToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';

interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// Sample data for demonstration
const sampleFiles: MediaFile[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    name: "2503230363725l.png",
    type: "image/png",
    size: 373000,
    uploadedAt: "2024-06-15T10:30:00Z"
  },
  {
    id: "2",
    url: "/api/placeholder/400/300",
    name: "Govt Holiday Calendar 20...",
    type: "application/pdf",
    size: 363930,
    uploadedAt: "2024-06-14T14:20:00Z"
  },
  {
    id: "3",
    url: "/api/placeholder/400/300",
    name: "11 Remote Jobs In Tech Tha...",
    type: "application/pdf",
    size: 1700000,
    uploadedAt: "2024-06-13T09:15:00Z"
  },
  {
    id: "4",
    url: "/api/placeholder/400/300",
    name: "11 Remote Jobs In Tech Tha...",
    type: "application/pdf",
    size: 1700000,
    uploadedAt: "2024-06-12T16:45:00Z"
  },
  {
    id: "5",
    url: "/api/placeholder/400/300",
    name: "Niko Proposal (1).pdf",
    type: "application/pdf",
    size: 217180,
    uploadedAt: "2024-06-11T11:30:00Z"
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    name: "SaleBot-Favicon (1).png",
    type: "image/png",
    size: 37660,
    uploadedAt: "2024-06-10T13:22:00Z"
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    name: "signature (1).png",
    type: "image/png",
    size: 8010,
    uploadedAt: "2024-06-09T08:15:00Z"
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    name: "Screenshot_20240922_21...",
    type: "image/png",
    size: 875310,
    uploadedAt: "2024-06-08T19:45:00Z"
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    name: "IMG_20240909_163726.j...",
    type: "image/jpeg",
    size: 630000,
    uploadedAt: "2024-06-07T12:30:00Z"
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    name: "IMG_20240909_163726.j...",
    type: "image/jpeg",
    size: 630000,
    uploadedAt: "2024-06-06T15:20:00Z"
  }
];

export default function MediaLibraryPage() {
  const t = useTranslations();
  const [files, setFiles] = useState<MediaFile[]>(sampleFiles);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchMediaFiles = useCallback(async () => {
    setLoading(true);
    try {
      // Simulated API call - in real implementation, this would be your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFiles(sampleFiles);
    } catch (error) {
      console.error("Error fetching media files:", error);
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

    try {
      // Simulated upload - in real implementation, this would be your upload API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add uploaded files to the list (simulated)
      const newFiles = selectedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }));
      
      setFiles(prev => [...newFiles, ...prev]);
      setSelectedFiles([]);
      showToast.success(t('media.uploadSuccess'));
    } catch (error) {
      console.error("Upload error:", error);
      showToast.error(t('media.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm(t('media.deleteConfirm'))) return;

    try {
      // Simulated delete - in real implementation, this would be your delete API
      await new Promise(resolve => setTimeout(resolve, 500));
      setFiles(files.filter(file => file.id !== fileId));
      showToast.success(t('media.deleteSuccess'));
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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage style={{ width: '32px', height: '32px', color: '#3b82f6' }} />;
    if (type.startsWith('video/')) return <Video style={{ width: '32px', height: '32px', color: '#8b5cf6' }} />;
    return <FileText style={{ width: '32px', height: '32px', color: '#6b7280' }} />;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: '24px'
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'var(--text-color)',
      marginBottom: '8px'
    },
    subtitle: {
      color: 'var(--text-secondary)'
    },
    section: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 var(--card-shadow)',
      border: '1px solid var(--card-border)',
      padding: '24px',
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'var(--text-color)',
      marginBottom: '16px'
    },
    uploadControls: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '16px'
    },
    uploadControlsRow: {
      display: 'flex',
      gap: '16px'
    },
    fileInput: {
      flex: 1,
      padding: '8px 12px',
      border: '1px solid var(--input-border)',
      borderRadius: '8px',
      fontSize: '14px'
    },
    uploadButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 24px',
      backgroundColor: 'var(--button-primary-bg)',
      color: 'var(--button-primary-text)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    uploadButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    selectedFiles: {
      backgroundColor: 'var(--background-secondary)',
      borderRadius: '8px',
      padding: '16px'
    },
    selectedFilesTitle: {
      fontWeight: '500',
      color: 'var(--text-color)',
      marginBottom: '8px'
    },
    selectedFilesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    selectedFileItem: {
      fontSize: '14px',
      color: 'var(--text-secondary)',
      display: 'flex',
      justifyContent: 'space-between'
    },
    filters: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    searchContainer: {
      position: 'relative',
      flex: 1,
      minWidth: '250px'
    },
    // searchIcon: {
    //   position: 'absolute',
    //   left: '12px',
    //   top: '50%',
    //   transform: 'translateY(-50%)',
    //   width: '16px',
    //   height: '16px',
    //   color: 'var(--text-secondary)'
    // },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '10px',
      paddingBottom: '10px',
      border: '1px solid var(--input-border)',
      borderRadius: '8px',
      fontSize: '14px',
      background: 'var(--card-bg)',
      color: 'var(--text-color)'
    },
    filterSelect: {
      padding: '6px 12px',
      border: '1px solid var(--input-border)',
      borderRadius: '8px',
      fontSize: '14px',
      background: 'var(--card-bg)',
      color: 'var(--text-color)'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '48px'
    },
    loadingSpinner: {
      width: '32px',
      height: '32px',
      border: '2px solid var(--divider-color)',
      borderTop: '2px solid var(--button-primary-bg)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      marginLeft: '12px',
      color: 'var(--text-secondary)'
    },
    mediaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '16px'
    },
    mediaCard: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 var(--card-shadow)',
      border: '1px solid var(--card-border)',
      overflow: 'hidden',
      transition: 'all 0.2s',
      cursor: 'pointer'
    },
    mediaCardHover: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    mediaPreview: {
      position: 'relative',
      width: '100%',
      height: '120px'
    },
    mediaImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    mediaPlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--background-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    deleteButton: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: '#fef2f2',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ef4444',
      cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(239,68,68,0.06)',
      opacity: 0,
      transition: 'opacity 0.2s, background 0.18s, color 0.18s, box-shadow 0.18s'
    },
    deleteButtonVisible: {
      opacity: 1
    },
    deleteIcon: {
      width: '18px',
      height: '18px',
      color: 'inherit'
    },
    mediaInfo: {
      padding: '12px'
    },
    mediaName: {
      fontWeight: '500',
      color: 'var(--text-color)',
      fontSize: '14px',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    mediaSize: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      marginBottom: '2px'
    },
    mediaDate: {
      fontSize: '11px',
      color: 'var(--text-secondary)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px'
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      color: 'var(--text-secondary)',
      margin: '0 auto 16px'
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: 'var(--text-color)',
      marginBottom: '8px'
    },
    emptyText: {
      color: 'var(--text-secondary)'
    }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-right" />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .media-card:hover .delete-button {
            opacity: 1 !important;
          }
          
          .delete-button:hover {
            background-color: #ef4444 !important;
            color: #fff !important;
          }
          
          .upload-button:hover:not(:disabled) {
            background-color: var(--primary-color, #1d4ed8);
          }
          
          .search-input:focus, .filter-select:focus, .fileInput:focus {
            outline: none;
            border-color: var(--primary-color, #2563eb);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          
          @media (max-width: 640px) {
            .upload-controls-row {
              flex-direction: column;
            }
            .filters {
              flex-direction: column;
            }
            .search-container {
              min-width: auto;
            }
          }
        `}
      </style>
      
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <h1 style={styles.title}>{t('media.title')}</h1>
          <p style={styles.subtitle}>{t('media.subtitle')}</p>
        </div>

        {/* Upload Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('media.uploadFiles')}</h2>
          <div style={styles.uploadControls as React.CSSProperties}>
            <div style={styles.uploadControlsRow as React.CSSProperties} className="upload-controls-row">
              <input
                type="file"
                id="files"
                className="fileInput"
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                multiple
              />
              <button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                style={{
                  ...styles.uploadButton,
                  ...(uploading || selectedFiles.length === 0 ? styles.uploadButtonDisabled : {})
                } as React.CSSProperties}
                className="upload-button"
              >
                <Upload style={{ width: '16px', height: '16px' }} />
                {uploading ? t('common.loading') : t('media.upload')}
              </button>
            </div>
            
            {selectedFiles.length > 0 && (
              <div style={styles.selectedFiles as React.CSSProperties}>
                <h3 style={styles.selectedFilesTitle as React.CSSProperties}>{t('media.selectedFiles')}: ({selectedFiles.length})</h3>
                <div style={styles.selectedFilesList as React.CSSProperties}>
                  {selectedFiles.map((file, index) => (
                    <div key={index} style={styles.selectedFileItem as React.CSSProperties}>
                      <span>{file.name}</span>
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div style={styles.section as React.CSSProperties}>
          <div style={styles.filters as React.CSSProperties} className="filters">
            <div style={styles.searchContainer as React.CSSProperties} className="search-container">
              {/* <Search style={styles.searchIcon as React.CSSProperties} /> */}
              <input
                type="text"
                placeholder={t('media.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput as React.CSSProperties}
                className="search-input"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={styles.filterSelect as React.CSSProperties}
              className="filter-select"
            >
              <option value="all">{t('media.allTypes')}</option>
              <option value="image">{t('media.images')}</option>
              <option value="video">{t('media.videos')}</option>
              <option value="application">{t('media.documents')}</option>
            </select>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div style={styles.loadingContainer as React.CSSProperties}>
            <div style={styles.loadingSpinner as React.CSSProperties}></div>
            <span style={styles.loadingText as React.CSSProperties}>{t('common.loading')}</span>
          </div>
        ) : (
          <div style={styles.mediaGrid as React.CSSProperties}>
            {filteredFiles.map((file) => (
              <div key={file.id} style={styles.mediaCard as React.CSSProperties} className="media-card">
                <div style={styles.mediaPreview as React.CSSProperties}>
                  {file.type.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      style={styles.mediaImage as React.CSSProperties}
                    />
                  ) : (
                    <div style={styles.mediaPlaceholder as React.CSSProperties}>
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(file.id)}
                    style={styles.deleteButton as React.CSSProperties}
                    className="delete-button"
                  >
                    <Trash2 style={styles.deleteIcon as React.CSSProperties} />
                  </button>
                </div>
                <div style={styles.mediaInfo as React.CSSProperties}>
                  <h3 style={styles.mediaName as React.CSSProperties} title={file.name}>
                    {file.name}
                  </h3>
                  <p style={styles.mediaSize as React.CSSProperties}>
                    {formatFileSize(file.size)}
                  </p>
                  <p style={styles.mediaDate as React.CSSProperties}>
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && !loading && (
          <div style={styles.emptyState as React.CSSProperties}>
            <FileImage style={styles.emptyIcon as React.CSSProperties} />
            <h3 style={styles.emptyTitle as React.CSSProperties}>{t('media.noFilesFound')}</h3>
            <p style={styles.emptyText as React.CSSProperties}>
              {searchTerm || filterType !== 'all' 
                ? t('media.tryAdjustingSearch')
                : t('media.uploadToGetStarted')
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 

