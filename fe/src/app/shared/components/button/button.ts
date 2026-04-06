import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  text = input<string | null>(null);
  icon = input<string | null>(null);
  function = input<(() => any) | null>(null);
}
