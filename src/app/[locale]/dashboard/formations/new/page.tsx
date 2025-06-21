"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { showToast } from '@/utils/toast';
import styles from '../page.module.css';
import { Plus, BookOpen, Target, Tag, Clock, Award } from "lucide-react";

export default function NewFormationPage() {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formationForm, setFormationForm] = useState({
    title: "",
    description: "",
    level: "beginner",
    hours: "",
    object: [] as string[],
    tags: [] as string[]
  });

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
        showToast.success(t('formations.formationCreated'));
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
          <h1>{t('formations.createFormation')}</h1>
          <p>{t('formations.formationPageDescription')}</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/formations/new/course')}
          className={styles.clearButton}
        >
          <Plus className={styles.h4W4} />
          {t('formations.newCourse')}
        </button>
      </div>
      
      <div className={styles.formContainer}>
        <form onSubmit={handleFormationSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <BookOpen size={20} />
              {t('formations.formationTitle')}
            </label>
            <input
              type="text"
              required
              value={formationForm.title}
              onChange={(e) => setFormationForm({...formationForm, title: e.target.value})}
              className={styles.formInput}
              placeholder={t('formations.titlePlaceholder')}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <BookOpen size={20} />
              {t('formations.formationDescription')}
            </label>
            <textarea
              required
              rows={4}
              value={formationForm.description}
              onChange={(e) => setFormationForm({...formationForm, description: e.target.value})}
              className={styles.formTextarea}
              placeholder={t('formations.descriptionPlaceholder')}
            />
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <Award size={20} />
                {t('formations.formationLevel')}
              </label>
              <select
                value={formationForm.level}
                onChange={(e) => setFormationForm({...formationForm, level: e.target.value})}
                className={styles.formSelect}
              >
                <option value="beginner">{t('formations.level.beginner')}</option>
                <option value="intermediate">{t('formations.level.intermediate')}</option>
                <option value="advanced">{t('formations.level.advanced')}</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <Clock size={20} />
                {t('formations.formationHours')}
              </label>
              <input
                type="number"
                required
                value={formationForm.hours}
                onChange={(e) => setFormationForm({...formationForm, hours: e.target.value})}
                className={styles.formInput}
                placeholder="e.g., 24"
                min="1"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Target size={20} />
              {t('formations.formationObjectives')}
            </label>
            <div className={styles.arrayInputContainer}>
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
                className={styles.arrayInput}
              />
              <div className={styles.arrayItems}>
                {formationForm.object.map((obj, index) => (
                  <span key={index} className={styles.arrayItem}>
                    {obj}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('object', index, formationForm.object, 
                        (arr) => setFormationForm({...formationForm, object: arr}))}
                      className={styles.arrayItemRemove}
                      aria-label="Remove objective"
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
              <Tag size={20} />
              {t('formations.formationTags')}
            </label>
            <div className={styles.arrayInputContainer}>
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
                className={styles.arrayInput}
              />
              <div className={styles.arrayItems}>
                {formationForm.tags.map((tag, index) => (
                  <span key={index} className={styles.arrayItem}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index, formationForm.tags, 
                        (arr) => setFormationForm({...formationForm, tags: arr}))}
                      className={styles.arrayItemRemove}
                      aria-label="Remove tag"
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
            onClick={handleFormationSubmit}
          >
            {loading ? (
              <>
                <div className={styles.loadingSpinner}></div>
                {t('formations.creating')}
              </>
            ) : (
              <>
                <Plus size={20} />
                {t('formations.createFormation')}
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