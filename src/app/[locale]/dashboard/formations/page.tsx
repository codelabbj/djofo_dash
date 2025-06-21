"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Plus, BookOpen, Video, Image, Link,  Clock } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/utils/toast';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

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
    <div className={styles.formationsPage}>
      <Toaster />
      
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.flexItemsCenterJustifyBetween}>
          <div className={styles.flexItemsCenterGap3}>
            <div className={styles.statIcon}>
              <BookOpen className={styles.h8W8} />
            </div>
            <h1>{t('formations.title')}</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => router.push('/dashboard/formations/new')}
              className={styles.searchButton}
            >
              <Plus className={styles.h4W4} />
              {t('formations.newFormation')}
            </button>
          </div>
        </div>
        <p>{t('formations.manageFormations')}</p>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <form onSubmit={(e) => { e.preventDefault(); fetchFormations(searchQuery); }} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            {/*  <Search className="search-icon" /> */}
            <input
              type="text"
              placeholder={t('formations.searchFormations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={styles.searchButton}
          >
            {loading ? t('formations.searching') : t('common.search')}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div className={styles.statIcon}>
              <BookOpen className={styles.h8W8} />
            </div>
            <div className={styles.statInfo}>
              <h3>{t('formations.totalFormations')}</h3>
              <p>{formations.length}</p>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div className={styles.statIcon}>
              <Video className={styles.h8W8} />
            </div>
            <div className={styles.statInfo}>
              <h3>{t('formations.totalCourses')}</h3>
              <p>{courses.length}</p>
            </div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div className={styles.statIcon}>
              <Clock className={styles.h8W8} />
            </div>
            <div className={styles.statInfo}>
              <h3>{t('formations.totalHours')}</h3>
              <p>
                {formations.reduce((total, formation) => total + parseInt(formation.hours || '0'), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formations List */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2>{t('formations.formations')}</h2>
        </div>
        
        <div className={styles.sectionContent}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>{t('formations.loadingFormations')}</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button
                onClick={() => fetchFormations()}
                className={styles.retryButton}
              >
                {t('subscriptions.retry')}
              </button>
            </div>
          ) : formations.length === 0 ? (
            <div className={styles.emptyState}>
              <BookOpen className={styles.emptyStateIcon} />
              <p>{t('formations.noFormations')}</p>
            </div>
          ) : (
            <div className={styles.formationsGrid}>
              {formations.map((formation) => (
                <div key={formation.id} className={styles.formationCard}>
                  <div className={styles.formationHeader}>
                    <h3 className={styles.formationTitle}>{formation.title}</h3>
                    <span className={`${styles.formationLevel} ${styles[`level${formation.level}`]}`}>
                      {t(`formations.level.${formation.level}`)}
                    </span>
                  </div>
                  <p className={styles.formationDescription}>{formation.description}</p>
                  <div className={styles.formationMeta}>
                    <div className={styles.formationMetaItem}>
                      <Clock className={styles.h4W4} />
                      {formation.hours}{t('formations.hours')}
                    </div>
                    <div className={styles.formationMetaItem}>
                      <Video className={styles.h4W4} />
                      {courses.filter(c => c.formation === formation.id).length} {t('formations.courses')}
                    </div>
                  </div>
                  {formation.tags.length > 0 && (
                    <div className={styles.formationTags}>
                      {formation.tags.map((tag, index) => (
                        <span key={index} className={styles.formationTag}>
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
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <h2>{t('formations.courses')}</h2>
        </div>
        
        <div className={styles.sectionContent}>
          {courses.length === 0 ? (
            <div className={styles.emptyState}>
              <Video className={styles.emptyStateIcon} />
              <p>{t('formations.noCourses')}</p>
            </div>
          ) : (
            <div className={styles.overflowXAuto}>
              <table className={styles.dataTable}>
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
                        <div className={styles.textSmFontMediumTextGray900}>{course.title}</div>
                        <div className={styles.textSmTextGray500}>ID: {course.id}</div>
                      </td>
                      <td>
                        <div className={styles.textSmTextGray900}>
                          {formations.find(f => f.id === course.formation)?.title || `${t('formations.formation')} ${course.formation}`}
                        </div>
                      </td>
                      <td>
                        <div className={styles.textSmTextGray900MaxXsTruncate}>{course.content}</div>
                      </td>
                      <td>
                        <div className={styles.flexItemsCenterGap4TextSmTextGray500}>
                          <div className={styles.flexItemsCenterGap1}>
                            <Video className={styles.h4W4} />
                            {course.videos.length}
                          </div>
                          <div className={styles.flexItemsCenterGap1}>
                            <Image className={styles.h4W4} />
                            {course.images.length}
                          </div>
                          <div className={styles.flexItemsCenterGap1}>
                            <Link className={styles.h4W4} />
                            {course.urls.length}
                          </div>
                        </div>
                      </td>
                      <td className={styles.textSmTextGray500}>
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

      {/* Course Form Modal */}
      {showCourseForm && (
        <div className={styles.modalOverlay} onClick={() => setShowCourseForm(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{t('formations.createCourse')}</h2>
              <button
                onClick={() => setShowCourseForm(false)}
                className={styles.modalClose}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCourseSubmit} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('formations.courseFormation')}</label>
                <select
                  required
                  value={courseForm.formation}
                  onChange={(e) => setCourseForm({...courseForm, formation: e.target.value})}
                  className={styles.formSelect}
                >
                  <option value="">{t('formations.selectFormation')}</option>
                  {formations.map((formation) => (
                    <option key={formation.id} value={formation.id}>
                      {formation.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('formations.courseTitle')}</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('formations.courseContent')}</label>
                <textarea
                  required
                  rows={4}
                  value={courseForm.content}
                  onChange={(e) => setCourseForm({...courseForm, content: e.target.value})}
                  className={styles.formTextarea}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('formations.courseVideos')}</label>
                <div className={styles.arrayInputContainer}>
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
                    className={styles.arrayInput}
                  />
                  <div className={styles.arrayItems}>
                    {courseForm.videos.map((video, index) => (
                      <span key={index} className={styles.arrayItem}>
                        {video}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('videos', index, courseForm.videos, 
                            (arr) => setCourseForm({...courseForm, videos: arr}))}
                          className={styles.arrayItemRemove}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('formations.courseImages')}</label>
                <div className={styles.arrayInputContainer}>
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
                    className={styles.arrayInput}
                  />
                  <div className={styles.arrayItems}>
                    {courseForm.images.map((image, index) => (
                      <span key={index} className={styles.arrayItem}>
                        {image}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('images', index, courseForm.images, 
                            (arr) => setCourseForm({...courseForm, images: arr}))}
                          className={styles.arrayItemRemove}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>{t('formations.courseUrls')}</label>
                <div className={styles.arrayInputContainer}>
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
                    className={styles.arrayInput}
                  />
                  <div className={styles.arrayItems}>
                    {courseForm.urls.map((url, index) => (
                      <span key={index} className={styles.arrayItem}>
                        {url}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('urls', index, courseForm.urls, 
                            (arr) => setCourseForm({...courseForm, urls: arr}))}
                          className={styles.arrayItemRemove}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </form>
            
            <div className={styles.modalActions}>
              <button
                type="submit"
                disabled={loading}
                onClick={handleCourseSubmit}
                className={styles.modalButtonPrimary}
              >
                {loading ? t('formations.creating') : t('formations.createCourse')}
              </button>
              <button
                type="button"
                onClick={() => setShowCourseForm(false)}
                className={styles.modalButtonSecondary}
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