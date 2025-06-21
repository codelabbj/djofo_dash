"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { showToast } from '@/utils/toast';
import styles from '../../page.module.css';
import { Plus, BookOpen, Video, Image, Link, FileText, Hash } from "lucide-react";

export default function NewCoursePage() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    formation: "",
    title: "",
    content: "",
    videos: [] as string[],
    images: [] as string[],
    urls: [] as string[]
  });

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
        showToast.success(t('formations.courseCreated'));
        router.push('/dashboard/formations');
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

  return (
    <div className={styles.formationsPage}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('formations.createCourse')}</h1>
          <p>{t('formations.coursePageDescription')}</p>
        </div>
        {/* <button
          onClick={() => router.push('/dashboard/formations/new')}
          className={styles.clearButton}
        >
          <Plus className={styles.h4W4} />
          {t('formations.newFormation')}
        </button> */}
      </div>
      
      <div className={styles.formContainer}>
        <form onSubmit={handleCourseSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Hash size={20} />
              {t('formations.courseFormation')}
            </label>
            <input
              type="number"
              required
              value={courseForm.formation}
              onChange={(e) => setCourseForm({...courseForm, formation: e.target.value})}
              className={styles.formInput}
              placeholder={t('formations.formationIdPlaceholder')}
              min="1"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <BookOpen size={20} />
              {t('formations.courseTitle')}
            </label>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
              className={styles.formInput}
              placeholder={t('formations.courseTitlePlaceholder')}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FileText size={20} />
              {t('formations.courseContent')}
            </label>
            <textarea
              required
              rows={6}
              value={courseForm.content}
              onChange={(e) => setCourseForm({...courseForm, content: e.target.value})}
              className={styles.formTextarea}
              placeholder={t('formations.courseContentPlaceholder')}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Video size={20} />
              {t('formations.courseVideos')}
            </label>
            <div className={styles.arrayInputContainer}>
              <input
                type="url"
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
                  <span key={index} className={`${styles.arrayItem} ${styles.video}`}>
                    {video}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('videos', index, courseForm.videos, 
                        (arr) => setCourseForm({...courseForm, videos: arr}))}
                      className={styles.arrayItemRemove}
                      aria-label="Remove video"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Image size={20} />
              {t('formations.courseImages')}
            </label>
            <div className={styles.arrayInputContainer}>
              <input
                type="url"
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
                  <span key={index} className={`${styles.arrayItem} ${styles.image}`}>
                    {image}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('images', index, courseForm.images, 
                        (arr) => setCourseForm({...courseForm, images: arr}))}
                      className={styles.arrayItemRemove}
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Link size={20} />
              {t('formations.courseUrls')}
            </label>
            <div className={styles.arrayInputContainer}>
              <input
                type="url"
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
                  <span key={index} className={`${styles.arrayItem} ${styles.url}`}>
                    {url}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('urls', index, courseForm.urls, 
                        (arr) => setCourseForm({...courseForm, urls: arr}))}
                      className={styles.arrayItemRemove}
                      aria-label="Remove URL"
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
            className={`${styles.modalButton} ${styles.modalButtonPrimary}`}
            onClick={handleCourseSubmit}
          >
            {loading ? (
              <>
                <div className={styles.loadingSpinner}></div>
                {t('formations.creating')}
              </>
            ) : (
              <>
                <Plus size={20} />
                {t('formations.createCourse')}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/formations')}
            className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
          >
            {t('formations.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
} 