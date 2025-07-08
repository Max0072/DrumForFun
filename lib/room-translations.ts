// lib/room-translations.ts
import { Language, Translations } from './i18n'

export function translateRoomName(roomName: string, language: Language): string {
  const roomTranslations: { [key: string]: { en: string; ru: string } } = {
    'Большая #1': { en: 'Big studio #1', ru: 'Большая #1' },
    'Верхняя средняя #2': { en: 'Upper-medium #2', ru: 'Верхняя средняя #2' },
    'Верхняя малая #3': { en: 'Upper-small #3', ru: 'Верхняя малая #3' },
    'Drum Room #1': { en: 'Big studio #1', ru: 'Большая #1' },
    'Drum Room #2': { en: 'Upper-medium #2', ru: 'Верхняя средняя #2' },
    'Guitar Room #1': { en: 'Upper-small #3', ru: 'Верхняя малая #3' },
    'Big studio #1': { en: 'Big studio #1', ru: 'Большая #1' },
    'Upper-medium #2': { en: 'Upper-medium #2', ru: 'Верхняя средняя #2' },
    'Upper-small #3': { en: 'Upper-small #3', ru: 'Верхняя малая #3' }
  }
  
  const translation = roomTranslations[roomName]
  if (translation) {
    return translation[language === 'en' ? 'en' : 'ru']
  }
  return roomName
}

export function translateRoomDescription(roomName: string, t: Translations, description?: string): string {
  // Use predefined translations based on room name - these will be translated by i18n
  const roomDescriptions: { [key: string]: string } = {
    'Большая #1': t.rooms.bigDrumRoom,
    'Верхняя средняя #2': t.rooms.upperMediumRoom,
    'Верхняя малая #3': t.rooms.upperSmallDrumGuitarRoom,
    'Drum Room #1': t.rooms.bigDrumRoom,
    'Drum Room #2': t.rooms.upperMediumRoom,
    'Guitar Room #1': t.rooms.upperSmallDrumGuitarRoom,
    'Big studio #1': t.rooms.bigDrumRoom,
    'Upper-medium #2': t.rooms.upperMediumRoom,
    'Upper-small #3': t.rooms.upperSmallDrumGuitarRoom
  }
  
  return roomDescriptions[roomName] || description || ''
}