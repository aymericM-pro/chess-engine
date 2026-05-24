// Request bodies
export interface LoginBody    { email: string; password: string }
export interface RegisterBody { email: string; username: string; password: string }
export interface ForgotPasswordBody { email: string }
export interface ResetPasswordBody { token: string; password: string }
export interface UpdateUserBody { username?: string; password?: string }
export interface PatchUserBody  { firstName?: string; lastName?: string }
export interface ChangePasswordBody { currentPassword: string; newPassword: string }
export interface CreateGameBody { timeControl: string; timeLimit: number; increment: number; playerId?: string; opponent?: string }
export interface PlayMoveBody {
  san:         string
  from:        string
  to:          string
  isCheck:     boolean
  isCheckmate: boolean
  timeLeft:    number
  promotion?:  string
}
export interface PatchPlayerBody {
  username?:       string
  elo?:            number
  rating?:         string
  bio?:            string
  country?:        string
  preferredColor?: string
}

export interface CreateFriendRequestBody { addresseeId: string }

// Response DTOs
export interface UserResponseDto {
  id:         string
  email:      string
  username:   string
  createdAt:  string
  firstName?: string
  lastName?:  string
}

export interface AuthResponseDto {
  token: string
  user: UserResponseDto
}

export interface ForgotPasswordResponseDto {
  sent: boolean
}

export interface ResetPasswordResponseDto {
  success: boolean
}

export interface GameMove {
  moveNumber: number
  color:      'white' | 'black'
  san:        string
  from:       string
  to:         string
  isCheck:    boolean
  isCheckmate: boolean
  promotion?: string
  playedAt:   string
  timeLeft:   number
}

export interface GameResponseDto {
  id: string
  whiteId: string
  blackId: string | null
  status: string
  result: string | null
  endReason: string | null
  timeControl: string
  timeLimit: number
  increment: number
  whiteTimeLeft: number
  blackTimeLeft: number
  moves: GameMove[]
  currentTurn: string
  moveCount: number
  drawOfferedBy:  string | null
  lastMoveAt:     string | null
  startedAt:      string | null
  finishedAt:     string | null
  createdAt:      string
  playerId:       string | null
  reportPath:     string | null
  whiteUsername?: string
  blackUsername?: string | null
}

export interface GameReportUploadResponse {
  skipped: boolean
  path: string | null
  url: string | null
  reason?: string
}

export interface PlayerResponseDto {
  id:              string
  username:        string
  elo:             number
  rating:          string
  createdAt:       string
  bio?:            string
  country?:        string
  preferredColor?: string
}

export interface FriendRequestResponseDto {
  id: string
  requesterId: string
  addresseeId: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export interface FriendRequestPlayerDto {
  id: string
  username: string
  elo: number
  rating: string
}

export interface FriendRequestWithPlayerDto extends FriendRequestResponseDto {
  requester: FriendRequestPlayerDto
  addressee: FriendRequestPlayerDto
}

export interface FriendRequestsResponseDto {
  incoming: FriendRequestWithPlayerDto[]
  outgoing: FriendRequestWithPlayerDto[]
}

export interface FriendResponseDto {
  requestId: string
  player: FriendRequestPlayerDto
  since: string
}

export interface NotificationResponseDto {
  id: string
  type: string
  data: Record<string, unknown>
  readAt: string | null
  createdAt: string
}

export interface ApiErrorBody {
  requestId: string
  timestamp: string
  path: string
  code?: string
  message: string
  attemptsLeft?: number
  retryAfterMinutes?: number
}
