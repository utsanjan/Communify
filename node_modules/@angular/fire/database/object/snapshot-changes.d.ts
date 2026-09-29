import { Observable, SchedulerLike } from 'rxjs';
import { DatabaseQuery } from '../interfaces';
export declare function createObjectSnapshotChanges<T>(query: DatabaseQuery, scheduler?: SchedulerLike): () => Observable<import("../interfaces").AngularFireAction<import("../interfaces").DatabaseSnapshot<T>>>;
