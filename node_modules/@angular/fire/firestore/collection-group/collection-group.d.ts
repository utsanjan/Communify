import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { DocumentChangeType, Query, DocumentData, DocumentChangeAction } from '../interfaces';
import { AngularFirestore } from '../firestore';
export declare class AngularFirestoreCollectionGroup<T = DocumentData> {
    private readonly query;
    private readonly afs;
    constructor(query: Query, afs: AngularFirestore);
    stateChanges(events?: DocumentChangeType[]): Observable<DocumentChangeAction<T>[]>;
    auditTrail(events?: DocumentChangeType[]): Observable<DocumentChangeAction<T>[]>;
    snapshotChanges(events?: DocumentChangeType[]): Observable<DocumentChangeAction<T>[]>;
    valueChanges(): Observable<T[]>;
    get(options?: firestore.GetOptions): Observable<firestore.QuerySnapshot>;
}
