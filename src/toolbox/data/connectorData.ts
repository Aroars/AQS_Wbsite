/**
 * Industrial Connector & Communication Standards Data
 * @module data/connectorData
 *
 * Reference data for industrial connectors, supported protocols,
 * pinouts, and specifications.
 */

// Connector definitions with full specifications
export const connectors: Record<string, any> = {
    'M8-3': {
        name: 'M8 3-Pin',
        category: 'M8',
        pinCount: 3,
        description: 'Compact circular connector for sensors',
        ipRating: 'IP67',
        maxVoltage: '30V DC',
        maxCurrent: '4A',
        protocols: ['Binary I/O', 'Analog 0-10V', 'Analog 4-20mA'],
        commonUses: ['Proximity sensors', 'Photoelectric sensors', 'Simple actuators'],
        pinout: [
            { pin: 1, signal: '+V / BN', description: 'Power positive (Brown)' },
            { pin: 2, signal: '0V / BU', description: 'Power negative (Blue)' },
            { pin: 3, signal: 'OUT / BK', description: 'Signal output (Black)' }
        ],
        notes: 'Most common sensor connector. Colors follow IEC 60947-5-2.'
    },
    'M8-4': {
        name: 'M8 4-Pin',
        category: 'M8',
        pinCount: 4,
        description: 'Circular connector for sensors with dual outputs',
        ipRating: 'IP67',
        maxVoltage: '30V DC',
        maxCurrent: '4A',
        protocols: ['Binary I/O', 'Analog 0-10V', 'Analog 4-20mA', 'IO-Link'],
        commonUses: ['Sensors with NO/NC outputs', 'IO-Link devices', 'Analog sensors'],
        pinout: [
            { pin: 1, signal: '+V / BN', description: 'Power positive (Brown)' },
            { pin: 2, signal: 'OUT2 / WH', description: 'Signal output 2 (White)' },
            { pin: 3, signal: '0V / BU', description: 'Power negative (Blue)' },
            { pin: 4, signal: 'OUT1 / BK', description: 'Signal output 1 (Black)' }
        ],
        notes: 'Pin 2 used for NC output or IO-Link C/Q line.'
    },
    'M12-4-A': {
        name: 'M12 4-Pin A-Coded',
        category: 'M12',
        pinCount: 4,
        description: 'Standard industrial sensor/actuator connector',
        ipRating: 'IP67/IP68',
        maxVoltage: '60V DC',
        maxCurrent: '4A',
        protocols: ['Binary I/O', 'Analog 0-10V', 'Analog 4-20mA', 'IO-Link', 'AS-Interface'],
        commonUses: ['Industrial sensors', 'Actuators', 'IO-Link devices', 'Valve manifolds'],
        pinout: [
            { pin: 1, signal: '+V / BN', description: 'Power positive (Brown)' },
            { pin: 2, signal: 'OUT2 / WH', description: 'Signal output 2 (White)' },
            { pin: 3, signal: '0V / BU', description: 'Power negative (Blue)' },
            { pin: 4, signal: 'OUT1 / BK', description: 'Signal output 1 (Black)' }
        ],
        notes: 'Most common industrial connector. A-coding is standard sensor/actuator.'
    },
    'M12-5-A': {
        name: 'M12 5-Pin A-Coded',
        category: 'M12',
        pinCount: 5,
        description: 'Extended sensor connector with shield',
        ipRating: 'IP67/IP68',
        maxVoltage: '60V DC',
        maxCurrent: '4A',
        protocols: ['Binary I/O', 'Analog 0-10V', 'Analog 4-20mA', 'IO-Link', 'DeviceNet'],
        commonUses: ['Shielded sensors', 'DeviceNet devices', 'Complex sensors'],
        pinout: [
            { pin: 1, signal: '+V / BN', description: 'Power positive (Brown)' },
            { pin: 2, signal: 'OUT2 / WH', description: 'Signal output 2 (White)' },
            { pin: 3, signal: '0V / BU', description: 'Power negative (Blue)' },
            { pin: 4, signal: 'OUT1 / BK', description: 'Signal output 1 (Black)' },
            { pin: 5, signal: 'Shield / GY', description: 'Cable shield (Gray)' }
        ],
        notes: 'Pin 5 for shield connection or DeviceNet V-.'
    },
    'M12-4-D': {
        name: 'M12 4-Pin D-Coded',
        category: 'M12',
        pinCount: 4,
        description: 'Industrial Ethernet connector (100 Mbps)',
        ipRating: 'IP67/IP68',
        maxVoltage: 'N/A',
        maxCurrent: 'N/A',
        dataRate: '100 Mbps',
        maxLength: '100m',
        protocols: ['Ethernet/IP', 'PROFINET', 'Modbus TCP', 'EtherCAT'],
        commonUses: ['Industrial Ethernet devices', 'IP cameras', 'HMIs', 'PLCs'],
        pinout: [
            { pin: 1, signal: 'TD+', description: 'Transmit Data +' },
            { pin: 2, signal: 'RD+', description: 'Receive Data +' },
            { pin: 3, signal: 'TD-', description: 'Transmit Data -' },
            { pin: 4, signal: 'RD-', description: 'Receive Data -' }
        ],
        notes: 'D-coding specifically for 100 Mbps Ethernet. Not compatible with A-coded.'
    },
    'M12-8-A': {
        name: 'M12 8-Pin A-Coded',
        category: 'M12',
        pinCount: 8,
        description: 'High pin count sensor connector',
        ipRating: 'IP67/IP68',
        maxVoltage: '30V DC',
        maxCurrent: '2A',
        protocols: ['Binary I/O', 'Analog', 'RS-232', 'RS-485'],
        commonUses: ['Multi-channel sensors', 'Serial communication', 'Complex I/O'],
        pinout: [
            { pin: 1, signal: 'Pin 1', description: 'Varies by application' },
            { pin: 2, signal: 'Pin 2', description: 'Varies by application' },
            { pin: 3, signal: 'Pin 3', description: 'Varies by application' },
            { pin: 4, signal: 'Pin 4', description: 'Varies by application' },
            { pin: 5, signal: 'Pin 5', description: 'Varies by application' },
            { pin: 6, signal: 'Pin 6', description: 'Varies by application' },
            { pin: 7, signal: 'Pin 7', description: 'Varies by application' },
            { pin: 8, signal: 'Pin 8', description: 'Varies by application' }
        ],
        notes: 'Pinout varies significantly by manufacturer and application.'
    },
    'M12-8-X': {
        name: 'M12 8-Pin X-Coded',
        category: 'M12',
        pinCount: 8,
        description: 'Industrial Gigabit Ethernet connector',
        ipRating: 'IP67/IP68',
        maxVoltage: 'N/A',
        maxCurrent: 'N/A',
        dataRate: '10 Gbps',
        maxLength: '100m',
        protocols: ['Gigabit Ethernet', 'PROFINET', 'Ethernet/IP', 'EtherCAT'],
        commonUses: ['High-speed industrial Ethernet', 'Vision systems', 'High-bandwidth devices'],
        pinout: [
            { pin: 1, signal: 'TD0+', description: 'Transmit pair 0 +' },
            { pin: 2, signal: 'TD0-', description: 'Transmit pair 0 -' },
            { pin: 3, signal: 'RD1+', description: 'Receive pair 1 +' },
            { pin: 4, signal: 'RD1-', description: 'Receive pair 1 -' },
            { pin: 5, signal: 'TD2+', description: 'Transmit pair 2 +' },
            { pin: 6, signal: 'TD2-', description: 'Transmit pair 2 -' },
            { pin: 7, signal: 'RD3+', description: 'Receive pair 3 +' },
            { pin: 8, signal: 'RD3-', description: 'Receive pair 3 -' }
        ],
        notes: 'X-coding for Cat 6A performance. Required for Gigabit in industrial environments.'
    },
    'RJ45': {
        name: 'RJ45 (8P8C)',
        category: 'RJ45',
        pinCount: 8,
        description: 'Standard Ethernet connector',
        ipRating: 'IP20 (unprotected)',
        maxVoltage: 'N/A',
        maxCurrent: 'N/A',
        dataRate: '10 Gbps',
        maxLength: '100m',
        protocols: ['Ethernet', 'PROFINET', 'Ethernet/IP', 'Modbus TCP', 'EtherCAT', 'BACnet/IP', 'PoE'],
        commonUses: ['Office/IT networking', 'Control panels', 'Non-washdown areas'],
        pinout: [
            { pin: 1, signal: 'TD0+', description: 'Transmit/Receive pair 0+ (White/Orange)' },
            { pin: 2, signal: 'TD0-', description: 'Transmit/Receive pair 0- (Orange)' },
            { pin: 3, signal: 'RD1+', description: 'Transmit/Receive pair 1+ (White/Green)' },
            { pin: 4, signal: 'BI2+', description: 'Bidirectional pair 2+ (Blue)' },
            { pin: 5, signal: 'BI2-', description: 'Bidirectional pair 2- (White/Blue)' },
            { pin: 6, signal: 'RD1-', description: 'Transmit/Receive pair 1- (Green)' },
            { pin: 7, signal: 'BI3+', description: 'Bidirectional pair 3+ (White/Brown)' },
            { pin: 8, signal: 'BI3-', description: 'Bidirectional pair 3- (Brown)' }
        ],
        notes: 'T568B color code shown. 100Mbps uses pins 1,2,3,6 only. Gigabit uses all 8.'
    },
    'DB9': {
        name: 'DB9 / DE-9',
        category: 'DB9',
        pinCount: 9,
        description: 'D-subminiature serial connector',
        ipRating: 'IP20 (unprotected)',
        maxVoltage: '±15V',
        maxCurrent: '500mA',
        dataRate: '115.2 kbps (RS-232), 10 Mbps (RS-485)',
        maxLength: '15m (RS-232), 1200m (RS-485)',
        protocols: ['RS-232', 'RS-485', 'RS-422', 'Modbus RTU', 'CAN'],
        commonUses: ['Serial communication', 'PLCs', 'HMIs', 'Legacy equipment'],
        pinout: [
            { pin: 1, signal: 'DCD', description: 'Data Carrier Detect' },
            { pin: 2, signal: 'RXD', description: 'Receive Data' },
            { pin: 3, signal: 'TXD', description: 'Transmit Data' },
            { pin: 4, signal: 'DTR', description: 'Data Terminal Ready' },
            { pin: 5, signal: 'GND', description: 'Signal Ground' },
            { pin: 6, signal: 'DSR', description: 'Data Set Ready' },
            { pin: 7, signal: 'RTS', description: 'Request To Send' },
            { pin: 8, signal: 'CTS', description: 'Clear To Send' },
            { pin: 9, signal: 'RI', description: 'Ring Indicator' }
        ],
        notes: 'RS-232 DTE pinout shown. RS-485 typically uses pins 1(-), 2(+), 5(GND) or varies by manufacturer.'
    },
    'DB25': {
        name: 'DB25 / DA-25',
        category: 'DB25',
        pinCount: 25,
        description: 'D-subminiature parallel/serial connector',
        ipRating: 'IP20 (unprotected)',
        maxVoltage: '±15V',
        maxCurrent: '500mA',
        dataRate: '115.2 kbps',
        maxLength: '15m',
        protocols: ['RS-232', 'Parallel', 'GPIB'],
        commonUses: ['Legacy serial', 'Printers (parallel)', 'Test equipment'],
        pinout: [
            { pin: 1, signal: 'Shield', description: 'Protective Ground' },
            { pin: 2, signal: 'TXD', description: 'Transmit Data' },
            { pin: 3, signal: 'RXD', description: 'Receive Data' },
            { pin: 4, signal: 'RTS', description: 'Request To Send' },
            { pin: 5, signal: 'CTS', description: 'Clear To Send' },
            { pin: 6, signal: 'DSR', description: 'Data Set Ready' },
            { pin: 7, signal: 'GND', description: 'Signal Ground' },
            { pin: 8, signal: 'DCD', description: 'Data Carrier Detect' },
            { pin: 20, signal: 'DTR', description: 'Data Terminal Ready' }
        ],
        notes: 'Original RS-232 connector. Mostly replaced by DB9 in industrial applications.'
    },
    'Terminal-2': {
        name: '2-Wire Terminal Block',
        category: 'Terminal',
        pinCount: 2,
        description: 'Basic screw or spring terminal',
        ipRating: 'IP20',
        maxVoltage: '300V',
        maxCurrent: '20A (varies)',
        protocols: ['Binary I/O', 'Analog 0-10V', 'Analog 4-20mA', 'RS-485', 'Modbus RTU'],
        commonUses: ['Power connections', 'Simple I/O', '2-wire serial'],
        pinout: [
            { pin: 1, signal: '+/A/TX', description: 'Positive / Data A / Transmit' },
            { pin: 2, signal: '-/B/RX', description: 'Negative / Data B / Receive' }
        ],
        notes: 'Most flexible connection type. Pinout depends entirely on application.'
    },
    'Terminal-3': {
        name: '3-Wire Terminal Block',
        category: 'Terminal',
        pinCount: 3,
        description: 'Terminal block with ground',
        ipRating: 'IP20',
        maxVoltage: '300V',
        maxCurrent: '20A (varies)',
        protocols: ['Binary I/O', 'Analog 4-20mA', 'RS-232', 'RS-485'],
        commonUses: ['Sensors', 'Powered devices', 'Serial with ground'],
        pinout: [
            { pin: 1, signal: '+V', description: 'Power positive or signal' },
            { pin: 2, signal: 'Signal', description: 'Data or output' },
            { pin: 3, signal: 'GND', description: 'Ground / Common' }
        ],
        notes: 'Common for 3-wire sensors (PNP/NPN) and basic serial connections.'
    },
    'Terminal-4': {
        name: '4-Wire Terminal Block',
        category: 'Terminal',
        pinCount: 4,
        description: 'Terminal block for RS-485 or powered serial',
        ipRating: 'IP20',
        maxVoltage: '300V',
        maxCurrent: '20A (varies)',
        dataRate: '10 Mbps (RS-485)',
        maxLength: '1200m (RS-485)',
        protocols: ['RS-485', 'RS-422', 'Modbus RTU', 'BACnet MS/TP'],
        commonUses: ['Building automation', 'Multi-drop serial networks', 'Long distance communication'],
        pinout: [
            { pin: 1, signal: 'A / D-', description: 'Data A (inverted)' },
            { pin: 2, signal: 'B / D+', description: 'Data B (non-inverted)' },
            { pin: 3, signal: 'GND', description: 'Signal Ground' },
            { pin: 4, signal: 'Shield', description: 'Cable Shield (optional)' }
        ],
        notes: 'A/B naming varies by manufacturer. Some use + for A, others for B. Always verify!'
    },
    'USB-A': {
        name: 'USB Type-A',
        category: 'USB',
        pinCount: 4,
        description: 'Standard USB host connector',
        ipRating: 'IP20',
        maxVoltage: '5V',
        maxCurrent: '500mA (USB 2.0), 900mA (USB 3.0)',
        dataRate: '480 Mbps (USB 2.0), 5 Gbps (USB 3.0)',
        maxLength: '5m (USB 2.0), 3m (USB 3.0)',
        protocols: ['USB 2.0', 'USB 3.0', 'USB HID', 'USB Serial'],
        commonUses: ['Programming ports', 'HMI connections', 'Data logging', 'Keyboards/mice'],
        pinout: [
            { pin: 1, signal: 'VBUS', description: 'Power +5V (Red)' },
            { pin: 2, signal: 'D-', description: 'Data - (White)' },
            { pin: 3, signal: 'D+', description: 'Data + (Green)' },
            { pin: 4, signal: 'GND', description: 'Ground (Black)' }
        ],
        notes: 'USB 3.0 adds 5 additional pins for SuperSpeed. Common on industrial PCs and HMIs.'
    },
    'USB-B': {
        name: 'USB Type-B',
        category: 'USB',
        pinCount: 4,
        description: 'Standard USB device connector',
        ipRating: 'IP20',
        maxVoltage: '5V',
        maxCurrent: '500mA',
        dataRate: '480 Mbps',
        maxLength: '5m',
        protocols: ['USB 2.0', 'USB Serial'],
        commonUses: ['PLC programming ports', 'Printers', 'Instruments'],
        pinout: [
            { pin: 1, signal: 'VBUS', description: 'Power +5V' },
            { pin: 2, signal: 'D-', description: 'Data -' },
            { pin: 3, signal: 'D+', description: 'Data +' },
            { pin: 4, signal: 'GND', description: 'Ground' }
        ],
        notes: 'Square connector found on devices. Being replaced by USB-C.'
    }
}

