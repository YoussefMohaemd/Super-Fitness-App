import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CustomCardComponent } from '../cutom-card/custom-card.component';
import { Meals } from '../../../core/models/healthy-Interfaces';

@Component({
  selector: 'app-custom-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule, CustomCardComponent],
  templateUrl: './custom-slider.component.html',
  styleUrls: ['./custom-slider.component.scss'],
})
export class CustomSliderComponent implements OnInit, OnDestroy, OnChanges {
  /** Inputs to control layout dynamically */
  @Input() numOfRows = 1; // requested rows per page
  @Input() numOfColumns = 3; // requested columns per row
  @Input() autoplayInterval = 0;
  @Input() itemsList: Meals[] = [];

  /** Emit selected item id */
  @Output() mealSelected = new EventEmitter<string>();

  /** Effective (responsive) columns & rows used internally */
  closNum = 3;
  rowsNum = 1;

  /** Pages (each page is an array of Meals with length <= perPage) */
  groupedItems: Meals[][] = [];

  private resizeHandler = () => {
    if (isPlatformBrowser(this.platformId)) {
      this.updateGrouping(window.innerWidth);
    }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // start with requested rows/cols
    this.rowsNum = this.numOfRows;
    this.closNum = this.numOfColumns;

    const width = isPlatformBrowser(this.platformId) ? window.innerWidth : 1200;
    this.updateGrouping(width);

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['itemsList'] ||
      changes['numOfColumns'] ||
      changes['numOfRows'] ||
      changes['autoplayInterval']
    ) {
      const width = isPlatformBrowser(this.platformId)
        ? window.innerWidth
        : 1200;
      // update internal rows/cols with latest inputs then regroup
      this.rowsNum = this.numOfRows;
      this.closNum = this.numOfColumns;
      this.updateGrouping(width);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  /** Called by child card when clicked */
  onMealSelect(mealIdOrEvent: string | any) {
    const id =
      typeof mealIdOrEvent === 'string'
        ? mealIdOrEvent
        : mealIdOrEvent?.idMeal || mealIdOrEvent?.id;
    if (id) this.mealSelected.emit(id);
  }

  /** produce an array of length rowsNum for *ngFor */
  getRowsArray() {
    return Array.from({ length: this.rowsNum });
  }

  private groupItems(items: Meals[], perPage: number): Meals[][] {
    const grouped: Meals[][] = [];
    const list = items || [];
    for (let i = 0; i < list.length; i += perPage) {
      grouped.push(list.slice(i, i + perPage));
    }
    if (grouped.length === 0) grouped.push([]); // ensure at least one page
    return grouped;
  }

  /** Responsive logic: adjusts columns based on width but keeps user inputs as max */
  private updateGrouping(width: number) {
    // Start from requested column count and reduce on small widths
    let columns = this.numOfColumns;
    if (width <= 575) columns = Math.min(1, this.numOfColumns);
    else if (width <= 767) columns = Math.min(2, this.numOfColumns);
    else if (width <= 991) columns = Math.min(2, this.numOfColumns);
    else columns = this.numOfColumns;

    const rows = this.numOfRows;
    const perPage = Math.max(1, rows * columns);

    this.closNum = Math.max(1, columns);
    this.rowsNum = Math.max(1, rows);
    this.groupedItems = this.groupItems(this.itemsList || [], perPage);
  }

  getRows() {
    return Array(this.numOfRows)
      .fill(0)
      .map((_, i) => i);
  }
}
