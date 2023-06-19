import { BehaviorSubject } from 'rxjs';

export const newGameMove: BehaviorSubject<any> = new BehaviorSubject<any>(null);
export const userSide: BehaviorSubject<any> = new BehaviorSubject<any>(null);
export const whiteTime: BehaviorSubject<any> = new BehaviorSubject<any>(null);
export const blackTime: BehaviorSubject<any> = new BehaviorSubject<any>(null);
export const gameHistory: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
export const whitePiecesTaken: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
export const blackPiecesTaken: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
