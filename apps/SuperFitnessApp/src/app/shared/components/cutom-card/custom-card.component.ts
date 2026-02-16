import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-card',
  imports: [CommonModule],
  templateUrl: './custom-card.component.html',
  styleUrl: './custom-card.component.scss',
})
export class CustomCardComponent {
  itemId = input<string>();
  cardImg = input.required<string>();
  cardTitle = input.required<string>();
  onReadMore = output<string | undefined>();

  readMore() {
    if (this.itemId()) {
      this.onReadMore.emit(this.itemId()!);
    } else {
      this.onReadMore.emit(undefined);
    }
  }
}
