import { Observable } from "rxjs";
import { muscles } from "../models/allMuscles";

export abstract class MusclesResApi {
abstract getAllMuscles(): Observable<muscles>;
}