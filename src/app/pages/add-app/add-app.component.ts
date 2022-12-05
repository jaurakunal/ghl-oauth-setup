import {Component, OnInit} from '@angular/core';
import {GhlService} from '../../service/ghl.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.css']
})
export class AddAppComponent implements OnInit {

  constructor(private ghl: GhlService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const appId: any = this.route.snapshot.paramMap.get('appId');
    this.loadAppDetails(appId);
    this.loadLocations();
  }

  private loadAppDetails(appId: string) {
    console.log("Getting info for " + appId);
  }

  private loadLocations() {

  }
}