// Protocol definitions with connector compatibility
export const protocols: Record<string, any> = {
    'Ethernet/IP': {
        name: 'EtherNet/IP',
        category: 'Industrial Ethernet',
        description: 'Industrial protocol by ODVA, based on CIP over Ethernet',
        dataRate: '100 Mbps / 1 Gbps',
        maxNodes: '~200 per network',
        maxLength: '100m per segment',
        connectors: ['M12-4-D', 'M12-8-X', 'RJ45'],
        topology: 'Star, Linear, Ring (DLR)',
        deterministic: 'No (standard), Yes (with DLR)',
        commonBrands: ['Allen-Bradley/Rockwell', 'Omron', 'Keyence']
    },
    'PROFINET': {
        name: 'PROFINET',
        category: 'Industrial Ethernet',
        description: 'Industrial Ethernet standard by Siemens/PI',
        dataRate: '100 Mbps / 1 Gbps',
        maxNodes: '~100 per controller',
        maxLength: '100m per segment',
        connectors: ['M12-4-D', 'M12-8-X', 'RJ45'],
        topology: 'Star, Tree, Ring (MRP)',
        deterministic: 'Yes (IRT mode)',
        commonBrands: ['Siemens', 'Phoenix Contact', 'Beckhoff']
    },
    'EtherCAT': {
        name: 'EtherCAT',
        category: 'Industrial Ethernet',
        description: 'High-speed fieldbus by Beckhoff',
        dataRate: '100 Mbps',
        maxNodes: '65535',
        maxLength: '100m between nodes',
        connectors: ['M12-4-D', 'RJ45'],
        topology: 'Line, Tree, Star',
        deterministic: 'Yes (hardware based)',
        commonBrands: ['Beckhoff', 'Omron', 'Yaskawa']
    },
    'Modbus TCP': {
        name: 'Modbus TCP',
        category: 'Industrial Ethernet',
        description: 'Modbus protocol over TCP/IP',
        dataRate: '10/100 Mbps',
        maxNodes: '247 (Unit ID limited)',
        maxLength: '100m per segment',
        connectors: ['M12-4-D', 'RJ45'],
        topology: 'Any Ethernet topology',
        deterministic: 'No',
        commonBrands: ['Schneider Electric', 'Wago', 'Many generic devices']
    },
    'Modbus RTU': {
        name: 'Modbus RTU',
        category: 'Serial',
        description: 'Binary Modbus over RS-485/RS-232',
        dataRate: '9600-115200 bps typical',
        maxNodes: '247 (32 physical on RS-485)',
        maxLength: '1200m (RS-485)',
        connectors: ['DB9', 'Terminal-2', 'Terminal-3', 'Terminal-4'],
        topology: 'Multi-drop (RS-485), Point-to-point (RS-232)',
        deterministic: 'No',
        commonBrands: ['Universal - most PLCs and devices']
    },
    'RS-232': {
        name: 'RS-232',
        category: 'Serial',
        description: 'Point-to-point serial communication standard',
        dataRate: 'Up to 115.2 kbps',
        maxNodes: '2 (point-to-point only)',
        maxLength: '15m typical',
        connectors: ['DB9', 'DB25', 'Terminal-3'],
        topology: 'Point-to-point',
        deterministic: 'N/A',
        commonBrands: ['Universal']
    },
    'RS-485': {
        name: 'RS-485 / EIA-485',
        category: 'Serial',
        description: 'Multi-drop differential serial standard',
        dataRate: 'Up to 10 Mbps',
        maxNodes: '32 standard, 256 with high-impedance',
        maxLength: '1200m',
        connectors: ['DB9', 'Terminal-2', 'Terminal-4', 'M12-8-A'],
        topology: 'Multi-drop bus',
        deterministic: 'N/A (depends on protocol)',
        commonBrands: ['Universal']
    },
    'IO-Link': {
        name: 'IO-Link',
        category: 'Sensor/Actuator',
        description: 'Point-to-point sensor communication standard',
        dataRate: '4.8 / 38.4 / 230.4 kbps',
        maxNodes: '1 per port (use IO-Link master)',
        maxLength: '20m',
        connectors: ['M8-4', 'M12-4-A', 'M12-5-A'],
        topology: 'Point-to-point to IO-Link master',
        deterministic: 'Yes (cyclic data)',
        commonBrands: ['Balluff', 'ifm', 'Sick', 'Turck']
    },
    'AS-Interface': {
        name: 'AS-Interface (AS-i)',
        category: 'Sensor/Actuator',
        description: 'Simple sensor/actuator network',
        dataRate: '167 kbps',
        maxNodes: '62 standard, 124 extended',
        maxLength: '100m (200m with repeater)',
        connectors: ['M12-4-A', 'AS-i flat cable'],
        topology: 'Any (tree, star, line)',
        deterministic: 'Yes (cyclic)',
        commonBrands: ['Siemens', 'ifm', 'Pepperl+Fuchs']
    },
    'DeviceNet': {
        name: 'DeviceNet',
        category: 'Fieldbus',
        description: 'CAN-based industrial network by ODVA',
        dataRate: '125/250/500 kbps',
        maxNodes: '64',
        maxLength: '500m at 125kbps',
        connectors: ['M12-5-A', 'DeviceNet mini/micro'],
        topology: 'Trunk-line/drop-line',
        deterministic: 'No (CSMA/NBA)',
        commonBrands: ['Allen-Bradley/Rockwell', 'Omron']
    },
    'CANopen': {
        name: 'CANopen',
        category: 'Fieldbus',
        description: 'CAN-based higher layer protocol',
        dataRate: '10 kbps - 1 Mbps',
        maxNodes: '127',
        maxLength: '1000m at 10kbps, 25m at 1Mbps',
        connectors: ['DB9', 'M12-5-A', 'Terminal-4'],
        topology: 'Linear bus',
        deterministic: 'Configurable (SYNC objects)',
        commonBrands: ['Festo', 'Maxon', 'Many motion controllers']
    },
    'PROFIBUS': {
        name: 'PROFIBUS DP',
        category: 'Fieldbus',
        description: 'Classic Siemens fieldbus (RS-485 based)',
        dataRate: '9.6 kbps - 12 Mbps',
        maxNodes: '126',
        maxLength: '1200m at 93.75kbps',
        connectors: ['DB9', 'M12-5-A'],
        topology: 'Linear bus',
        deterministic: 'Yes',
        commonBrands: ['Siemens', 'Phoenix Contact']
    },
    'BACnet MS/TP': {
        name: 'BACnet MS/TP',
        category: 'Building Automation',
        description: 'Building automation protocol over RS-485',
        dataRate: '9.6-115.2 kbps',
        maxNodes: '127',
        maxLength: '1200m',
        connectors: ['Terminal-2', 'Terminal-4'],
        topology: 'Daisy-chain bus',
        deterministic: 'Yes (token passing)',
        commonBrands: ['Johnson Controls', 'Honeywell', 'Tridium']
    },
    'BACnet/IP': {
        name: 'BACnet/IP',
        category: 'Building Automation',
        description: 'Building automation over Ethernet/IP',
        dataRate: '10/100 Mbps',
        maxNodes: 'Unlimited (IP based)',
        maxLength: '100m per segment',
        connectors: ['RJ45'],
        topology: 'Any Ethernet topology',
        deterministic: 'No',
        commonBrands: ['Johnson Controls', 'Honeywell', 'Tridium']
    },
    'Binary I/O': {
        name: 'Binary I/O (Digital)',
        category: 'Discrete',
        description: 'Simple on/off digital signals',
        dataRate: 'N/A',
        maxNodes: 'N/A',
        maxLength: '30m typical (varies)',
        connectors: ['M8-3', 'M8-4', 'M12-4-A', 'M12-5-A', 'Terminal-2', 'Terminal-3'],
        topology: 'Point-to-point',
        deterministic: 'Yes',
        commonBrands: ['Universal - all sensors/PLCs']
    },
    'Analog 4-20mA': {
        name: 'Analog 4-20mA',
        category: 'Analog',
        description: 'Current loop analog signal (industry standard)',
        dataRate: 'N/A',
        maxNodes: 'N/A',
        maxLength: '300m+ (current loop)',
        connectors: ['M8-3', 'M8-4', 'M12-4-A', 'M12-5-A', 'Terminal-2', 'Terminal-3'],
        topology: 'Point-to-point',
        deterministic: 'Yes',
        commonBrands: ['Universal']
    },
    'Analog 0-10V': {
        name: 'Analog 0-10V',
        category: 'Analog',
        description: 'Voltage-based analog signal',
        dataRate: 'N/A',
        maxNodes: 'N/A',
        maxLength: '15m typical',
        connectors: ['M8-3', 'M8-4', 'M12-4-A', 'M12-5-A', 'Terminal-2', 'Terminal-3'],
        topology: 'Point-to-point',
        deterministic: 'Yes',
        commonBrands: ['Universal']
    },
    'PoE': {
        name: 'Power over Ethernet (PoE)',
        category: 'Power',
        description: 'DC power delivery over Ethernet cabling',
        dataRate: 'N/A (power only)',
        maxNodes: 'N/A',
        maxLength: '100m',
        connectors: ['RJ45'],
        topology: 'Point-to-point from PoE switch/injector',
        deterministic: 'N/A',
        commonBrands: ['Cisco', 'Moxa', 'TP-Link']
    }
}

