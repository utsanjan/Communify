import { Observable, SchedulerLike } from 'rxjs';
import { DatabaseQuery, ChildEvent, SnapshotAction } from '../interfaces';
export declare function listChanges<T = any>(ref: DatabaseQuery, events: ChildEvent[], scheduler?: SchedulerLike): Observable<SnapshotAction<T>[]>;
