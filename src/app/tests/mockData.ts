import { CloseRoomResponse, RoomResponse, Suggestion } from "../model/api/response";


export const mockRoom: RoomResponse = {
  roomId: 123,
  suggestions: [],
  status: "OPEN",
  isOwner: true,
  selectedSuggestion: null
}

export const mockSuggestion: Suggestion = {
  suggestionId: 123,
  suggestion: "test",
  displayName: null
}

export const mockCloseRoomResponse: CloseRoomResponse = {
  selectedSuggestion: "test"
}