import { Observable, SchedulerLike } from 'rxjs';
import { DocumentReference, Query, Action, DocumentSnapshot, QuerySnapshot } from '../interfaces';
export declare function fromRef<R>(ref: DocumentReference | Query, scheduler?: SchedulerLike): Observable<R>;
export declare function fromDocRef<T>(ref: DocumentReference, scheduler?: SchedulerLike): Observable<Action<DocumentSnapshot<T>>>;
export declare function fromCollectionRef<T>(ref: Query, scheduler?: SchedulerLike): Observable<Action<QuerySnapshot<T>>>;
