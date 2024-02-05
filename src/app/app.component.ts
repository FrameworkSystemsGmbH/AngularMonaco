/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mon-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('anchor')
  public anchor: ElementRef | null = null;

  private _editor: monaco.editor.IStandaloneCodeEditor | null = null;

  public ngOnInit(): void {
    this.loadMonaco()
      .then(() => this.initMonaco())
      .catch(err => console.error(err));
  }

  public ngOnDestroy(): void {
    this._editor?.dispose();
    this._editor = null;
  }

  private initMonaco(): void {
    if (this.anchor == null) {
      return;
    }

    this._editor = monaco.editor.create(this.anchor.nativeElement as HTMLElement, {
      language: 'javascript',
      automaticLayout: true
    });
  }

  private async loadMonaco(): Promise<void> {
    return new Promise<void>((resolve: (() => void)) => {
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
  }
}
