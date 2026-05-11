import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  HeartIcon,
  SparklesIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  home: HomeIcon,
  edit: DocumentTextIcon,
  history: ChartBarIcon,
  fitness: HeartIcon,
  brain: SparklesIcon,
  people: UserGroupIcon,
  globe: GlobeAltIcon,
};

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Tabs base para atletas
  const atletsNavItems = [
    { path: '/inicio', label: 'Inicio', icon: 'home' },
    { path: '/registro', label: 'Registro', icon: 'edit' },
    { path: '/historia', label: 'Historia', icon: 'history' },
    { path: '/wellness', label: 'Wellness', icon: 'fitness' },
    { path: '/tests', label: 'Tests', icon: 'brain' },
    { path: '/comunidad', label: 'Comunidad', icon: 'people' },
  ];

  // Tabs para entrenadores
  const coachNavItems = [
    { path: '/inicio', label: 'Inicio', icon: 'home' },
    { path: '/registro', label: 'Registro', icon: 'edit' },
    { path: '/historia', label: 'Historia', icon: 'history' },
    { path: '/wellness', label: 'Wellness', icon: 'fitness' },
    { path: '/tests', label: 'Tests', icon: 'brain' },
    { path: '/comunidad', label: 'Comunidad', icon: 'globe' },
  ];

  // Tabs para psicólogo deportivo
  const psychologistNavItems = [
    { path: '/psicologo', label: 'Mis Atletas', icon: 'people' },
    { path: '/comunidad', label: 'Comunidad', icon: 'globe' },
  ];

  let navItems = atletsNavItems;
  if (user?.rol === 'entrenador') {
    navItems = coachNavItems;
  } else if (user?.rol === 'psicologo_deportivo') {
    navItems = psychologistNavItems;
  }

  const renderIcon = (iconName) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 border-t overflow-x-auto"
      style={{
        backgroundColor: '#1a1f2e',
        borderColor: '#30363d',
      }}
    >
      <div className="flex justify-around min-w-max sm:min-w-full">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-shrink-0 py-3 px-2 text-center font-medium transition flex flex-col items-center ${
              location.pathname === item.path ? 'border-t-2' : ''
            }`}
            style={{
              borderTopColor: location.pathname === item.path ? '#00d4ff' : 'transparent',
              color: location.pathname === item.path ? '#00d4ff' : '#8b92a4',
            }}
          >
            <div className="mb-1">{renderIcon(item.icon)}</div>
            <div className="text-xs whitespace-nowrap">{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
