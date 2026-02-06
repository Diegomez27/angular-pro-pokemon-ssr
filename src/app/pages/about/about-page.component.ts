import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-page.component',
  imports: [],
  templateUrl: './about-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPageComponent { }
