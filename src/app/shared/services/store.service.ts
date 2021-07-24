import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IState } from 'src/app/shared/interfaces/state';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  state: IState = {
    userList: []
  };

  private _store = new BehaviorSubject<IState>(this.state);
  constructor() { }

  select<T>(selector: (state: IState) => T) {
    return this._store.pipe(map(selector));
  }

  update(actionReducer: (state: IState) => Partial<IState>) {
    this.state = Object.assign({}, this.state, actionReducer(this.state));
    this._store.next(this.state);
  }
}
