import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mini-project-ui';

  subscribers: Subscription[] = [];

  _snackBar = inject(MatSnackBar);

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.subscribers.push(
      this.appService.snackbar.subscribe(message => {
        if (message) {
          this._snackBar.open(message, "Close", {
            duration: 10000
          })
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => subscriber.unsubscribe())
  }
}
