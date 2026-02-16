import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gender',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss'],
})
export class GenderComponent {
  @Input() form!: FormGroup;
  @Input() currentStep!: number;
  @Input() stepsLength!: number;
}
