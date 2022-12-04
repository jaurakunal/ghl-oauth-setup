import {Component, OnInit} from '@angular/core';
import {GhlAppModel} from '../../models/ghl-app/ghl-app.model';
import {GhlService} from '../../service/ghl.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {LoaderComponent} from '../../components/loader/loader.component';

@Component({
  selector: 'app-ghl-marketplace',
  templateUrl: './ghl-marketplace.component.html',
  styleUrls: ['./ghl-marketplace.component.css']
})
export class GhlMarketplaceComponent implements OnInit {

  ghlApps: Array<GhlAppModel>;
  loader: any;
  query: string = '';

  constructor(private ghl: GhlService, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.ghlApps = new Array<GhlAppModel>();
  }

  ngOnInit(): void {
    this.loadAllMarketplaceApps();
  }

  private loadAllMarketplaceApps() {
    this.toggleLoaderDisplay(true, "Loading all apps!");
    this.ghl.getAllMarketplaceApps().subscribe((result) => {
      this.toggleLoaderDisplay(false, '');
      console.log(result);
      for (const app of result["integrations"]) {
        this.ghlApps.push(this.getGhlAppFrom(app));
      }
    }, (error) => {
      this.toggleLoaderDisplay(false, '');
      console.log(error);
      this.snackBar.open("We ran into an issue getting all apps. Please tray again!",  "Ok!", {
        duration: 5000
      });
    });
  }

  private getGhlAppFrom(app: any) {
    return {
      id: app._id,
      name: app.name,
      createdAt: app.created,
      companyName: app.companyName,
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

  showAppDetail($event: string) {

  }


  private toggleLoaderDisplay(show: boolean, message: string) {
    if (show) {
      this.loader = this.dialog.open(LoaderComponent, {
        width: '250px',
        height: '250px',
        disableClose: true,
        data: {
          message: message
        }
      });
    } else {
      this.dialog.closeAll();
    }
  }

}
