import { IDBPDatabase } from "idb";
import { ScramjetDB } from "../types";
export declare function openScramjetDB(): Promise<IDBPDatabase<ScramjetDB>>;
