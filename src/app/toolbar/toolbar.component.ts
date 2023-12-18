import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  constructor(private router: Router) {}

  isLoggedIn = true;

  logout() {
    // Lógica para cerrar sesión
  }

  irARuta(n: number): void {
    // Aquí especificas la ruta a la que quieres ir
    if (n === 2) {
      this.router.navigate(['/booking']);
    }
    if (n === 3) {
      this.router.navigate(['/barbers']);
    }
    if (n === 1) {
      this.router.navigate(['/agendar']);
    }
  }
}
