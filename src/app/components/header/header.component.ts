import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import Cookies from "js-cookie";
import { RoomService } from '../../services/room/room.service';
import { HeaderService } from './header.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  readonly dialog = inject(MatDialog);

  constructor(
    private headerService: HeaderService,
    private roomService: RoomService,
    private router: Router) { }

  get isLogin() {
    const authToken = Cookies.get("authorization")

    return !!authToken
  }

  async onCreateRoomClicked() {
    this.roomService.createRoom().subscribe({
      "next": (room) => {
        this.roomService.addRoomId(room)
        this.router.navigate([`dashboard`, `${room.roomId}`])
      },
      "error": (error) => error
    })
  }

  logout() {
    this.headerService.logout();
    this.router.navigate(["/login"])
  }
}
