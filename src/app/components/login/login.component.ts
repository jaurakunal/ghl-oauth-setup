import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {GhlService} from '../../service/ghl.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {LoginRequestModel} from '../../models/login-flow/login-request.model';
import {LoaderComponent} from '../loader/loader.component';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  @Output()
  loginCompleted = new EventEmitter<any>();

  constructor(private ghl: GhlService, private formBuilder: FormBuilder, private dialog: MatDialog,
              private snackBar: MatSnackBar) {
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
    this.toggleLoaderDisplay(true, "Logging in!")
    this.loginReq.email = this.loginFormGroup.value.email;
    this.loginReq.password = this.loginFormGroup.value.password;
    this.ghl.login(this.loginReq).subscribe((result) => {
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
    })
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
      this.loginCompleted.emit(result);
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
