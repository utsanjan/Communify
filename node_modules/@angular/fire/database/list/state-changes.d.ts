import { DatabaseQuery, ChildEvent, AngularFireAction } from '../interfaces';
import { SchedulerLike, Observable } from 'rxjs';
import { DatabaseSnapshot } from '../interfaces';
export declare function stateChanges<T>(query: DatabaseQuery, events?: ChildEvent[], scheduler?: SchedulerLike): Observable<AngularFireAction<DatabaseSnapshot<T>>>;
