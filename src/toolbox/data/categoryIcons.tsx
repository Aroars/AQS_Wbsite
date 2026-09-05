/* Category icons as React components
   Line-and-fill style SVGs with currentColor for theme support */

interface IconProps {
    className?: string
}

function Icon({ className = "w-5 h-5", children }: IconProps & { children: React.ReactNode }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {children}
        </svg>
    )
}

export const categoryIcons: Record<string, (props?: IconProps) => React.ReactNode> = {
    'Length': (props) => (
        <Icon {...props}>
            <rect x="2" y="9" width="20" height="6" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x="2" y="9" width="20" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="5" y1="9" x2="5" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="13" y1="9" x2="13" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="17" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" />
        </Icon>
    ),
    'Weight': (props) => (
        <Icon {...props}>
            <path d="M12 3C10.34 3 9 4.34 9 6C9 6.35 9.07 6.69 9.18 7H6L4 19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19L18 7H14.82C14.93 6.69 15 6.35 15 6C15 4.34 13.66 3 12 3Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M12 3C10.34 3 9 4.34 9 6C9 6.35 9.07 6.69 9.18 7H6L4 19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19L18 7H14.82C14.93 6.69 15 6.35 15 6C15 4.34 13.66 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
        </Icon>
    ),
    'Volume': (props) => (
        <Icon {...props}>
            <path d="M7 3H17L19 7V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V7L7 3Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M7 3H17L19 7V20C19 20.55 18.55 21 18 21H6C5.45 21 5 20.55 5 20V7L7 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M5 7H19" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 11C8 11 10 13 12 13C14 13 16 11 16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </Icon>
    ),
    'Temperature': (props) => (
        <Icon {...props}>
            <path d="M14 14.76V5C14 3.9 13.1 3 12 3C10.9 3 10 3.9 10 5V14.76C8.79 15.45 8 16.74 8 18C8 20.21 9.79 22 12 22C14.21 22 16 20.21 16 18C16 16.74 15.21 15.45 14 14.76Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M14 14.76V5C14 3.9 13.1 3 12 3C10.9 3 10 3.9 10 5V14.76C8.79 15.45 8 16.74 8 18C8 20.21 9.79 22 12 22C14.21 22 16 20.21 16 18C16 16.74 15.21 15.45 14 14.76Z" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="18" r="2" fill="currentColor" />
            <line x1="12" y1="16" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </Icon>
    ),
    'Pressure': (props) => (
        <Icon {...props}>
            <circle cx="12" cy="13" r="8" fill="currentColor" fillOpacity="0.15" />
            <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 9V13L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19 13H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 13H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </Icon>
    ),
    'Power': (props) => (
        <Icon {...props}>
            <path d="M13 2L4 14H11L10 22L19 10H12L13 2Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M13 2L4 14H11L10 22L19 10H12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </Icon>
    ),
    'Area': (props) => (
        <Icon {...props}>
            <rect x="4" y="4" width="16" height="16" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" />
            <line x1="10" y1="4" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <line x1="16" y1="4" x2="16" y2="20" stroke="currentColor" strokeWidth="1.5" />
        </Icon>
    ),
    'Speed': (props) => (
        <Icon {...props}>
            <path d="M12 4C7.03 4 3 8.03 3 13C3 17.97 7.03 22 12 22C16.97 22 21 17.97 21 13C21 8.03 16.97 4 12 4Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M12 4C7.03 4 3 8.03 3 13C3 17.97 7.03 22 12 22C16.97 22 21 17.97 21 13C21 8.03 16.97 4 12 4Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 13L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="13" r="2" fill="currentColor" />
        </Icon>
    ),
    'Energy': (props) => (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Icon>
    ),
    'Torque': (props) => (
        <Icon {...props}>
            <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.15" />
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
        </Icon>
    ),
    'Force': (props) => (
        <Icon {...props}>
            <path d="M12 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="6" y="18" width="12" height="3" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x="6" y="18" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </Icon>
    ),
    'Angle': (props) => (
        <Icon {...props}>
            <path d="M4 20L12 4L20 20H4Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M4 20L12 4L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </Icon>
    ),
    'Data Storage': (props) => (
        <Icon {...props}>
            <rect x="4" y="4" width="16" height="5" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x="4" y="4" width="16" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="4" y="10" width="16" height="5" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x="4" y="10" width="16" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="4" y="16" width="16" height="5" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x="4" y="16" width="16" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7" cy="6.5" r="1" fill="currentColor" />
            <circle cx="7" cy="12.5" r="1" fill="currentColor" />
            <circle cx="7" cy="18.5" r="1" fill="currentColor" />
        </Icon>
    ),
    'Flow Rate': (props) => (
        <Icon {...props}>
            <path d="M4 12C4 12 8 6 12 6C16 6 20 12 20 12C20 12 16 18 12 18C8 18 4 12 4 12Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M4 12C4 12 8 6 12 6C16 6 20 12 20 12C20 12 16 18 12 18C8 18 4 12 4 12Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M13 9L16 12L13 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Icon>
    ),
    'Density': (props) => (
        <Icon {...props}>
            <rect x="5" y="7" width="14" height="14" rx="1" fill="currentColor" fillOpacity="0.15" />
            <rect x="5" y="7" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="11" r="1.5" fill="currentColor" />
            <circle cx="15" cy="11" r="1.5" fill="currentColor" />
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
            <circle cx="9" cy="17" r="1.5" fill="currentColor" />
            <circle cx="15" cy="17" r="1.5" fill="currentColor" />
            <path d="M10 3L12 7L14 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Icon>
    ),
    'Flow Coefficient': (props) => (
        <Icon {...props}>
            <circle cx="12" cy="12" r="8" fill="currentColor" fillOpacity="0.15" />
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 15H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </Icon>
    ),
}
