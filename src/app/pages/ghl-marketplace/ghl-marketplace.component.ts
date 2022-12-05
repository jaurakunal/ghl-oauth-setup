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
  showDashboardView: boolean;
  showSplitView: boolean;
  selectedApp: GhlAppModel;

  constructor(private ghl: GhlService, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.ghlApps = new Array<GhlAppModel>();
    this.showSplitView = false;
    this.showDashboardView = true;
    this.selectedApp = {
      id: '',
      name: '',
      createdAt: '',
      companyName: '',
      description: '',
      tagline: '',
      website: '',
      clientKeys: [],
      allowedScopes:  []
    };
  }

  ngOnInit(): void {
    this.showSplitView = false;
    this.showDashboardView = true;
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
      description: app.description !== undefined ? app.description : '',
      tagline: app.tagline !== undefined ? app.tagline : '',
      website: app.website !== undefined ? app.website : '',
      clientKeys: app.clientKeys !== undefined ? app.clientKeys : [{id: ''}],
      allowedScopes: app.allowedScopes !== undefined ? app.allowedScopes : []
    };
  }

  updateSelectedApp(event: string) {
    this.showAppDetail(event);
  }

  showAppDetail(id: string) {
    this.toggleLoaderDisplay(true, "Getting app details!");
    this.ghl.getAppDetailsFor(id).subscribe((result) => {
      this.toggleLoaderDisplay(false, '');
      console.log(result);
      this.selectedApp = this.getGhlAppFrom(result["integration"]);
      this.showSplitView = true;
      this.showDashboardView = false;
    }, (error) => {
      this.toggleLoaderDisplay(false, '');
      console.log(error);
      this.snackBar.open("We ran into an issue getting app info. Please try again!",  "Ok!", {
        duration: 5000
      });
    });
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
