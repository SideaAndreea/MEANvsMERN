import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutAppComponent } from './components/layout/layout-app.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
