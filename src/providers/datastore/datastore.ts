/* Author: Rajkaran
 * Date: 13 November
 * Utilize cordova data store to cache data on client side. On mobile devices
 * it uses sqllite where as in browser it uses IndexedDB, WebSQL, and
 * localstorage, in that order
 *
 * Generate setter and getter for Participant. Storage library returns Promise
 * and angular deals in Observables so, here we have to convert Promise to
 * Observable with from operator. If Participant Key-value pair found then
 * parse it to an object otherwise throw an error.
 *
 */

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { _throw } from 'rxjs/observable/throw';
import { flatMap } from 'rxjs/operators';

@Injectable()
export class DatastoreProvider {

    constructor(private storage: Storage) { }

    setKeyValuePair(key: string, value: Object): void{
        if(value){
            this.storage.set(key, JSON.stringify(value));
        }
    }

    getKeyValuePair(key: string): Observable<Object> {
        return from(this.storage.get(key))
        .pipe(
            flatMap( (value: string) => {
                if(value !== null){
                    return of(JSON.parse(value)) ;
                }
                else{
                    return _throw('Unexpected error! '+key+' not found.');
                }
            })
        );
    }


}
