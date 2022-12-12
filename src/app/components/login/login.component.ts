import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {GhlService} from '../../service/ghl.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoginRequestModel} from '../../models/login-flow/login-request.model';
import {DialogData, LoaderComponent} from '../loader/loader.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

export interface LoginType {
  type: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  otpOptionsFormGroup: FormGroup;
  otpFormGroup: FormGroup;
  showLoginSection: boolean = true;
  showOtpOptions: boolean = false;
  showOtpInput: boolean = false;
  loader: any;
  loginReq: LoginRequestModel;
  loginMessage: string;

  @Output()
  loginCompleted = new EventEmitter<any>();

  constructor(private ghl: GhlService, private formBuilder: FormBuilder, private dialog: MatDialog,
              private snackBar: MatSnackBar, public dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) public loginType: LoginType, private router: Router) {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.otpOptionsFormGroup = this.formBuilder.group({
      otpChannel: []
    });
    this.otpFormGroup = this.formBuilder.group({
      otp: []
    });
    this.loginReq = {
      email: '',
      password: '',
      otpChannel: '',
      otp: '',
      token: '',
      version: 2
    };

    if (loginType.type === 'GHLApp') {
      this.loginMessage = "Please use the your GHL app credentials.";
    } else {
      this.loginMessage = "Please use your GHL Marketplace credentials.";
    }
  }

  ngOnInit(): void {
    this.loginReq = {
      email: '',
      password: '',
      otpChannel: '',
      otp: '',
      token: '',
      version: 2
    };
  }

  loginRequest() {
    this.loginReq.email = this.loginFormGroup.value.email;
    this.loginReq.password = this.loginFormGroup.value.password;

    if (this.loginType.type === 'GHLApp') {
      this.loginMessage = "Please use the your GHL app credentials."
      this.callGhlAppLoginFlow();
    } else {
      this.callGhlMarketplaceLoginFlow();
    }
  }


  private callGhlAppLoginFlow() {
    this.toggleLoaderDisplay(true, "Logging into GHL App!")
    this.ghl.login(this.loginReq, true).subscribe((result) => {
      this.toggleLoaderDisplay(false, '');
      console.log(result);
      this.showLoginSection = false;
      this.showOtpOptions = true;
    }, (error) => {
      this.toggleLoaderDisplay(false, '');
      console.log(error);
      this.snackBar.open("Please check your email/ password and try again!",  "Ok!", {
        duration: 5000
      });
    });
  }

  private callGhlMarketplaceLoginFlow() {
    this.toggleLoaderDisplay(true, "Logging into GHL Marketplace!")
    this.ghl.login(this.loginReq, false).subscribe((result) => {
      this.toggleLoaderDisplay(false, '');
      console.log(result);
      localStorage.setItem("ghl_marketplace_credentials", JSON.stringify(result));
      this.router.navigateByUrl("/marketplace");
    }, (error) => {
      this.toggleLoaderDisplay(false, '');
      console.log(error);
      this.snackBar.open("Please check your email/ password and try again!",  "Ok!", {
        duration: 5000
      });
    });
  }

  private toggleLoaderDisplay(show: boolean, message: string) {
    if (show) {
      this.loader = this.dialog.open(LoaderComponent, {
        id: "login-api-loader",
        width: '250px',
        height: '250px',
        disableClose: true,
        data: {
          message: message
        }
      });
    } else {
      this.dialog.getDialogById("login-api-loader")?.close();
    }
  }

  getOtp() {
    this.toggleLoaderDisplay(true, "Requesting OTP!");
    this.loginReq.otpChannel = this.otpOptionsFormGroup.value.otpChannel;
    this.ghl.requestOtp(this.loginReq).subscribe((result) => {
      this.toggleLoaderDisplay(false, '');
      console.log(result);
      this.loginReq.token = result.token;
      this.showOtpOptions = false;
      this.showOtpInput = true;
    }, (error) => {
      this.toggleLoaderDisplay(false, '');
      console.log(error);
      this.snackBar.open("We ran into an issue requesting an OTP. Please try again!",  "Ok!", {
        duration: 5000
      });
    });
  }

  validateOtp() {
    this.toggleLoaderDisplay(true, "Getting access!");
    this.loginReq.otp = this.otpFormGroup.value.otp;
    this.ghl.validateOtp(this.loginReq).subscribe((result) => {
      this.toggleLoaderDisplay(false, "");
      console.log(result);
      this.saveAccessCredentials(result);
      this.loginCompleted.emit("Success");

      if (this.loginType.type === "GHLApp") {
        this.dialogRef.close()
      }
    }, (error) => {
      this.toggleLoaderDisplay(false, "");
      console.log(error);
      this.snackBar.open("We ran into an issue getting access. Please try again!",  "Ok!", {
        duration: 5000
      });
    });
  }

  private saveAccessCredentials(result: any) {
    localStorage.setItem("ghl_app_credentials", JSON.stringify(result));
  }
}
