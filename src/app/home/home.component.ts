import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ImportModule } from '../import/import.module';
import { MatIconRegistry } from '@angular/material/icon';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [ImportModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {
  private destroyed = new Subject<void>();
  cols = 2;

  constructor(private router: Router) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIcon(
      'fiction',
      sanitizer.bypassSecurityTrustResourceUrl('/Fiction.svg')
    );

    // Setup BreakpointObserver
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.cols = (query === Breakpoints.XSmall || query === Breakpoints.Small) ? 1 : 2;
          }
        }
      });
  }

  title = 'gutendexProject';

  categories = [
    { name: 'Fiction' },
    { name: 'Drama' },
    { name: 'Humour'},
    { name: 'Politics' },
    { name: 'Philosophy' },
    { name: 'History' },
    { name: 'Adventure' }
  ];

  navigate(category: any) {
    const topic = category.name.toLowerCase();
    this.router.navigate(['/books', topic]);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
