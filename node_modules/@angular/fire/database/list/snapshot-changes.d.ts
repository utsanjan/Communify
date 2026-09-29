import { Observable, SchedulerLike } from 'rxjs';
import { DatabaseQuery, ChildEvent, SnapshotAction } from '../interfaces';
export declare function snapshotChanges<T>(query: DatabaseQuery, events?: ChildEvent[], scheduler?: SchedulerLike): Observable<SnapshotAction<T>[]>;
