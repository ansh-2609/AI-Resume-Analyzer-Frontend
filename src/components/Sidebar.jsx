
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { text: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { text: 'Job Matches', icon: BriefcaseIcon, path: '/jobmatcher' },
  { text: 'Applications', icon: ChartBarIcon, path: '/applications' },
  { text: 'Interview Prep', icon: ChatBubbleLeftRightIcon, path: '/interview' },
  { text: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];

function Sidebar({ isMobile = false, onClose }) {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === 'dark';

  const baseClasses = `flex flex-col h-full ${
    isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
  }`;

  const desktopClasses =
    'hidden lg:block fixed inset-y-0 z-40 w-64 border-r border-gray-200 dark:border-gray-800';

  const mobileClasses = 'fixed inset-0 z-50 lg:hidden';

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto px-6 pb-4">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        <h2 className="text-lg font-semibold">
          Navigation
        </h2>

        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-6">
          <li>
            <ul className="-mx-2 space-y-1">
              {menuItems.map(({ text, icon: Icon, path }) => (
                <li key={text}>
                  <NavLink
                    to={path}
                    onClick={isMobile ? onClose : undefined}
                    className={({ isActive }) =>
                      `group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-5 w-5 transition ${
                            isActive
                              ? 'text-white'
                              : isDark
                              ? 'text-gray-400 group-hover:text-white'
                              : 'text-gray-400 group-hover:text-blue-600'
                          }`}
                        />
                        <span>{text}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <div className={mobileClasses}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Sidebar panel */}
        <div className="fixed inset-y-0 left-0 w-64 max-w-xs">
          <div className={baseClasses}>{sidebarContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${desktopClasses}`}>
      {sidebarContent}
    </div>
  );
}

export default Sidebar;
