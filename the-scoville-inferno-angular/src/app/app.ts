import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { APP_TOAST_KEY } from './core/constants/toats.constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('the-scoville-inferno-angular');
  protected readonly toastKey = APP_TOAST_KEY;
}