import {Component, OnInit} from '@angular/core';
import {GhlService} from '../../service/ghl.service';
import {ActivatedRoute} from '@angular/router';
import {LoaderComponent} from '../../components/loader/loader.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LocationModel} from '../../models/locations/location.model';
import {LoginComponent} from '../../components/login/login.component';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-app',
  templateUrl: './add-app.component.html',
  styleUrls: ['./add-app.component.css']
})
export class AddAppComponent implements OnInit {

  allLocations: Array<LocationModel>;
  selectedLocations: Array<LocationModel>;
  loader: any;

  constructor(private ghl: GhlService, private route: ActivatedRoute, private dialog: MatDialog) {
    this.allLocations = new Array<LocationModel>();
    this.selectedLocations = new Array<LocationModel>();
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
    const ghlAppCreds: any = localStorage.getItem("ghl_app_credentials");

    if (ghlAppCreds === null) {
      const loginDialog: any = this.dialog.open(LoginComponent, {
        width: '600px',
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
}
