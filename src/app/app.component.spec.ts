import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { AppService } from './services/app.service';

describe('AppComponent', () => {
  let mockAppService: AppService;
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent;

  beforeEach(async () => {
    mockAppService = new AppService()
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [...appConfig.providers, { provide: AppService, useValue: mockAppService }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;


  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('app header should render', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('call snackopen when observables has new changes', fakeAsync(() => {
    const appSnackBarSpy = spyOn(component._snackBar, "open")
    mockAppService.updateSnackBar("test");
    tick();
    expect(component._snackBar.open).toHaveBeenCalled();
  }))
});
