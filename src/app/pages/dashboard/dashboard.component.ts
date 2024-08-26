import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { BasicRoomData } from '../../model/api/response';
import { RoomService } from '../../services/room/room.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, RouterOutlet, MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  rooms: BasicRoomData[] = []

  private subscribers: Subscription[] = [];

  constructor(private roomService: RoomService) { }

  ngOnInit() {
    this.roomService.getAllRoomId().subscribe({
      "next": (response) => this.roomService.setAllRoomId(response.rooms),
      "error": (error) => error
    });

    this.subscribers.push(
      this.roomService.allRoomIds.subscribe(rooms => {
        if (rooms) {
          this.rooms = rooms
        }
      })
    )

  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    })
  }

}
