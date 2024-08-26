import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoomResponse } from '../../model/api/response';
import { AppService } from '../../services/app.service';
import { RoomService } from '../../services/room/room.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent implements OnInit, OnDestroy {

  suggestion = new FormControl('');
  room: RoomResponse = null;

  updateInterval: ReturnType<typeof setInterval> = null;

  private subscribers: Subscription[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private roomService: RoomService,
    private appService: AppService) {
  }
  ngOnInit(): void {
    this.setUpdateInterval()
    this.activatedRoute.params.subscribe(params => {
      if (params["id"]) {
        this.getRoomDetail(params["id"])
      }
    })

    this.subscribers.push(this.roomService.currentRoom.subscribe(room => {
      this.room = room
    }))
  }

  @HostListener('document:visibilitychange', ['$event'])
  onPageVisibilityChange() {
    if (!document.hidden && this.room) {
      this.removeUpdateInterval()
      this.setUpdateInterval()
      this.getRoomDetail(this.room.roomId.toString())
    }
  }


  getRoomDetail(roomId: string) {
    this.roomService.getRoomDetailById(roomId).subscribe({
      "next": (response) => {
        this.roomService.setCurrentRoom(response)
      },
      "error": (error) => error
    });
  }

  isClosed() {
    return this.room.status === "CLOSE"
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => subscriber.unsubscribe);
    this.removeUpdateInterval();
  }

  setUpdateInterval() {
    this.updateInterval = setInterval(() => {
      if (this.room && !document.hidden) {
        this.getRoomDetail(this.room.roomId.toString())
      }
    }, 5000)
  }

  removeUpdateInterval() {
    if (this.updateInterval) {
      window.clearInterval(this.updateInterval)
      this.updateInterval = null;
    }
  }

  addSuggestion() {
    if (!this.suggestion.value.trim()) return;
    this.roomService.addSuggestion(this.room.roomId, this.suggestion.value).subscribe({
      next: (response) => {
        this.roomService.updateSuggestion(response)
        this.suggestion.setValue("");
      },
      error: (err) => err
    });
  }

  closeRoom() {
    this.roomService.closeRoom(this.room.roomId).subscribe({
      next: (response) => {
        this.roomService.updateCurrentRoomStatus("CLOSE", response.selectedSuggestion)
      },
      error: (err) => err
    })
  }

  onShareClicked() {
    navigator.clipboard.writeText(`http://localhost:4200/room/${this.room.roomId}`)
    this.appService.updateSnackBar("The link have been copied to your clipboard")
  }
}
