import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight, Home } from 'lucide-react';

const BREADCRUMB_CONFIG = {
  '/': { label: 'Home', show: true },
  '/CVBuilder': { label: 'CV Builder', show: true },
  '/Home': { 
    label: 'Form', 
    show: (search) => {
      const params = new URLSearchParams(search);
      return params.get('step') === 'form' || params.get('template');
    }
  },
  '/Success': { label: 'Preview', show: true },
  '/PaymentSuccess': { label: 'Success', show: true }
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;
  const search = location.search;

  // Build breadcrumb trail based on current route
  const buildBreadcrumbs = () => {
    const crumbs = [];
    
    // Always show Home
    crumbs.push({
      label: 'Home',
      path: '/',
      isActive: pathname === '/'
    });

    // Check if we're on CV Builder page
    if (pathname === '/CVBuilder' || pathname.includes('CVBuilder')) {
      crumbs.push({
        label: 'CV Builder',
        path: '/CVBuilder',
        isActive: pathname === '/CVBuilder'
      });
    }

    // Check if we're on form page (Home with template/step params)
    if (pathname === '/' || pathname === '/Home') {
      const params = new URLSearchParams(search);
      if (params.get('step') === 'form' || params.get('template')) {
        crumbs.push({
          label: 'Form',
          path: null, // Current page
          isActive: true
        });
      }
    }

    // Check if we're on preview/success page
    if (pathname === '/Success' || pathname.includes('Success')) {
      crumbs.push({
        label: 'Preview',
        path: null,
        isActive: true
      });
    }

    return crumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  // Don't show breadcrumbs if only Home is present
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {crumb.path && !crumb.isActive ? (
            <Link
              to={crumb.path}
              className="hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              {index === 0 && <Home className="h-4 w-4" />}
              <span>{crumb.label}</span>
            </Link>
          ) : (
            <span
              className={`flex items-center gap-1 ${
                crumb.isActive ? 'text-black font-medium' : 'text-gray-500'
              }`}
            >
              {index === 0 && <Home className="h-4 w-4" />}
              <span>{crumb.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

