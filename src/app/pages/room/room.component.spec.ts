import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { appConfig } from '../../app.config';
import { RoomResponse } from '../../model/api/response';
import { AppService } from '../../services/app.service';
import { RoomService } from '../../services/room/room.service';
import { mockCloseRoomResponse, mockRoom, mockSuggestion } from '../../tests/mockData';
import { RoomComponent } from './room.component';

describe('RoomComponent', () => {
  let mockAppService: AppService;
  let roomServiceSpy: any;
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;
  let currentRoomBehaviorSubject: BehaviorSubject<RoomResponse>

  beforeEach(async () => {
    currentRoomBehaviorSubject = new BehaviorSubject(null)

    roomServiceSpy = jasmine.createSpyObj(
      'RoomService',
      ["getRoomDetailById", "addSuggestion", "updateSuggestion", "closeRoom", "updateCurrentRoomStatus"],
      { "currentRoom": currentRoomBehaviorSubject.asObservable() });
    roomServiceSpy.getRoomDetailById.and.returnValue(of(mockRoom))
    roomServiceSpy.addSuggestion.and.returnValue(of(mockSuggestion))
    roomServiceSpy.closeRoom.and.returnValue(of(mockCloseRoomResponse))
    mockAppService = new AppService()
    await TestBed.configureTestingModule({
      imports: [RoomComponent],
      providers: [
        appConfig.providers,
        { provide: AppService, useValue: mockAppService },
        { provide: RoomService, useValue: roomServiceSpy },
        {
          provide: ActivatedRoute, useValue: {
            params: of({ id: 123 })
          }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRoomDetailById if there is route params abd room should be populated', fakeAsync(() => {
    expect(roomServiceSpy.getRoomDetailById).toHaveBeenCalled()
    expect(component.room).toBeNull();
    currentRoomBehaviorSubject.next(mockRoom);
    expect(component.room).toBe(mockRoom);
  }))

  it('should not update suggestion when sugestion field is empty', fakeAsync(() => {
    currentRoomBehaviorSubject.next(mockRoom);
    expect(component.room).toBe(mockRoom);
    fixture.detectChanges();
    const addSuggestionButton = fixture.debugElement.nativeElement.querySelector("button[mat-icon-button]");
    addSuggestionButton.click();

    flush()

    expect(roomServiceSpy.addSuggestion).not.toHaveBeenCalled();

  }))

  it('should update suggestion when sugestion field is filled', fakeAsync(() => {
    currentRoomBehaviorSubject.next(mockRoom);
    expect(component.room).toBe(mockRoom);
    fixture.detectChanges();
    const input = fixture.debugElement.nativeElement.querySelector("input");
    const addSuggestionButton = fixture.debugElement.nativeElement.querySelector("button[mat-icon-button]");
    input.value = "test";
    input.dispatchEvent(new Event("input"));
    addSuggestionButton.click();
    fixture.detectChanges();

    expect(roomServiceSpy.addSuggestion).toHaveBeenCalled();

  }))


  it('should close room when close room button is clicked', fakeAsync(() => {
    currentRoomBehaviorSubject.next(mockRoom);
    expect(component.room).toBe(mockRoom);
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector("button.mb-8");
    button.click()
    flush();
    fixture.detectChanges();

    expect(roomServiceSpy.closeRoom).toHaveBeenCalledWith(mockRoom.roomId);

  }))






});
