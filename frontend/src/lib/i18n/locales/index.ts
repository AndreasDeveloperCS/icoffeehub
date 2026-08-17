import en from './en.json';
import es from './es.json';
import pt from './pt.json';
import fr from './fr.json';
import el from './el.json';
import bg from './bg.json';
import ar from './ar.json';
import { Locale } from '../config';

export type Messages = typeof en;

export const MESSAGES: Record<Locale, Messages> = { en, es, pt, fr, el, bg, ar };
