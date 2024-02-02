/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '@app/loader.service';
import { Observable, Subscription, mergeMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'mon-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('anchor')
  public anchor: ElementRef | null = null;

  private readonly _loaderService: LoaderService;

  private _editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private _initSub: Subscription | null = null;

  public constructor(loaderService: LoaderService) {
    this._loaderService = loaderService;
  }

  public ngOnInit(): void {
    this._initSub = this.voidObs().pipe(
      mergeMap(async () => {
        await this._loaderService.loadMonaco();
        this.initMonaco();
      })
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this._initSub?.unsubscribe();

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

  private voidObs(): Observable<void> {
    return new Observable<void>(sub => {
      sub.next();
      sub.complete();
    });
  }
}
