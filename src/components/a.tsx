// pages/_app.js
import '../styles/globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import { AuthProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp

// contexts/ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate login API call
    if (email === 'admin@djofo.bj' && password === 'admin123') {
      const userData = { 
        id: 1, 
        email, 
        name: 'Admin Djofo',
        role: 'admin' 
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// pages/index.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return user ? <Dashboard /> : <Login />
}

// components/Login.js
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import styles from '../styles/Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)
    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <img src="/api/placeholder/60/60" alt="Djofo.bj" className={styles.logo} />
          <h1>Djofo.bj Admin</h1>
          <p>Connectez-vous à votre tableau de bord</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@djofo.bj"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className={styles.demo}>
          <p>Demo credentials:</p>
          <p><strong>Email:</strong> admin@djofo.bj</p>
          <p><strong>Password:</strong> admin123</p>
        </div>

        <button onClick={toggleTheme} className={styles.themeToggle}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  )
}

// components/Dashboard.js
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Sidebar from './Sidebar'
import Header from './Header'
import ContentManagement from './ContentManagement'
import Analytics from './Analytics'
import UserManagement from './UserManagement'
import Settings from './Settings'
import styles from '../styles/Dashboard.module.css'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('content')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeSection) {
      case 'content':
        return <ContentManagement />
      case 'analytics':
        return <Analytics />
      case 'users':
        return <UserManagement />
      case 'settings':
        return <Settings />
      default:
        return <ContentManagement />
    }
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className={`${styles.main} ${sidebarCollapsed ? styles.mainExpanded : ''}`}>
        <Header 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// components/Sidebar.js
import { useTheme } from '../contexts/ThemeContext'
import styles from '../styles/Sidebar.module.css'

export default function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed }) {
  const { theme } = useTheme()

  const menuItems = [
    { id: 'content', label: 'Contenu', icon: '📝' },
    { id: 'analytics', label: 'Analyses', icon: '📊' },
    { id: 'users', label: 'Utilisateurs', icon: '👥' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ]

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.brand}>
        <img src="/api/placeholder/40/40" alt="Djofo.bj" />
        {!collapsed && <span>Djofo.bj</span>}
      </div>

      <nav className={styles.nav}>
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.active {
  background: var(--accent);
  color: white;
}

.active:hover {
  background: var(--accent-hover);
}

.icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

/* styles/Header.module.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menuBtn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.menuBtn:hover {
  background: var(--bg-secondary);
}

.left h1 {
  color: var(--text-primary);
  font-size: 1.3rem;
  font-weight: 600;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.themeBtn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.themeBtn:hover {
  background: var(--bg-tertiary);
}

.userMenu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.logoutBtn {
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.3s ease;
}

.logoutBtn:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .userMenu span {
    display: none;
  }
}

/* styles/ContentManagement.module.css */
.container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
}

