export interface LoginResponse {
  jwt: string
}

export interface Suggestion {
  suggestionId: number,
  suggestion: string,
  displayName?: string
}

export interface RoomResponse {
  roomId: number,
  suggestions: Suggestion[],
  status: string,
  isOwner: boolean,
  selectedSuggestion?: string
}

export interface BasicRoomData {
  roomId: number,
  status: string
}

export interface GetAllRoomResponse {
  rooms: BasicRoomData[],
}

export interface CloseRoomResponse {
  selectedSuggestion: string
}