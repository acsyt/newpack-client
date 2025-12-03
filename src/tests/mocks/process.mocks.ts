import { Process } from '@/features/processes';

export const processMocks: Process[] = [
  {
    id: 1,
    code: 'COEX',
    name: 'Extrusion',
    appliesToPt: true,
    appliesToMp: false,
    appliesToCompounds: true,
    createdAt: '2025-11-28T18:30:31.000000Z',
    updatedAt: '2025-11-28T18:30:31.000000Z'
  },
  {
    id: 2,
    code: 'IMP',
    name: 'Impresión',
    appliesToPt: true,
    appliesToMp: false,
    appliesToCompounds: true,
    createdAt: '2025-11-28T18:30:31.000000Z',
    updatedAt: '2025-11-28T18:30:31.000000Z'
  },
  {
    id: 3,
    code: 'BS',
    name: 'BOLSA SUELTA',
    appliesToPt: true,
    appliesToMp: false,
    appliesToCompounds: false,
    createdAt: '2025-11-28T18:30:31.000000Z',
    updatedAt: '2025-11-28T18:30:31.000000Z'
  },
  {
    id: 4,
    code: 'BR',
    name: 'BOLSA EN ROLLO',
    appliesToPt: true,
    appliesToMp: false,
    appliesToCompounds: false,
    createdAt: '2025-11-28T18:30:31.000000Z',
    updatedAt: '2025-11-28T18:30:31.000000Z'
  },
  {
    id: 5,
    code: 'PELET',
    name: 'PELETIZADO',
    appliesToPt: true,
    appliesToMp: true,
    appliesToCompounds: false,
    createdAt: '2025-11-28T18:30:31.000000Z',
    updatedAt: '2025-11-28T18:30:31.000000Z'
  }
];
