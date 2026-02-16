// height.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-height',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './height.component.html',
  styleUrl: './height.component.scss',
})
export class HeightComponent {
  @Input() form!: FormGroup;
  @Input() heights: number[] = [];
  @Input() selectedHeightIndex!: number;
  @Input() positionClassHeight!: (i: number) => string;
  @Input() onPickHeight!: (h: number) => void;
  @Input() currentStep!: number;
  @Input() stepsLength!: number;
}
