import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {GhlAppModel} from '../../models/ghl-app/ghl-app.model';
import {GhlService} from '../../service/ghl.service';
import {Dialog} from '@angular/cdk/dialog';

@Component({
  selector: 'app-ghl-app-detail',
  templateUrl: './ghl-app-detail.component.html',
  styleUrls: ['./ghl-app-detail.component.css']
})
export class GhlAppDetailComponent implements OnChanges {
  @Input() ghlApp: GhlAppModel;
  @Output() addAppSelected: EventEmitter<GhlAppModel>;

  constructor(private ghl: GhlService, private dialog: Dialog) {
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
          id: '',
          name: '',
          createdAt: ''
        }
      ],
      allowedScopes: [],
      redirectUris: [],
      webhookUrl: ''
    };
    this.addAppSelected = new EventEmitter<GhlAppModel>();
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
            id: '',
            name: '',
            createdAt: ''
          }
        ],
        allowedScopes: [],
        redirectUris: [],
        webhookUrl: ''
      };
    }

    this.ghlApp = changes['ghlApp'].currentValue;
  }

  initAddAppFlow() {
    this.addAppSelected.emit(this.ghlApp);
  }
}
