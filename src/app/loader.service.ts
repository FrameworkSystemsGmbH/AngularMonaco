/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {

  private _load$: Promise<void> | null = null;

  public async loadMonaco(): Promise<void> {
    if (this._load$ != null) {
      return this._load$;
    } else {
      this._load$ = new Promise<void>((resolve: (() => void)) => {
        const win: any = window as any;

        if (win.monaco != null) {
          resolve();
          return;
        }

        const onAmdLoader = (): any => {
          win.require.config({ paths: { 'vs': 'assets/monaco/min/vs' } });
          win.require(['vs/editor/editor.main'], () => {
            resolve();
          });
        };

        if (!win.require) {
          const loaderScript: HTMLScriptElement = document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = 'assets/monaco/min/vs/loader.js';
          loaderScript.addEventListener('load', onAmdLoader);
          document.body.appendChild(loaderScript);
        }
      });

      return this._load$;
    }
  }
}
