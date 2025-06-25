import { Game } from "./game";

export interface Dashboard {
    nextGame?: Game;
    previousGame?: Game;
}