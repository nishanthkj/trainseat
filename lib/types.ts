export interface Seat {
  id: number;
  row: number;
  isBooked: boolean;
}

export interface BookingRequest {
  numberOfSeats: number;
}

export interface BookingResponse {
  success: boolean;
  seats: number[];
  message: string;
}