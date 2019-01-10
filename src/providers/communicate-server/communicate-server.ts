import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CommunicateServerProvider {

    constructor(public http: HttpClient) { }

    store(url, data){
        return this.http.post(url, data);
    }

    fetch(url){
        return this.http.get(url);
    }

    update(url, data){
        return this.http.patch(url, data);
    }

}
