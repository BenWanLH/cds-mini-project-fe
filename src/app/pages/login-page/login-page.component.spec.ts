import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { appConfig } from '../../app.config';
import { LoginPageComponent } from './login-page.component';
import { LoginPageService } from './login-page.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let router: Router;

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj(LoginPageService, ['login']);
    const loginSpy = loginServiceSpy.login.and.returnValue(of({ jwt: "test" }))

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [appConfig.providers, { provide: LoginPageService, useValue: loginServiceSpy }],
    })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if login is clicked with empty fields', fakeAsync(() => {
    const onLoginSpy = spyOn(component, 'onLogin');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    tick();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(onLoginSpy).toHaveBeenCalled();
    expect(compiled.querySelector('mat-error')).toBeTruthy();
  }));

  it('router should call navigate when login called ', fakeAsync(() => {
    const routerSpy = spyOn(router, "navigate");
    component.usernameFormControl.setValue("abc");
    component.passwordFormControl.setValue("abc");
    component.onLogin()
    fixture.detectChanges();
    tick();
    expect(routerSpy).toHaveBeenCalled()
  }));
});
