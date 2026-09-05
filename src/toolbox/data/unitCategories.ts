import type { UnitCategory } from '@/toolbox/lib/types'

export const unitCategories: Record<string, UnitCategory> = {
    Length: {
        baseUnit: 'meter',
        units: {
            'Millimeter': { symbol: 'mm', toBase: 0.001 },
            'Centimeter': { symbol: 'cm', toBase: 0.01 },
            'Meter': { symbol: 'm', toBase: 1 },
            'Kilometer': { symbol: 'km', toBase: 1000 },
            'Inch': { symbol: 'in', toBase: 0.0254 },
            'Foot': { symbol: 'ft', toBase: 0.3048 },
            'Yard': { symbol: 'yd', toBase: 0.9144 },
            'Mile': { symbol: 'mi', toBase: 1609.34 },
            'Thou (mil)': { symbol: 'thou', toBase: 0.0000254 },
        },
    },
    Weight: {
        baseUnit: 'kilogram',
        units: {
            'Gram': { symbol: 'g', toBase: 0.001 },
            'Kilogram': { symbol: 'kg', toBase: 1 },
            'Ton (metric)': { symbol: 't', toBase: 1000 },
            'Ounce': { symbol: 'oz', toBase: 0.0283495 },
            'Pound': { symbol: 'lb', toBase: 0.453592 },
            'Ton (US)': { symbol: 'ton', toBase: 907.185 },
        },
    },
    Volume: {
        baseUnit: 'liter',
        units: {
            'Milliliter': { symbol: 'mL', toBase: 0.001 },
            'Liter': { symbol: 'L', toBase: 1 },
            'Cubic Meter': { symbol: 'm³', toBase: 1000 },
            'Fluid Ounce': { symbol: 'fl oz', toBase: 0.0295735 },
            'Cup': { symbol: 'cup', toBase: 0.236588 },
            'Pint': { symbol: 'pt', toBase: 0.473176 },
            'Quart': { symbol: 'qt', toBase: 0.946353 },
            'Gallon (US)': { symbol: 'gal', toBase: 3.78541 },
            'Cubic Inch': { symbol: 'in³', toBase: 0.0163871 },
            'Cubic Foot': { symbol: 'ft³', toBase: 28.3168 },
        },
    },
    Temperature: {
        baseUnit: 'celsius',
        units: {
            'Celsius': { symbol: '°C', toBase: null },
            'Fahrenheit': { symbol: '°F', toBase: null },
            'Kelvin': { symbol: 'K', toBase: null },
        },
        convert: (value: number, fromUnit: string, toUnit: string): number => {
            let celsius: number
            if (fromUnit === 'Celsius') celsius = value
            else if (fromUnit === 'Fahrenheit') celsius = (value - 32) * 5 / 9
            else celsius = value - 273.15 // Kelvin

            if (toUnit === 'Celsius') return celsius
            else if (toUnit === 'Fahrenheit') return (celsius * 9 / 5) + 32
            else return celsius + 273.15 // Kelvin
        },
    },
    Pressure: {
        baseUnit: 'pascal',
        units: {
            'Pascal': { symbol: 'Pa', toBase: 1 },
            'Kilopascal': { symbol: 'kPa', toBase: 1000 },
            'Megapascal': { symbol: 'MPa', toBase: 1000000 },
            'Bar': { symbol: 'bar', toBase: 100000 },
            'PSI': { symbol: 'psi', toBase: 6894.76 },
            'Atmosphere': { symbol: 'atm', toBase: 101325 },
        },
    },
    Power: {
        baseUnit: 'watt',
        units: {
            'Watt': { symbol: 'W', toBase: 1 },
            'Kilowatt': { symbol: 'kW', toBase: 1000 },
            'Megawatt': { symbol: 'MW', toBase: 1000000 },
            'Horsepower': { symbol: 'HP', toBase: 745.699 },
            'BTU/hour': { symbol: 'BTU/hr', toBase: 0.293071 },
            'Foot-pound/sec': { symbol: 'ft·lb/s', toBase: 1.35582 },
        },
    },
    Area: {
        baseUnit: 'squareMeter',
        units: {
            'Square Millimeter': { symbol: 'mm²', toBase: 0.000001 },
            'Square Centimeter': { symbol: 'cm²', toBase: 0.0001 },
            'Square Meter': { symbol: 'm²', toBase: 1 },
            'Square Kilometer': { symbol: 'km²', toBase: 1000000 },
            'Square Inch': { symbol: 'in²', toBase: 0.00064516 },
            'Square Foot': { symbol: 'ft²', toBase: 0.092903 },
            'Square Yard': { symbol: 'yd²', toBase: 0.836127 },
            'Acre': { symbol: 'ac', toBase: 4046.86 },
            'Hectare': { symbol: 'ha', toBase: 10000 },
        },
    },
    Speed: {
        baseUnit: 'meterPerSecond',
        units: {
            'Meter/second': { symbol: 'm/s', toBase: 1 },
            'Kilometer/hour': { symbol: 'km/h', toBase: 0.277778 },
            'Mile/hour': { symbol: 'mph', toBase: 0.44704 },
            'Foot/second': { symbol: 'ft/s', toBase: 0.3048 },
            'Knot': { symbol: 'kn', toBase: 0.514444 },
        },
    },
    Energy: {
        baseUnit: 'joule',
        units: {
            'Joule': { symbol: 'J', toBase: 1 },
            'Kilojoule': { symbol: 'kJ', toBase: 1000 },
            'Calorie': { symbol: 'cal', toBase: 4.184 },
            'Kilocalorie': { symbol: 'kcal', toBase: 4184 },
            'Watt-hour': { symbol: 'Wh', toBase: 3600 },
            'Kilowatt-hour': { symbol: 'kWh', toBase: 3600000 },
            'BTU': { symbol: 'BTU', toBase: 1055.06 },
        },
    },
    Torque: {
        baseUnit: 'newtonMeter',
        units: {
            'Newton-meter': { symbol: 'N·m', toBase: 1 },
            'Newton-centimeter': { symbol: 'N·cm', toBase: 0.01 },
            'Kilonewton-meter': { symbol: 'kN·m', toBase: 1000 },
            'Foot-pound': { symbol: 'ft·lb', toBase: 1.35582 },
            'Inch-pound': { symbol: 'in·lb', toBase: 0.112985 },
        },
    },
    Force: {
        baseUnit: 'newton',
        units: {
            'Newton': { symbol: 'N', toBase: 1 },
            'Kilonewton': { symbol: 'kN', toBase: 1000 },
            'Pound-force': { symbol: 'lbf', toBase: 4.44822 },
            'Kip': { symbol: 'kip', toBase: 4448.22 },
            'Kilogram-force': { symbol: 'kgf', toBase: 9.80665 },
            'Dyne': { symbol: 'dyn', toBase: 0.00001 },
            'Ounce-force': { symbol: 'ozf', toBase: 0.278014 },
        },
    },
    Angle: {
        baseUnit: 'radian',
        units: {
            'Degree': { symbol: '°', toBase: Math.PI / 180 },
            'Radian': { symbol: 'rad', toBase: 1 },
            'Gradian': { symbol: 'grad', toBase: Math.PI / 200 },
            'Arcminute': { symbol: '′', toBase: Math.PI / 10800 },
            'Arcsecond': { symbol: '″', toBase: Math.PI / 648000 },
            'Turn': { symbol: 'turn', toBase: 2 * Math.PI },
            'Milliradian': { symbol: 'mrad', toBase: 0.001 },
        },
    },
    'Data Storage': {
        baseUnit: 'byte',
        units: {
            'Bit': { symbol: 'b', toBase: 0.125 },
            'Byte': { symbol: 'B', toBase: 1 },
            'Kilobyte': { symbol: 'KB', toBase: 1024 },
            'Megabyte': { symbol: 'MB', toBase: 1048576 },
            'Gigabyte': { symbol: 'GB', toBase: 1073741824 },
            'Terabyte': { symbol: 'TB', toBase: 1099511627776 },
            'Petabyte': { symbol: 'PB', toBase: 1125899906842624 },
            'Kibibyte': { symbol: 'KiB', toBase: 1024 },
            'Mebibyte': { symbol: 'MiB', toBase: 1048576 },
            'Gibibyte': { symbol: 'GiB', toBase: 1073741824 },
        },
    },
    'Flow Rate': {
        baseUnit: 'literPerMinute',
        units: {
            'Liter/minute': { symbol: 'L/min', toBase: 1 },
            'Liter/second': { symbol: 'L/s', toBase: 60 },
            'Liter/hour': { symbol: 'L/hr', toBase: 1 / 60 },
            'Cubic meter/hour': { symbol: 'm³/hr', toBase: 16.6667 },
            'Cubic meter/second': { symbol: 'm³/s', toBase: 60000 },
            'Gallon (US)/minute': { symbol: 'gpm', toBase: 3.78541 },
            'Gallon (US)/hour': { symbol: 'gph', toBase: 0.0630902 },
            'Cubic foot/minute': { symbol: 'cfm', toBase: 28.3168 },
            'Cubic foot/hour': { symbol: 'cfh', toBase: 0.471947 },
        },
    },
    Density: {
        baseUnit: 'kilogramPerCubicMeter',
        units: {
            'Kilogram/cubic meter': { symbol: 'kg/m³', toBase: 1 },
            'Gram/cubic centimeter': { symbol: 'g/cm³', toBase: 1000 },
            'Kilogram/liter': { symbol: 'kg/L', toBase: 1000 },
            'Gram/milliliter': { symbol: 'g/mL', toBase: 1000 },
            'Pound/cubic foot': { symbol: 'lb/ft³', toBase: 16.0185 },
            'Pound/cubic inch': { symbol: 'lb/in³', toBase: 27679.9 },
            'Pound/gallon (US)': { symbol: 'lb/gal', toBase: 119.826 },
            'Ounce/cubic inch': { symbol: 'oz/in³', toBase: 1729.99 },
        },
    },
    'Flow Coefficient': {
        baseUnit: 'cv',
        units: {
            'Cv (US)': { symbol: 'Cv', toBase: 1 },
            'Kv (metric)': { symbol: 'Kv', toBase: 1.156 },
        },
    },
}