.createBtn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.createBtn:hover {
  background: var(--accent-hover);
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filterSelect {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
}

.contentGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.contentCard {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contentCard:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.blog {
  background: #e3f2fd;
  color: #1976d2;
}

.video {
  background: #fce4ec;
  color: #c2185b;
}

.podcast {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.publié {
  background: #e8f5e8;
  color: var(--accent);
}

.brouillon {
  background: #fff3cd;
  color: #856404;
}

.contentCard h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.cardFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.editBtn {
  background: var(--info);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.deleteBtn {
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modalContent {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modalContent h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form input,
.form select,
.form textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-family: inherit;
}

.form textarea {
  min-height: 100px;
  resize: vertical;
}

.modalActions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modalActions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.modalActions button[type="button"] {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modalActions button[type="submit"] {
  background: var(--accent);
  color: white;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .contentGrid {
    grid-template-columns: 1fr;
  }
  
  .cardFooter {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

/* styles/Analytics.module.css */
.container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.container h2 {
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.statCard {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.statCard:hover {
  transform: translateY(-2px);
}

.statCard h3 {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.statCard p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.change {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.positive {
  background: #e8f5e8;
  color: var(--accent);
}

.negative {
  background: #fee;
  color: var(--danger);
}

.chartContainer {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.chartContainer h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.chart {
  height: 300px;
}

.chartPlaceholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-secondary);
  font-size: 1.2rem;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .statsGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .statsGrid {
    grid-template-columns: 1fr;
  }
}

/* styles/UserManagement.module.css */
.container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
}

.addBtn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.addBtn:hover {
  background: var(--accent-hover);
}

.userTable {
  overflow-x: auto;
}

.userTable table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
}

.userTable th,
.userTable td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.userTable th {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-weight: 600;
}

.userTable td {
  color: var(--text-primary);
}

.userTable tr:last-child td {
  border-bottom: none;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.actif {
  background: #e8f5e8;
  color: var(--accent);
}

.inactif {
  background: #fff3cd;
  color: #856404;
}

.editBtn {
  background: var(--info);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.deleteBtn {
  background: var(--danger);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .userTable {
    font-size: 0.9rem;
  }
  
  .userTable th,
  .userTable td {
    padding: 0.75rem 0.5rem;
  }
}

/* styles/Settings.module.css */
.container {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  max-width: 600px;
}

.container h2 {
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section:last-of-type {
  border-bottom: none;
}

.section h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.setting:last-child {
  margin-bottom: 0;
}

.setting label {
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting input[type="text"],
.setting textarea {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  min-width: 200px;
}

.setting textarea {
  min-height: 80px;
  resize: vertical;
}

.setting input[type="checkbox"] {
  margin-right: 0.5rem;
}

.themeBtn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.saveBtn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.saveBtn:hover {
  background: var(--accent-hover);
}

@media (max-width: 768px) {
  .setting {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .setting input[type="text"],
  .setting textarea {
    width: 100%;
    min-width: unset;
  }
}} ${activeSection === item.id ? styles.active : ''}`}
            onClick={() => setActiveSection(item.id)}
            title={collapsed ? item.label : ''}
          >
            <span className={styles.icon}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  )
}

// components/Header.js
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import styles from '../styles/Header.module.css'

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button onClick={toggleSidebar} className={styles.menuBtn}>
          ☰
        </button>
        <h1>Tableau de bord</h1>
      </div>

      <div className={styles.right}>
        <button onClick={toggleTheme} className={styles.themeBtn}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        
        <div className={styles.userMenu}>
          <span>{user?.name}</span>
          <button onClick={logout} className={styles.logoutBtn}>
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  )
}

// components/ContentManagement.js
import { useState } from 'react'
import styles from '../styles/ContentManagement.module.css'

export default function ContentManagement() {
  const [contents, setContents] = useState([
    {
      id: 1,
      title: 'Comment identifier les attaques de phishing',
      type: 'Blog',
      status: 'Publié',
      date: '15 mai 2023',
      author: 'Admin'
    },
    {
      id: 2,
      title: 'Prévention des fraudes mobiles au Bénin',
      type: 'Blog',
      status: 'Brouillon',
      date: '22 juin 2023',
      author: 'Admin'
    },
    {
      id: 3,
      title: 'Protéger votre vie privée sur les réseaux sociaux',
      type: 'Video',
      status: 'Publié',
      date: '8 juil. 2023',
      author: 'Admin'
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestion du contenu</h2>
        <button 
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + Nouveau contenu
        </button>
      </div>

      <div className={styles.filters}>
        <select className={styles.filterSelect}>
          <option value="">Tous les types</option>
          <option value="blog">Blog</option>
          <option value="video">Vidéo</option>
          <option value="podcast">Podcast</option>
        </select>
        
        <select className={styles.filterSelect}>
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
        </select>
      </div>

      <div className={styles.contentGrid}>
        {contents.map(content => (
          <div key={content.id} className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <span className={`${styles.badge} ${styles[content.type.toLowerCase()]}`}>
                {content.type}
              </span>
              <span className={`${styles.status} ${styles[content.status.toLowerCase()]}`}>
                {content.status}
              </span>
            </div>
            
            <h3>{content.title}</h3>
            
            <div className={styles.cardFooter}>
              <span>{content.date}</span>
              <div className={styles.actions}>
                <button className={styles.editBtn}>Modifier</button>
                <button className={styles.deleteBtn}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Créer un nouveau contenu</h3>
            <form className={styles.form}>
              <input type="text" placeholder="Titre du contenu" />
              <select>
                <option value="">Type de contenu</option>
                <option value="blog">Blog</option>
                <option value="video">Vidéo</option>
                <option value="podcast">Podcast</option>
              </select>
              <textarea placeholder="Description"></textarea>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </button>
                <button type="submit">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// components/Analytics.js
import styles from '../styles/Analytics.module.css'

export default function Analytics() {
  const stats = [
    { label: 'Vues totales', value: '12,543', change: '+12%' },
    { label: 'Utilisateurs actifs', value: '3,421', change: '+8%' },
    { label: 'Articles publiés', value: '87', change: '+5%' },
    { label: 'Engagement', value: '68%', change: '-2%' }
  ]

  return (
    <div className={styles.container}>
      <h2>Analyses et statistiques</h2>
      
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
            <span className={`${styles.change} ${stat.change.startsWith('+') ? styles.positive : styles.negative}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartContainer}>
        <h3>Trafic des 30 derniers jours</h3>
        <div className={styles.chart}>
          <div className={styles.chartPlaceholder}>
            📈 Graphique des statistiques
          </div>
        </div>
      </div>
    </div>
  )
}

// components/UserManagement.js
import styles from '../styles/UserManagement.module.css'

export default function UserManagement() {
  const users = [
    { id: 1, name: 'Jean Kouassi', email: 'jean@example.com', role: 'Éditeur', status: 'Actif' },
    { id: 2, name: 'Marie Danho', email: 'marie@example.com', role: 'Auteur', status: 'Actif' },
    { id: 3, name: 'Paul Sossou', email: 'paul@example.com', role: 'Lecteur', status: 'Inactif' }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestion des utilisateurs</h2>
        <button className={styles.addBtn}>+ Ajouter utilisateur</button>
      </div>

      <div className={styles.userTable}>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`${styles.status} ${styles[user.status.toLowerCase()]}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className={styles.editBtn}>Modifier</button>
                  <button className={styles.deleteBtn}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// components/Settings.js
import { useTheme } from '../contexts/ThemeContext'
import styles from '../styles/Settings.module.css'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={styles.container}>
      <h2>Paramètres</h2>
      
      <div className={styles.section}>
        <h3>Apparence</h3>
        <div className={styles.setting}>
          <label>Thème</label>
          <button onClick={toggleTheme} className={styles.themeBtn}>
            {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Site Web</h3>
        <div className={styles.setting}>
          <label>Nom du site</label>
          <input type="text" defaultValue="Djofo.bj" />
        </div>
        <div className={styles.setting}>
          <label>Description</label>
          <textarea defaultValue="Plateforme de sensibilisation à la cybersécurité au Bénin"></textarea>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Notifications</h3>
        <div className={styles.setting}>
          <label>
            <input type="checkbox" defaultChecked />
            Notifications par email
          </label>
        </div>
        <div className={styles.setting}>
          <label>
            <input type="checkbox" />
            Notifications push
          </label>
        </div>
      </div>

      <button className={styles.saveBtn}>Sauvegarder les paramètres</button>
    </div>
  )
}

/* styles/globals.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.theme-light {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --shadow: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-lg: 0 4px 6px rgba(0,0,0,0.07);
  --accent: #28a745;
  --accent-hover: #218838;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
}

.theme-dark {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #404040;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #404040;
  --shadow: 0 2px 4px rgba(0,0,0,0.3);
  --shadow-lg: 0 4px 6px rgba(0,0,0,0.2);
  --accent: #28a745;
  --accent-hover: #218838;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

/* styles/Login.module.css */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.loginCard {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
  position: relative;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.header h1 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.header p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
}

.formGroup label {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.formGroup input {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.formGroup input:focus {
  outline: none;
  border-color: var(--accent);
}

.error {
  background: #fee;
  color: var(--danger);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.submitBtn {
  background: var(--accent);
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submitBtn:hover:not(:disabled) {
  background: var(--accent-hover);
}

.submitBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.demo p {
  margin-bottom: 0.25rem;
}

.themeToggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
}

/* styles/Dashboard.module.css */
.dashboard {
  display: flex;
  height: 100vh;
  background: var(--bg-secondary);
}

.main {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mainExpanded {
  margin-left: 80px;
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main {
    margin-left: 0;
  }
  
  .mainExpanded {
    margin-left: 0;
  }
}

/* styles/Sidebar.module.css */
.sidebar {
  width: 250px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  transition: width 0.3s ease;
  z-index: 1000;
}

.collapsed {
  width: 80px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.brand img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.brand span {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nav {
  padding: 1rem 0;
}

.navItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navItem