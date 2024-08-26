import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BasicRoomData, CloseRoomResponse, GetAllRoomResponse, RoomResponse, Suggestion } from '../../model/api/response';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private httpClient: HttpClient) { }

  private _allRoomIds: BehaviorSubject<BasicRoomData[]> = new BehaviorSubject([]);
  private _currentRoom: BehaviorSubject<RoomResponse | null> = new BehaviorSubject(null)

  public readonly allRoomIds: Observable<BasicRoomData[]> = this._allRoomIds.asObservable();
  public readonly currentRoom: Observable<RoomResponse | null> = this._currentRoom.asObservable();

  getRoomDetailById(roomId: string) {
    return this.httpClient.get<RoomResponse>(`${environment.apiUrl}/room?roomId=${roomId}`)
  }

  getAllRoomId() {
    return this.httpClient.get<GetAllRoomResponse>(`${environment.apiUrl}/room/all`)
  }

  createRoom() {
    return this.httpClient.post<BasicRoomData>(`${environment.apiUrl}/room/create`, {})
  }

  closeRoom(roomId: number) {
    return this.httpClient.post<CloseRoomResponse>(`${environment.apiUrl}/room/${roomId}/close`, {})
  }

  addSuggestion(roomId: number, suggestion: string) {
    return this.httpClient.put<Suggestion>(`${environment.apiUrl}/room/${roomId}/suggestion`, {
      suggestion
    })
  }

  setCurrentRoom(room: RoomResponse) {
    this._currentRoom.next(room);
  }

  addRoomId(roomId: BasicRoomData) {
    const roomIds = this._allRoomIds.getValue()
    roomIds.push(roomId);
    this._allRoomIds.next(roomIds);
  }

  setAllRoomId(roomIds: BasicRoomData[]) {
    this._allRoomIds.next(roomIds);
  }

  updateSuggestion(suggestion: Suggestion) {
    const currentRoom = this._currentRoom.getValue();
    currentRoom.suggestions.push(suggestion);
    this._currentRoom.next(currentRoom);
  }

  updateCurrentRoomStatus(status: string, selectedSuggestion?: string) {
    const currentRoom = this._currentRoom.getValue();
    currentRoom.status = status;
    if (selectedSuggestion) currentRoom.selectedSuggestion = selectedSuggestion;
    this._currentRoom.next(currentRoom);
  }

}
