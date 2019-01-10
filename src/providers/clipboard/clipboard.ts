import { Injectable } from '@angular/core';

import { CommunicateServerProvider } from '../communicate-server/communicate-server';
import { environment } from '../../environments/environment';
import { AccessToken } from '../../models/access-token';
import { Clipboard } from '../../models/clipboard';

@Injectable()
export class ClipboardProvider {

    constructor(public communicateServerProvider: CommunicateServerProvider) {}

    /* save clipboard responses to server. */
    saveClipboard(clipboard: Clipboard, token: AccessToken){
        let url = environment.api_url+'/Clipboards?access_token='+token.id

        return this.communicateServerProvider.store(url, clipboard);
    }

}
