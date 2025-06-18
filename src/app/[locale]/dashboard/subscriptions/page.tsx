"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from 'next-intl';
import { Search, Users, Mail, Calendar } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/utils/toast';

interface Subscriber {
  id: number;
  email: string;
  name?: string;
  created_at: string;
  status?: string;
}

export default function SubscriptionsPage() {
  const t = useTranslations();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async (query?: string) => {
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
        ? `https://api.djofo.bj/api/sub?q=${encodeURIComponent(query)}`
        : "https://api.djofo.bj/api/sub";
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscribers(Array.isArray(data) ? data : data.results || []);
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
    } catch (error) {
      const errorMessage = t('errors.networkError');
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchSubscribers();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="subscriptions-page">
      <Toaster />
      
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3 mb-4">
          <div className="stat-icon">
            <Users className="h-8 w-8" />
          </div>
          <h1>{t('subscriptions.title')}</h1>
        </div>
        <p>{t('subscriptions.manageSubscribers')}</p>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
             {/*  <Search className="search-icon" /> */}
            <input
              type="text"
              placeholder={t('subscriptions.search')}
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
            {loading ? t('subscriptions.searching') : t('common.search')}
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="clear-button"
            >
              {t('subscriptions.clear')}
            </button>
          )}
        </form>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Users className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{t('subscriptions.totalSubscribers')}</h3>
              <p>{subscribers.length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Mail className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{t('subscriptions.active')}</h3>
              <p>{subscribers.filter(s => s.status !== 'unsubscribed').length}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon">
              <Calendar className="h-8 w-8" />
            </div>
            <div className="stat-info">
              <h3>{t('subscriptions.thisMonth')}</h3>
              <p>
                {subscribers.filter(s => {
                  const created = new Date(s.created_at);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="content-section">
        <div className="section-header">
          <h2>{t('subscriptions.subscribersList')}</h2>
        </div>
        
        <div className="section-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{t('subscriptions.loadingSubscribers')}</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button
                onClick={() => fetchSubscribers()}
                className="retry-button"
              >
                {t('subscriptions.retry')}
              </button>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" />
              <p>
                {searchQuery ? t('subscriptions.noSubscribersFound') : t('subscriptions.noSubscribers')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('subscriptions.subscriber')}</th>
                    <th>{t('subscriptions.email')}</th>
                    <th>{t('subscriptions.status')}</th>
                    <th>{t('subscriptions.joined')}</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <span className="text-sm font-medium text-blue-600">
                              {subscriber.name ? subscriber.name.charAt(0).toUpperCase() : subscriber.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {subscriber.name || t('subscriptions.anonymous')}
                            </div>
                            <div className="text-sm text-gray-500">ID: {subscriber.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-900">{subscriber.email}</div>
                      </td>
                      <td>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.status === 'unsubscribed' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {subscriber.status === 'unsubscribed' ? t('subscriptions.unsubscribed') : t('subscriptions.active')}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500">
                        {formatDate(subscriber.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 