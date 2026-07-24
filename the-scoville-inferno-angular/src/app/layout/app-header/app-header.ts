import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader { }