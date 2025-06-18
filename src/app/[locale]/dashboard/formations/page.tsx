"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Plus, BookOpen, Video, Image, Link,  Clock } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/utils/toast';

interface Formation {
  id: number;
  title: string;
  description: string;
  level: string;
  hours: string;
  object: string[];
  tags: string[];
  created_at?: string;
}

interface Course {
  id: number;
  title: string;
  content: string;
  videos: string[];
  images: string[];
  urls: string[];
  formation: number;
  created_at: string;
}

export default function FormationsPage() {
  const t = useTranslations();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Formation form state
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [formationForm, setFormationForm] = useState({
    title: "",
    description: "",
    level: "beginner",
    hours: "",
    object: [] as string[],
    tags: [] as string[]
  });
  
  // Course form state
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    formation: "",
    title: "",
    content: "",
    videos: [] as string[],
    images: [] as string[],
    urls: [] as string[]
  });

  const fetchFormations = async (query?: string) => {
    setLoading(true);
    setError(null);
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError(t('errors.unauthorized'));
      showToast.error(t('errors.unauthorized'));
      setLoading(false);
      return;
    }

    try {
      const url = query 
        ? `https://api.djofo.bj/api/formation?q=${encodeURIComponent(query)}`
        : "https://api.djofo.bj/api/formation";
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormations(Array.isArray(data) ? data : data.results || []);
      } else {
        const errorData = await response.json();
        let errorMessage = t('errors.unknownError');
        
        if (response.status === 401) {
          errorMessage = t('errors.unauthorized');
        } else if (response.status === 403) {
          errorMessage = t('errors.permissionDenied');
        } else if (response.status === 404) {
          errorMessage = t('errors.resourceNotFound');
        } else if (response.status === 429) {
          errorMessage = t('errors.tooManyRequests');
        } else if (response.status >= 500) {
          errorMessage = t('errors.serverError');
        } else if (errorData.detail || errorData.message) {
          errorMessage = errorData.detail || errorData.message;
        }
        
        setError(errorMessage);
        showToast.error(errorMessage);
      }
    } catch {
      const errorMessage = t('errors.networkError');
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    try {
      const response = await fetch("https://api.djofo.bj/api/cours", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : data.results || []);
      } else {
        console.error("Failed to fetch courses:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
    fetchFormations();
    fetchCourses();
  }, []);

  const handleFormationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showToast.error(t('errors.unauthorized'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.djofo.bj/api/formation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formationForm),
      });

      if (response.ok) {
        const newFormation = await response.json();
        setFormations([...formations, newFormation]);
        setFormationForm({
          title: "",
          description: "",
          level: "beginner",
          hours: "",
          object: [],
          tags: []
        });
        setShowFormationForm(false);
        showToast.success(t('formations.formationCreated'));
      } else {
        const errorData = await response.json();
        let errorMessage = t('errors.unknownError');
        
        if (response.status === 401) {
          errorMessage = t('errors.unauthorized');
        } else if (response.status === 403) {
          errorMessage = t('errors.permissionDenied');
        } else if (response.status === 422) {
          errorMessage = t('errors.validationError');
        } else if (response.status >= 500) {
          errorMessage = t('errors.serverError');
        } else if (errorData.detail || errorData.message) {
          errorMessage = errorData.detail || errorData.message;
        }
        
        showToast.error(errorMessage);
      }
    } catch {
      showToast.error(t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      showToast.error(t('errors.unauthorized'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.djofo.bj/api/cours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...courseForm,
          formation: parseInt(courseForm.formation)
        }),
      });

      if (response.ok) {
        const newCourse = await response.json();
        setCourses([...courses, newCourse]);
        setCourseForm({
          formation: "",
          title: "",
          content: "",
          videos: [],
          images: [],
          urls: []
        });
        setShowCourseForm(false);
        showToast.success(t('formations.courseCreated'));
      } else {
        const errorData = await response.json();
        let errorMessage = t('errors.unknownError');
        
        if (response.status === 401) {
          errorMessage = t('errors.unauthorized');
        } else if (response.status === 403) {
          errorMessage = t('errors.permissionDenied');
        } else if (response.status === 422) {
          errorMessage = t('errors.validationError');
        } else if (response.status >= 500) {
          errorMessage = t('errors.serverError');
        } else if (errorData.detail || errorData.message) {
          errorMessage = errorData.detail || errorData.message;
        }
        
        showToast.error(errorMessage);
        }
      } catch {
        showToast.error(t('errors.networkError'));
      } finally {
        setLoading(false);
      }
  };

  const handleArrayInput = (field: string, value: string, array: string[], setArray: (arr: string[]) => void) => {
    if (value.trim() && !array.includes(value.trim())) {
      setArray([...array, value.trim()]);
    }
  };

  const removeArrayItem = (field: string, index: number, array: string[], setArray: (arr: string[]) => void) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="formations-page">
      <Toaster />
      
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="stat-icon">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1>{t('formations.title')}</h1>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowFormationForm(true)}
              className="search-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('formations.newFormation')}
            </button>
            <button
              onClick={() => setShowCourseForm(true)}
              className="clear-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('formations.newCourse')}
            </button>
          </div>
        </div>
        <p>{t('formations.manageFormations')}</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={(e) => { e.preventDefault(); fetchFormations(searchQuery); }} className="search-form">
          <div className="search-input-wrapper">
            {/*  <Search className="search-icon" /> */}
            <input
              type="text"
              placeholder={t('formations.searchFormations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="search-button"
          >
            {loading ? t('formations.searching') : t('common.search')}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{t('formations.totalFormations')}</h3>
              <p>{formations.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Video className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{t('formations.totalCourses')}</h3>
              <p>{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Clock className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{t('formations.totalHours')}</h3>
              <p>
                {formations.reduce((total, formation) => total + parseInt(formation.hours || '0'), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formations List */}
      <div className="content-section">
        <div className="section-header">
          <h2>{t('formations.formations')}</h2>
        </div>
        
        <div className="section-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{t('formations.loadingFormations')}</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button
                onClick={() => fetchFormations()}
                className="retry-button"
              >
                {t('subscriptions.retry')}
              </button>
            </div>
          ) : formations.length === 0 ? (
            <div className="empty-state">
              <BookOpen className="empty-state-icon" />
              <p>{t('formations.noFormations')}</p>
            </div>
          ) : (
            <div className="formations-grid">
              {formations.map((formation) => (
                <div key={formation.id} className="formation-card">
                  <div className="formation-header">
                    <h3 className="formation-title">{formation.title}</h3>
                    <span className={`formation-level ${formation.level}`}>
                      {t(`formations.level.${formation.level}`)}
                    </span>
                  </div>
                  <p className="formation-description">{formation.description}</p>
                  <div className="formation-meta">
                    <div className="formation-meta-item">
                      <Clock className="h-4 w-4" />
                      {formation.hours}{t('formations.hours')}
                    </div>
                    <div className="formation-meta-item">
                      <Video className="h-4 w-4" />
                      {courses.filter(c => c.formation === formation.id).length} {t('formations.courses')}
                    </div>
                  </div>
                  {formation.tags.length > 0 && (
                    <div className="formation-tags">
                      {formation.tags.map((tag, index) => (
                        <span key={index} className="formation-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Courses List */}
      <div className="content-section">
        <div className="section-header">
          <h2>{t('formations.courses')}</h2>
        </div>
        
        <div className="section-content">
          {courses.length === 0 ? (
            <div className="empty-state">
              <Video className="empty-state-icon" />
              <p>{t('formations.noCourses')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('formations.course')}</th>
                    <th>{t('formations.formation')}</th>
                    <th>{t('formations.content')}</th>
                    <th>{t('formations.media')}</th>
                    <th>{t('formations.created')}</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">ID: {course.id}</div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-900">
                          {formations.find(f => f.id === course.formation)?.title || `${t('formations.formation')} ${course.formation}`}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-900 max-w-xs truncate">{course.content}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4" />
                            {course.videos.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            {course.images.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <Link className="h-4 w-4" />
                            {course.urls.length}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm text-gray-500">
                        {formatDate(course.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Formation Form Modal */}
      {showFormationForm && (
        <div className="modal-overlay" onClick={() => setShowFormationForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('formations.createFormation')}</h2>
              <button
                onClick={() => setShowFormationForm(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleFormationSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">{t('formations.formationTitle')}</label>
                <input
                  type="text"
                  required
                  value={formationForm.title}
                  onChange={(e) => setFormationForm({...formationForm, title: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.formationDescription')}</label>
                <textarea
                  required
                  rows={4}
                  value={formationForm.description}
                  onChange={(e) => setFormationForm({...formationForm, description: e.target.value})}
                  className="form-textarea"
                />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">{t('formations.formationLevel')}</label>
                  <select
                    value={formationForm.level}
                    onChange={(e) => setFormationForm({...formationForm, level: e.target.value})}
                    className="form-select"
                  >
                    <option value="beginner">{t('formations.level.beginner')}</option>
                    <option value="intermediate">{t('formations.level.intermediate')}</option>
                    <option value="advanced">{t('formations.level.advanced')}</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('formations.formationHours')}</label>
                  <input
                    type="number"
                    required
                    value={formationForm.hours}
                    onChange={(e) => setFormationForm({...formationForm, hours: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.formationObjectives')}</label>
                <div className="array-input-container">
                  <input
                    type="text"
                    placeholder={t('formations.addObjective')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayInput('object', e.currentTarget.value, formationForm.object, 
                          (arr) => setFormationForm({...formationForm, object: arr}));
                        e.currentTarget.value = '';
                      }
                    }}
                    className="array-input"
                  />
                  <div className="array-items">
                    {formationForm.object.map((obj, index) => (
                      <span key={index} className="array-item object">
                        {obj}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('object', index, formationForm.object, 
                            (arr) => setFormationForm({...formationForm, object: arr}))}
                          className="array-item-remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.formationTags')}</label>
                <div className="array-input-container">
                  <input
                    type="text"
                    placeholder={t('formations.addTag')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayInput('tags', e.currentTarget.value, formationForm.tags, 
                          (arr) => setFormationForm({...formationForm, tags: arr}));
                        e.currentTarget.value = '';
                      }
                    }}
                    className="array-input"
                  />
                  <div className="array-items">
                    {formationForm.tags.map((tag, index) => (
                      <span key={index} className="array-item tag">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('tags', index, formationForm.tags, 
                            (arr) => setFormationForm({...formationForm, tags: arr}))}
                          className="array-item-remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </form>
            
            <div className="modal-actions">
              <button
                type="submit"
                disabled={loading}
                onClick={handleFormationSubmit}
                className="modal-button primary"
              >
                {loading ? t('formations.creating') : t('formations.createFormation')}
              </button>
              <button
                type="button"
                onClick={() => setShowFormationForm(false)}
                className="modal-button secondary"
              >
                {t('formations.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Form Modal */}
      {showCourseForm && (
        <div className="modal-overlay" onClick={() => setShowCourseForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('formations.createCourse')}</h2>
              <button
                onClick={() => setShowCourseForm(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCourseSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">{t('formations.courseFormation')}</label>
                <select
                  required
                  value={courseForm.formation}
                  onChange={(e) => setCourseForm({...courseForm, formation: e.target.value})}
                  className="form-select"
                >
                  <option value="">{t('formations.selectFormation')}</option>
                  {formations.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.courseTitle')}</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.courseContent')}</label>
                <textarea
                  required
                  rows={4}
                  value={courseForm.content}
                  onChange={(e) => setCourseForm({...courseForm, content: e.target.value})}
                  className="form-textarea"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.courseVideos')}</label>
                <div className="array-input-container">
                  <input
                    type="text"
                    placeholder={t('formations.addVideoUrl')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayInput('videos', e.currentTarget.value, courseForm.videos, 
                          (arr) => setCourseForm({...courseForm, videos: arr}));
                        e.currentTarget.value = '';
                      }
                    }}
                    className="array-input"
                  />
                  <div className="array-items">
                    {courseForm.videos.map((video, index) => (
                      <span key={index} className="array-item video">
                        {video}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('videos', index, courseForm.videos, 
                            (arr) => setCourseForm({...courseForm, videos: arr}))}
                          className="array-item-remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.courseImages')}</label>
                <div className="array-input-container">
                  <input
                    type="text"
                    placeholder={t('formations.addImageUrl')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayInput('images', e.currentTarget.value, courseForm.images, 
                          (arr) => setCourseForm({...courseForm, images: arr}));
                        e.currentTarget.value = '';
                      }
                    }}
                    className="array-input"
                  />
                  <div className="array-items">
                    {courseForm.images.map((image, index) => (
                      <span key={index} className="array-item image">
                        {image}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index, courseForm.images, 
                            (arr) => setCourseForm({...courseForm, images: arr}))}
                          className="array-item-remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('formations.courseUrls')}</label>
                <div className="array-input-container">
                  <input
                    type="text"
                    placeholder={t('formations.addUrl')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayInput('urls', e.currentTarget.value, courseForm.urls, 
                          (arr) => setCourseForm({...courseForm, urls: arr}));
                        e.currentTarget.value = '';
                      }
                    }}
                    className="array-input"
                  />
                  <div className="array-items">
                    {courseForm.urls.map((url, index) => (
                      <span key={index} className="array-item url">
                        {url}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('urls', index, courseForm.urls, 
                            (arr) => setCourseForm({...courseForm, urls: arr}))}
                          className="array-item-remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </form>
            
            <div className="modal-actions">
              <button
                type="submit"
                disabled={loading}
                onClick={handleCourseSubmit}
                className="modal-button primary"
              >
                {loading ? t('formations.creating') : t('formations.createCourse')}
              </button>
              <button
                type="button"
                onClick={() => setShowCourseForm(false)}
                className="modal-button secondary"
              >
                {t('formations.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 