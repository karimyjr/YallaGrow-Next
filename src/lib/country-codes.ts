// Country list for WhatsApp pickers. Ordered by relevance to a Lebanese
// agency audience (LB first, then Gulf + Levant + MENA, then common
// Lebanese diaspora destinations, then everywhere else alphabetical).

export interface Country {
  code: string       // ISO-2
  name: string
  dial: string       // e.g. "+961"
  flag: string       // emoji
}

export const COUNTRIES: Country[] = [
  // Lebanon first — default
  { code: 'LB', name: 'Lebanon',           dial: '+961', flag: '🇱🇧' },

  // Gulf + Levant + MENA
  { code: 'SA', name: 'Saudi Arabia',      dial: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE',               dial: '+971', flag: '🇦🇪' },
  { code: 'KW', name: 'Kuwait',            dial: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar',             dial: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain',           dial: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman',              dial: '+968', flag: '🇴🇲' },
  { code: 'JO', name: 'Jordan',            dial: '+962', flag: '🇯🇴' },
  { code: 'SY', name: 'Syria',             dial: '+963', flag: '🇸🇾' },
  { code: 'PS', name: 'Palestine',         dial: '+970', flag: '🇵🇸' },
  { code: 'IQ', name: 'Iraq',              dial: '+964', flag: '🇮🇶' },
  { code: 'EG', name: 'Egypt',             dial: '+20',  flag: '🇪🇬' },
  { code: 'TR', name: 'Turkey',            dial: '+90',  flag: '🇹🇷' },
  { code: 'MA', name: 'Morocco',           dial: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia',           dial: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algeria',           dial: '+213', flag: '🇩🇿' },

  // Common Lebanese diaspora
  { code: 'FR', name: 'France',            dial: '+33',  flag: '🇫🇷' },
  { code: 'US', name: 'United States',     dial: '+1',   flag: '🇺🇸' },
  { code: 'CA', name: 'Canada',            dial: '+1',   flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom',    dial: '+44',  flag: '🇬🇧' },
  { code: 'DE', name: 'Germany',           dial: '+49',  flag: '🇩🇪' },
  { code: 'AU', name: 'Australia',         dial: '+61',  flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil',            dial: '+55',  flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina',         dial: '+54',  flag: '🇦🇷' },
  { code: 'MX', name: 'Mexico',            dial: '+52',  flag: '🇲🇽' },
  { code: 'IT', name: 'Italy',             dial: '+39',  flag: '🇮🇹' },
  { code: 'ES', name: 'Spain',             dial: '+34',  flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands',       dial: '+31',  flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium',           dial: '+32',  flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland',       dial: '+41',  flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden',            dial: '+46',  flag: '🇸🇪' },

  // West Africa (major Lebanese presence)
  { code: 'CI', name: "Côte d'Ivoire",     dial: '+225', flag: '🇨🇮' },
  { code: 'SN', name: 'Senegal',           dial: '+221', flag: '🇸🇳' },
  { code: 'NG', name: 'Nigeria',           dial: '+234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana',             dial: '+233', flag: '🇬🇭' },

  // Rest (alphabetical, light coverage for anyone else)
  { code: 'IN', name: 'India',             dial: '+91',  flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan',          dial: '+92',  flag: '🇵🇰' },
  { code: 'ZA', name: 'South Africa',      dial: '+27',  flag: '🇿🇦' },
  { code: 'CY', name: 'Cyprus',            dial: '+357', flag: '🇨🇾' },
  { code: 'GR', name: 'Greece',            dial: '+30',  flag: '🇬🇷' },
]

export const DEFAULT_COUNTRY = COUNTRIES[0] // Lebanon
