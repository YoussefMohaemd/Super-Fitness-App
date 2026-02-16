import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss'],
})
export class GoalComponent {
  @Input() form!: FormGroup;
  @Input() currentStep!: number;
@Input() stepsLength!: number;

}
