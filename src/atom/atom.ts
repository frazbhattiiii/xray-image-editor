import { atom } from 'jotai';

interface Point {
  x: number;
  y: number;
  name?: string;
}

interface PointNames {
  [key: string]: string;
}

export const imagePathAtom = atom<string>('');

export const AIPoints = atom<Point[]>([]);

export const AIPointNames = atom<PointNames>({});
