import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'StackedDeck';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.bootstrapFromStorage().subscribe({
      next: (user: User | null) => {
        if (user) console.log('✅ Session restored :', user.username);
      },
      error: () => console.log('Not active session')
    });
  }
}
