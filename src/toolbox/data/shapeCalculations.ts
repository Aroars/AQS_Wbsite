/**
 * Shape Calculation Definitions
 * Contains shape formulas and icons for area calculator
 * @module config/shapeCalculations
 */

/**
 * Shape icons for memory display - simple SVG icons
 */
export const shapeIcons: Record<string, string> = {
    'Rectangle': '<svg class="shape-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="12" rx="1" fill="#8B9D77" stroke="#6B7D57" stroke-width="1"/></svg>',
    'Circle': '<svg class="shape-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#6B8BA0" stroke="#4A6B80" stroke-width="1"/></svg>',
    'Half Circle': '<svg class="shape-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12a9 9 0 0 1 18 0H3z" fill="#6B8BA0" stroke="#4A6B80" stroke-width="1"/></svg>',
    'Triangle': '<svg class="shape-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L21 20H3L12 4z" fill="#D4A574" stroke="#B48554" stroke-width="1"/></svg>',
    'Ellipse': '<svg class="shape-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#8B7BA8" stroke="#6B5B88" stroke-width="1"/></svg>',
    'Trapezoid': '<svg class="shape-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6h12l3 12H3L6 6z" fill="#7C9885" stroke="#5A7A63" stroke-width="1"/></svg>'
};

/**
 * Shape calculation formulas
 * Each shape has inputs and a calculation function
 */
export const shapeCalculations: Record<string, any> = {
    'Rectangle': {
        inputs: ['Length', 'Width'],
        calculate: (length: number, width: number) => length * width
    },
    'Circle': {
        inputs: ['Radius'],
        calculate: (radius: number) => Math.PI * radius * radius
    },
    'Half Circle': {
        inputs: ['Radius'],
        calculate: (radius: number) => (Math.PI * radius * radius) / 2
    },
    'Triangle': {
        inputs: ['Base', 'Height'],
        calculate: (base: number, height: number) => (base * height) / 2
    },
    'Ellipse': {
        inputs: ['Major Axis', 'Minor Axis'],
        // Inputs are FULL axes (not semi-axes): A = π·(a/2)·(b/2) = π·a·b/4
        calculate: (major: number, minor: number) => (Math.PI * major * minor) / 4
    },
    'Trapezoid': {
        inputs: ['Base 1', 'Base 2', 'Height'],
        calculate: (base1: number, base2: number, height: number) => ((base1 + base2) / 2) * height
    }
};
