import {Component, OnInit} from '@angular/core';
import {GhlService} from '../../service/ghl.service';
import {ActivatedRoute} from '@angular/router';
import {LoaderComponent} from '../../components/loader/loader.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LocationModel} from '../../models/locations/location.model';
import {LoginComponent} from '../../components/login/login.component';
import {HttpErrorResponse} from '@angular/common/http';
import {GhlAppModel} from "../../models/ghl-app/ghl-app.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatSelectionListChange} from "@angular/material/list";
import {MatLegacyListOption} from "@angular/material/legacy-list";
import {OauthAuthorizationModel} from "../../models/login-flow/oauth-authorization.model";

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.css']
})
export class AddAppComponent implements OnInit {

  allLocations: Array<LocationModel>;
  selectedLocations: any;
  app: GhlAppModel;
  loader: any;
  query: string = '';

  constructor(private ghl: GhlService, private route: ActivatedRoute, private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.allLocations = new Array<LocationModel>();
    //this.selectedLocations = new Array<LocationModel>();
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
    this.loadLocations();
  }

  private loadAppDetails(appId: string) {
    console.log("Getting info for " + appId);
    const ghlMarketplaceCreds: any = localStorage.getItem("ghl_marketplace_credentials");
    const token: string = JSON.parse(ghlMarketplaceCreds).jwt;
    this.ghl.getMyAppDetail(token, appId).subscribe((result) => {
      console.log(result);
      this.app = this.getGhlAppFrom(result["app"]);
    },(error:HttpErrorResponse) => {
      console.log(error);
      this.ghl.getAppDetailsFor(appId).subscribe((result) => {
        console.log(result);
        this.app = this.getGhlAppFrom(result["app"]);
      }, (error) => {
        console.log(error);
        this.snackBar.open("We ran into an issue getting app info. Please try again!",  "Ok!", {
          duration: 5000
        });
      });
    });
  }

  private loadLocations() {
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
        this.loadLocations();
      })
    } else {
      this.toggleLoaderDisplay(true, "Loading locations!");
      const apiKey: string = JSON.parse(ghlAppCreds).apiKey;
      this.ghl.getLocations(apiKey).subscribe((result) => {
        this.toggleLoaderDisplay(false, "");
        console.log(result);
        for(const location of result["locations"]) {
          this.allLocations.push(this.getLocationFrom(location));
        }
      }, (error: HttpErrorResponse) => {
        this.toggleLoaderDisplay(false, "");
        console.log(error)
        if (error.status === 401) {

        }
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
    console.log("Adding app " + this.app.name + " for these locations: ");
    console.log(this.selectedLocations);

    if (addToAll) {
      this.selectedLocations = this.allLocations;
    }

    const ghlAppCreds: any = localStorage.getItem("ghl_app_credentials");
    const apiKey: string = JSON.parse(ghlAppCreds).apiKey;

    for (const location of this.selectedLocations) {
      const authCodeReq: OauthAuthorizationModel = {
        client_id: this.app.clientKeys[0].id,
        location_id: location.id,
        response_type: '',
        redirect_url: this.app.redirectUris[0],
        scope: this.app.allowedScopes.toString().replaceAll(",", " ")
      };
      this.ghl.getOAuthAuthorizationCode(apiKey, authCodeReq).subscribe((result) => {
        console.log(result);
        const redirectUrl = result["redirectUrl"];
        this.ghl.callRedirectUrl(redirectUrl).subscribe((result) => {
          console.log("")
        }, (error) => {
          console.log(error);
        });
      }, (error) => {
        console.log(error);
      });
    }
  }

}
