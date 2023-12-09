import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  constructor(private router: Router) {}

  irARuta(n: number): void {
    // Aquí especificas la ruta a la que quieres ir
    if (n === 1) {
      console.log('ir a booking');
      this.router.navigate(['/booking']);
    }
    if (n === 2) {
      console.log('ir a barberos');
      this.router.navigate(['/barbers']);
    }
  }
}
