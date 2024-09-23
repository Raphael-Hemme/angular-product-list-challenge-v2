import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgStyle],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent implements OnInit {
  @Input() width = '100%';
  @Input() height = '100%';

  public currStyle = {
    width: this.width,
    height: this.height
  };

  ngOnInit(): void {
    this.currStyle = {
      width: this.width,
      height: this.height
    };
  }
}
