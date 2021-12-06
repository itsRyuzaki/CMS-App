import { BUTTON_IDs } from './../../Config/global-config';
import { buttonConfigs } from './button.config';
import { IButtonConfig } from './../../interfaces/button.interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() btnId: string;
  @Input() isLoading: boolean;

  @Output() btnClicked = new EventEmitter();
  config: IButtonConfig;

  buttonIds = { ...BUTTON_IDs };
  constructor() {}

  ngOnInit(): void {
    this.config = buttonConfigs[this.btnId];
  }

  onClickHandler(): void {
    if (!this.isLoading) {
      this.btnClicked.emit(this.config);
    }
  }
}
