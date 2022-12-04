import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {GhlAppModel} from '../../models/ghl-app/ghl-app.model';

@Component({
  selector: 'app-ghl-app',
  templateUrl: './ghl-app.component.html',
  styleUrls: ['./ghl-app.component.css']
})
export class GhlAppComponent implements OnChanges {
  @Input() ghlApp: GhlAppModel;
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    this.ghlApp = {
      id: '',
      name: '',
      createdAt: '',
      companyName: '',
      description: '',
      tagline: '',
      website: '',
      clientKeys: [
        {
          id: ''
        }
      ],
      allowedScopes: []
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ghlApp'] === undefined || changes['ghlApp'].currentValue === undefined) {
      this.ghlApp = {
        id: '',
        name: '',
        createdAt: '',
        companyName: '',
        description: '',
        tagline: '',
        website: '',
        clientKeys: [
          {
            id: ''
          }
        ],
        allowedScopes: []
      };
    }

    this.ghlApp = changes['ghlApp'].currentValue;
  }

  appSelected() {
    this.selected.emit(this.ghlApp.id);
  }
}
