import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() title = 'Guardar';
  @Output() buttonClick = new EventEmitter<Event>();
  @Input() disabled = false;

  constructor() {}

  ngOnInit() {}

  handleClick(event: Event) {
    if (event) {
      this.buttonClick.emit(event);
    }
  }
}