// Helper functions

/**
 * Get all connector IDs
 */
export function getConnectorIds() {
    return Object.keys(connectors)
}

/**
 * Get connectors grouped by category
 */
export function getConnectorsByCategory() {
    const categories: Record<string, any[]> = {}
    Object.entries(connectors).forEach(([id, conn]) => {
        if (!categories[conn.category]) {
            categories[conn.category] = []
        }
        categories[conn.category].push({ id, ...conn })
    })
    return categories
}

/**
 * Get all protocol IDs
 */
export function getProtocolIds() {
    return Object.keys(protocols)
}

/**
 * Get protocols grouped by category
 */
export function getProtocolsByCategory() {
    const categories: Record<string, any[]> = {}
    Object.entries(protocols).forEach(([id, proto]) => {
        if (!categories[proto.category]) {
            categories[proto.category] = []
        }
        categories[proto.category].push({ id, ...proto })
    })
    return categories
}

/**
 * Get connector by ID
 */
export function getConnector(id: any) {
    return connectors[id] || null
}

/**
 * Get protocol by ID
 */
export function getProtocol(id: any) {
    return protocols[id] || null
}

/**
 * Find connectors that support a given protocol
 */
export function getConnectorsForProtocol(protocolId: any) {
    const proto = protocols[protocolId]
    if (!proto) return []

    return proto.connectors.map((connId: any) => {
        const conn = connectors[connId]
        return conn ? { id: connId, ...conn } : null
    }).filter(Boolean)
}

