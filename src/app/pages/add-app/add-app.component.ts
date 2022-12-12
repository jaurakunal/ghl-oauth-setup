import {Component, OnInit} from '@angular/core';
import {GhlService} from '../../service/ghl.service';
import {ActivatedRoute} from '@angular/router';
import {LoaderComponent} from '../../components/loader/loader.component';
import {MatDialog} from '@angular/material/dialog';
import {LocationModel} from '../../models/locations/location.model';
import {LoginComponent} from '../../components/login/login.component';
import {HttpErrorResponse} from '@angular/common/http';
import {GhlAppModel} from "../../models/ghl-app/ghl-app.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OauthAuthorizationModel} from "../../models/login-flow/oauth-authorization.model";
import {PageEvent} from '@angular/material/paginator';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.css']
})
export class AddAppComponent implements OnInit {

  locationsList: Array<LocationModel>;
  selectedLocations: Array<LocationModel>;
  app: GhlAppModel;
  loader: any;
  query: string = '';
  pageSize: number = 100;
  recordCount: number = 0;
  authCodeStatus: Array<string> = new Array<string>();
  showRedirectUri: boolean = false;
  redirectUri: string = '';

  constructor(private ghl: GhlService, private route: ActivatedRoute, private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.locationsList = new Array<LocationModel>();
    this.selectedLocations = new Array<LocationModel>();
    this.app = {
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

  ngOnInit(): void {
    const appId: any = this.route.snapshot.paramMap.get('appId');

    if (appId === null || appId === undefined) {
      return;
    }

    this.loadAppDetails(appId);
    this.loadLocations(0);
  }

  private loadAppDetails(appId: string) {
    this.showRedirectUri = false;
    console.log("Getting info for " + appId);
    const ghlMarketplaceCreds: any = localStorage.getItem("ghl_marketplace_credentials");
    const token: string = ghlMarketplaceCreds === null ? '' : JSON.parse(ghlMarketplaceCreds).jwt;
    this.ghl.getMyAppDetail(token, appId).subscribe((result) => {
      console.log(result);
      this.app = this.getGhlAppFrom(result["app"]);
    },(error:HttpErrorResponse) => {
      console.log(error);
      this.ghl.getAppDetailsFor(appId).subscribe((result) => {
        console.log(result);
        this.app = this.getGhlAppFrom(result["integration"]);
        this.showRedirectUri = true;
      }, (error) => {
        console.log(error);
        this.snackBar.open("We ran into an issue getting app info. Please try again!",  "Ok!", {
          duration: 5000
        });
      });
    });
  }

  private loadLocations(skipCount: number) {
    const ghlAppCreds: any = localStorage.getItem("ghl_app_credentials");

    if (ghlAppCreds === null) {
      const loginDialog: any = this.dialog.open(LoginComponent, {
        width: '700px',
        height: '500px',
        disableClose: true,
        data: {
          type: "GHLApp"
        }
      });
      loginDialog.afterClosed().subscribe(() => {
        this.loadLocations(skipCount);
      })
    } else {
      this.toggleLoaderDisplay(true, "Loading locations!");
      const apiKey: string = JSON.parse(ghlAppCreds).apiKey;
      this.ghl.getLocations(apiKey, this.pageSize, skipCount).subscribe((result) => {
        this.locationsList = new Array<LocationModel>();
        this.toggleLoaderDisplay(false, "");
        console.log(result);
        this.recordCount = result["hit"][0]["count"];
        console.log("Total locations = " + this.recordCount);

        for(const location of result["locations"]) {
          this.locationsList.push(this.getLocationFrom(location));
        }
      }, (error: HttpErrorResponse) => {
        this.toggleLoaderDisplay(false, "");
        console.log(error)
      });
    }
  }

  private getLocationFrom(location: any) {
    return {
      id: location._id,
      name: location.name,
      address: location.address !== undefined ? location.address : '',
      city: location.city !== undefined ? location.city : '',
      state: location.state !== undefined ? location.state : ''
    }
  }

  private toggleLoaderDisplay(show: boolean, message: string) {
    if (show) {
      this.loader = this.dialog.open(LoaderComponent, {
        id: 'add-app-api-loader',
        width: '250px',
        height: '250px',
        disableClose: true,
        data: {
          message: message
        }
      });
    } else {
      this.dialog.getDialogById('add-app-api-loader')?.close();
    }
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

  initAddApp(addToAll: boolean) {
    if (!addToAll && this.selectedLocations.length <= 0) {
      return;
    }

    const ghlAppCreds: any = localStorage.getItem("ghl_app_credentials");
    const apiKey: string = JSON.parse(ghlAppCreds).apiKey;

    if (addToAll) {
      this.getAllLocations(apiKey);
      return;
    }

    this.addAppToSelectedLocations(apiKey);
  }

  getAllLocations(apiKey: string) {
    this.toggleLoaderDisplay(true, "Getting auth code");
    const apiCalls = new Array<any>();
    let index: number = 0;
    const allLocations: Array<LocationModel> = new Array<LocationModel>();

    for(let i = 0; i < this.recordCount; i += this.pageSize) {
      console.log("Calling getLocation with skipCount = " + i);
      apiCalls[index++] = this.ghl.getLocations(apiKey, this.pageSize, i);
    }

    forkJoin(apiCalls).subscribe(( result: any) => {
      console.log(result);

      for (let i = 0; i < apiCalls.length; i++) {
        for (const location of result[i]["locations"]) {
          allLocations.push(this.getLocationFrom(location));
        }
      }

      this.getAuthCodeForLocations(apiKey, allLocations)
    });
  }

  getAuthCodeForLocations(apiKey: string, allLocations: Array<LocationModel>) {
    this.authCodeStatus = new Array<string>();
    console.log("authorizing codes for " + allLocations.length + " locations.");
    let index = 0;

    for (const location of allLocations) {
      const authCodeReq: OauthAuthorizationModel = {
        client_id: this.app.clientKeys[0].id,
        location_id: location.id,
        response_type: '',
        redirect_url: this.showRedirectUri ? this.redirectUri : this.app.redirectUris[0],
        scope: this.app.allowedScopes.toString().replaceAll(",", " ")
      };
      index++;
      this.ghl.getOAuthAuthorizationCode(apiKey, authCodeReq).subscribe((result) => {
        const redirectUrl = result["redirectUrl"];
        const status: string = "AuthCode for location '" + location.name + "' - " + redirectUrl.split("=")[1]
        this.authCodeStatus.push(status);
        this.ghl.callRedirectUrl(redirectUrl).subscribe((result) => {
          index--;
          this.shouldToggleLoader(index);
        }, (error: HttpErrorResponse) => {
          console.log("Error calling redirectUri - " + error.url);
          console.error(error.error);
          index--;
          this.shouldToggleLoader(index);
        });
      }, (error) => {
        console.log("Error getting auth code for " + location.name);
        console.error(error.error);
        index--;
        this.shouldToggleLoader(index);
      });

    }
  }

  shouldToggleLoader(index: number) {
    if (index === 0) {
      console.log(this.authCodeStatus.toString().replaceAll(",", "\n"));
      this.toggleLoaderDisplay(false, '');
      this.snackBar.open("Please see the console log for auth codes for each location",  "Ok!");
    }
  }
  addAppToSelectedLocations(apiKey: string) {
    this.toggleLoaderDisplay(true, "Getting auth code");
    console.log("Adding app " + this.app.name + " for these locations: ");
    console.log(this.selectedLocations);
    this.getAuthCodeForLocations(apiKey, this.selectedLocations)
  }

  changePage(event: PageEvent) {
    const skipRecords = event.pageIndex * this.pageSize;
    this.loadLocations(skipRecords);
  }

}
