import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { appConfig } from '../../app.config';
import { RoomService } from '../../services/room/room.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let mockRoomId = 207


  beforeEach(async () => {
    const roomServiceSpy = jasmine.createSpyObj(RoomService, ['createRoom', "addRoomId"]);
    const createRoomSpy = roomServiceSpy.createRoom.and.returnValue(of({ roomId: mockRoomId, status: "OPEN" }))

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [appConfig.providers, { provide: RoomService, useValue: roomServiceSpy }]
    })
      .overrideComponent(HeaderComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('create room button shouldnt render when not logged in ', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button.ml4')).toBeFalsy();
  });

  it('router should call navigate after successfully created room', fakeAsync(() => {
    const routerSpy = spyOn(router, "navigate");
    component.onCreateRoomClicked()
    fixture.detectChanges();
    tick();
    expect(routerSpy).toHaveBeenCalled()
    expect(routerSpy).toHaveBeenCalledWith(["dashboard", mockRoomId.toString()])
  }));
});
