import { Injectable } from "@angular/core";
import { IUser } from "../../shared/interfaces/user";
import { AngularFirestore } from "@angular/fire/firestore";
import { mergeMap, map, switchMap } from "rxjs/operators";
import { IPost } from "src/app/shared/interfaces/post";
import { of as ObservableOf, Observable } from "rxjs";
import { AuthService } from "src/app/auth/services/auth.service";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(
    private afDb: AngularFirestore,
    private authService: AuthService
  ) {}

  // Get single user by id
  getUser(id) {
    return this.afDb
      .collection<IUser>("users", ref => ref.where("id", "==", id))
      .valueChanges()
      .pipe(
        switchMap((userList: IUser[]) => userList),
        switchMap((user: IUser) => {
          return this.afDb
            .collection<IPost>("posts", ref =>
              ref.where("createdById", "==", user.id)
            )
            .valueChanges()
            .pipe(
              map((posts: IPost[]) => {
                return {
                  ...user,
                  posts
                };
              })
            );
        })
      );
  }

  // Get all users
  get getAllUsers() {
    return this.afDb
      .collection<IUser>("users")
      .valueChanges()
      .pipe(
        mergeMap((userList: IUser[]) => userList),
        mergeMap(user => {
          return this.afDb
            .collection<IPost>("posts", ref =>
              ref.where("createdById", "==", user.id)
            )
            .valueChanges()
            .pipe(
              map((posts: IPost[]) => {
                return {
                  ...user,
                  posts
                };
              })
            );
        })
      );
  }

  // In params pass collection and criteria for search. Search for user in passed collection by criteria and return stream with found users
  searchUser(collection: any[], params) {
    const { searchBy, searchFor } = params;
    let stream$: Observable<any>;
    if (searchBy === "title") {
      stream$ = ObservableOf(
        [...collection].filter(user => {
          const isFound = user.posts.filter(post => {
            return post.title
              .toLocaleLowerCase()
              .includes(searchFor.toLocaleLowerCase());
          });
          if (!!isFound.length) {
            return user;
          }
        })
      );
    } else {
      stream$ = ObservableOf(
        [...collection].filter(user => {
          return user[searchBy]
            .toLocaleLowerCase()
            .includes(searchFor.toLocaleLowerCase());
        })
      );
    }
    return stream$;
  }

  // Delete user by id
  deleteUser(userId) {
    return this.authService.deleteUser(userId);
  }
}
