import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImportModule } from '../import/import.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-books',
  standalone: true,
  imports: [ImportModule, InfiniteScrollModule,FormsModule ],
  templateUrl: './category-books.component.html',
  styleUrl: './category-books.component.css'
})
export class CategoryBooksComponent {
  topic: string = '';
  books: any[] = [];
  nextPageUrl: string | null = '';
  loading = false;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  searchQuery: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.topic = params.get('topic') || '';
      this.resetAndFetch();
    });
  }

  fetchBooks(): void {
    if (!this.nextPageUrl || this.loading) return;

    this.loading = true;

    this.http.get<any>(this.nextPageUrl).subscribe(res => {
      const newBooks = res.results.filter((book: any) => book.formats['image/jpeg']);
      this.books.push(...newBooks);
      this.nextPageUrl = res.next;
      this.loading = false;
    });
  }

  onScrollDown(): void {
    this.fetchBooks();
  }

  onSearch(): void {
    this.resetAndFetch();
  }
  goBack() {
    this.router.navigate(['/']); // or navigate to any route you want
  }
  resetAndFetch(): void {
    this.books = [];
    this.nextPageUrl = `https://gutendex.com/books?topic=${this.topic}`;
    if (this.searchQuery.trim()) {
      const searchEncoded = encodeURIComponent(this.searchQuery.trim());
      this.nextPageUrl += `&search=${searchEncoded}`;
    }
    this.fetchBooks();
  }
  openBook(book: any): void {
    const formats = book.formats;
  
    const formatPriority = [
      'text/html',
      'application/pdf',
      'text/plain'
    ];
  
    for (const type of formatPriority) {
      const match = Object.entries(formats).find(
        ([key, url]) => key.startsWith(type) && typeof url === 'string' && !url.endsWith('.zip')
      );
      if (match) {
        const url = match[1] as string;
        window.open(url, '_blank');
        return;
      }
    }
  
    alert('No viewable version available');
  }
  
  
}
