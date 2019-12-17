import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { of } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
  apiResponse: any;
  isSearching: boolean;

  constructor(
    private httpClient: HttpClient
  ) {
    this.isSearching = false;
    this.apiResponse = [];
  }

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe((text: string) => {
      this.isSearching = true;
      this.searchGetCall(text).subscribe((res: [any]) => {
        console.log('res', res);
        this.isSearching = false;
        this.apiResponse = res;
      }, (err) => {
        this.isSearching = false;
        console.log('error', err);
      });
    });
  }

  searchGetCall(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.httpClient.get(`https://api.github.com/search/users?q=${term}`);
  }

}
