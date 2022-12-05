import {Component, OnInit} from '@angular/core';
import {GhlAppModel} from '../../models/ghl-app/ghl-app.model';
import {GhlService} from '../../service/ghl.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {LoaderComponent} from '../../components/loader/loader.component';
import {LoginComponent} from '../../components/login/login.component';
import {Router} from '@angular/router';

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
  loginDialog: any;
  appType: string;
  marketplaceToken: string = '';

  constructor(private ghl: GhlService, private snackBar: MatSnackBar, private dialog: MatDialog,
              private router: Router) {
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
    this.appType = "myapps";
  }

  ngOnInit(): void {
    this.showSplitView = false;
    this.showDashboardView = true;
    this.loadMyApps();
  }

  loadAllMarketplaceApps() {
    this.appType = "marketplace";
    this.ghlApps = new Array<GhlAppModel>();
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

  loadMyApps() {
    this.appType = "myapps";
    this.toggleLoaderDisplay(true, "Loading your apps!");
    this.ghlApps = new Array<GhlAppModel>();
    const ghlMarketplaceCreds: any = localStorage.getItem("ghl_marketplace_credentials");

    if (ghlMarketplaceCreds === null) {
      this.toggleLoaderDisplay(false, "");
      this.router.navigateByUrl("/login");
      return;
    }

    this.marketplaceToken = JSON.parse(ghlMarketplaceCreds).jwt;
    this.ghl.getMyApps(this.marketplaceToken).subscribe((result) => {
      this.toggleLoaderDisplay(false, '');
      console.log(result);
      for (const app of result["apps"]) {

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
      clientKeys: app.clientKeys !== undefined ? app.clientKeys : [{id: '', name: '', createdAt: ''}],
      allowedScopes: app.allowedScopes !== undefined ? app.allowedScopes : [],
      redirectUris: app.redirectUris !== undefined ? app.redirectUris : [],
      webhookUrl: app.webhookUrl !== undefined ? app.webhookUrl : ''
    };
  }

  updateSelectedApp(event: string) {
    this.showAppDetail(event);
  }

  showAppDetail(id: string) {
    this.toggleLoaderDisplay(true, "Getting app details!");

    if (this.appType === "marketplace") {
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
    } else {
      this.ghl.getMyAppDetail(this.marketplaceToken, id).subscribe((result) => {
        this.toggleLoaderDisplay(false, '');
        console.log(result);
        this.selectedApp = this.getGhlAppFrom(result["app"]);
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
  }

  private toggleLoaderDisplay(show: boolean, message: string) {
    if (show) {
      this.loader = this.dialog.open(LoaderComponent, {
        id: 'marketplace-api-loader',
        width: '250px',
        height: '250px',
        disableClose: true,
        data: {
          message: message
        }
      });
    } else {
      this.dialog.getDialogById('marketplace-api-loader')?.close();
    }
  }

  initAddAppFlow(app: GhlAppModel) {
    const credentials = localStorage.getItem("ghl_app_credentials");
    console.log("credentials" + credentials);
    if (credentials === null) {
      this.loginDialog = this.dialog.open(LoginComponent, {
        width: '600px',
        height: '500px',
        disableClose: true,
        data: {
          type: "GHLApp"
        }
      });
      this.loginDialog.afterClosed().subscribe(() => {
        this.navigateToAddApp(app.id);
      })
    } else {
        this.navigateToAddApp(app.id);
    }
  }

  private navigateToAddApp(appId: string) {
    this.router.navigateByUrl("/add-app/" + appId);
  }
}
