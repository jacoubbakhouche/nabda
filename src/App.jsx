import { useState } from 'react'
import Layout from './components/Layout'
import MothersHealthScreen from './screens/MothersHealthScreen'
import CommunityFeedScreen from './screens/CommunityFeedScreen'
import PregnancyJourneyScreen from './screens/PregnancyJourneyScreen'
import PhysicScreen from './screens/PhysicScreen'
import CategoryGridScreen from './screens/CategoryGridScreen'
import FollowUpScreen from './screens/FollowUpScreen'
import AppointmentsScreen from './screens/AppointmentsScreen'
import PrepareBirthScreen from './screens/PrepareBirthScreen'
import MedicalRecordsScreen from './screens/MedicalRecordsScreen'
import LibraryScreen from './screens/LibraryScreen'
import WellbeingScreen from './screens/WellbeingScreen'
import JournalScreen from './screens/JournalScreen'
import PostpartumScreen from './screens/PostpartumScreen'
import AuthScreen from './screens/AuthScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import ProfileScreen from './screens/ProfileScreen'
import SplashScreen from './screens/SplashScreen'
import { PregnancyProvider, usePregnancy } from './context/PregnancyContext'
import './index.css'

function AppContent() {
  const { isAuthenticated, isOnboarded } = usePregnancy();
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('main'); // main, categories, follow-up, appointments, prepare, medical

  if (!isAuthenticated) return <AuthScreen />;
  if (!isOnboarded) return <OnboardingScreen />;

  const renderScreen = () => {
    if (activeTab === 'home') {
      switch (currentView) {
        case 'categories':
          return <CategoryGridScreen
            onBack={() => setCurrentView('main')}
            onSelectCategory={(id) => setCurrentView(id)}
          />;
        case 'library':
          return <LibraryScreen onBack={() => setCurrentView('main')} />;
        case 'follow-up':
          return <FollowUpScreen onBack={() => setCurrentView('categories')} />;
        case 'appointments':
          return <AppointmentsScreen onBack={() => setCurrentView('categories')} />;
        case 'prepare':
          return <PrepareBirthScreen onBack={() => setCurrentView('categories')} />;
        case 'medical':
          return <MedicalRecordsScreen onBack={() => setCurrentView('main')} />;
        case 'wellness':
          return <WellbeingScreen onBack={() => setCurrentView('main')} />;
        case 'diary':
          return <JournalScreen onBack={() => setCurrentView('main')} />;
        case 'baby-care':
          return <PostpartumScreen onBack={() => setCurrentView('main')} />;
        case 'main':
        default:
          return <PregnancyJourneyScreen onSelectCategory={(id) => setCurrentView(id)} />;
      }
    }

    switch (activeTab) {
      case 'watch':
        return <CommunityFeedScreen />;
      case 'ai':
        return <PhysicScreen onSelectCategory={(id) => { setActiveTab('home'); setCurrentView(id); }} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <PregnancyJourneyScreen onSelectCategory={(id) => setCurrentView(id)} />;
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentView('main');
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange}>
      {renderScreen()}
    </Layout>
  )
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <PregnancyProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <AppContent />
    </PregnancyProvider>
  )
}

export default App