/**
 * Find protocols supported by a given connector
 */
export function getProtocolsForConnector(connectorId: any) {
    const conn = connectors[connectorId]
    if (!conn) return []

    return conn.protocols.map((protoId: any) => {
        // Find protocol by checking if any protocol ID or name matches
        const proto = protocols[protoId]
        if (proto) return { id: protoId, ...proto }

        // Check if it's a protocol name match
        const entry = Object.entries(protocols).find(([, p]) => p.name === protoId)
        if (entry) return { id: entry[0], ...entry[1] }

        // Return basic info for protocols not in our detailed list
        return { id: protoId, name: protoId, category: 'Other' }
    })
}

/**
 * Search connectors and protocols by text
 */
export function searchAll(searchTerm: any) {
    const term = searchTerm.toLowerCase()
    const results: { connectors: any[], protocols: any[] } = {
        connectors: [],
        protocols: []
    }

    // Search connectors
    Object.entries(connectors).forEach(([id, conn]) => {
        if (
            conn.name.toLowerCase().includes(term) ||
            conn.description.toLowerCase().includes(term) ||
            conn.protocols.some((p: any) => p.toLowerCase().includes(term)) ||
            conn.commonUses.some((u: any) => u.toLowerCase().includes(term))
        ) {
            results.connectors.push({ id, ...conn })
        }
    })

    // Search protocols
    Object.entries(protocols).forEach(([id, proto]) => {
        if (
            proto.name.toLowerCase().includes(term) ||
            proto.description.toLowerCase().includes(term) ||
            proto.category.toLowerCase().includes(term) ||
            (proto.commonBrands && proto.commonBrands.some((b: any) => b.toLowerCase().includes(term)))
        ) {
            results.protocols.push({ id, ...proto })
        }
    })

    return results
}
