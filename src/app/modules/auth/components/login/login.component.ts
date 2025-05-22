import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/shared/services/alert.service';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // this.authService.signOut();
  }

  onSubmit() {
    this.alertService.loader();
    const { email, password } = this.form.value;
    this.authService.login(email, password).subscribe((res) => {
      if (res.ok) {
        this.alertService.successOrError('Sesión Iniciada!', '', 'success');
        this.router.navigate(['/books']);
      } else {
        this.alertService.successOrError(
          'Ocurrió un error!',
          'Verifique sus credenciales',
          'error'
        );
      }
    });
  }
}
