extends CharacterBody3D

class_name PlayerController

# Movement parameters
@export var max_speed: float = 8.0
@export var acceleration: float = 40.0
@export var friction: float = 20.0
@export var dash_speed: float = 15.0
@export var dash_cooldown: float = 2.0

# Dash state
var can_dash: bool = true
var is_dashing: bool = false
var dash_timer: float = 0.0
var dash_duration: float = 0.3
var dash_direction: Vector3 = Vector3.ZERO

# Gravity
var gravity: float = 9.8

func _ready() -> void:
	# Ensure the character is affected by physics
	pass

func _physics_process(delta: float) -> void:
	# Handle dash cooldown
	if not can_dash:
		dash_timer += delta
		if dash_timer >= dash_cooldown:
			can_dash = true
			dash_timer = 0.0

	# Handle dash duration
	if is_dashing:
		dash_timer += delta
		if dash_timer >= dash_duration:
			is_dashing = false
			dash_timer = 0.0

	# Apply gravity
	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = -0.1  # Small downward velocity to keep grounded

	# Handle dash input
	if Input.is_action_just_pressed("dash") and can_dash and not is_dashing:
		_perform_dash()

	# Handle movement
	if not is_dashing:
		_handle_movement(delta)
	else:
		# During dash, maintain dash velocity
		velocity.x = dash_direction.x * dash_speed
		velocity.z = dash_direction.z * dash_speed

	# Move the character
	move_and_slide()

func _handle_movement(delta: float) -> void:
	# Get input direction
	var input_dir := Vector2.ZERO
	input_dir.x = Input.get_action_strength("move_right") - Input.get_action_strength("move_left")
	input_dir.y = Input.get_action_strength("move_back") - Input.get_action_strength("move_forward")

	# Normalize input to prevent faster diagonal movement
	if input_dir.length() > 1.0:
		input_dir = input_dir.normalized()

	# Calculate movement direction (relative to world space for now)
	var direction := Vector3(input_dir.x, 0, input_dir.y).normalized()

	# Apply acceleration or friction
	if direction != Vector3.ZERO:
		# Accelerate in the input direction
		velocity.x = move_toward(velocity.x, direction.x * max_speed, acceleration * delta)
		velocity.z = move_toward(velocity.z, direction.z * max_speed, acceleration * delta)
	else:
		# Apply friction when no input
		velocity.x = move_toward(velocity.x, 0, friction * delta)
		velocity.z = move_toward(velocity.z, 0, friction * delta)

func _perform_dash() -> void:
	# Get current input direction
	var input_dir := Vector2.ZERO
	input_dir.x = Input.get_action_strength("move_right") - Input.get_action_strength("move_left")
	input_dir.y = Input.get_action_strength("move_back") - Input.get_action_strength("move_forward")

	# If no input, dash forward (negative Z in Godot's coordinate system)
	if input_dir.length() == 0:
		dash_direction = Vector3(0, 0, -1)
	else:
		# Normalize input
		if input_dir.length() > 1.0:
			input_dir = input_dir.normalized()
		dash_direction = Vector3(input_dir.x, 0, input_dir.y).normalized()

	# Start dash
	is_dashing = true
	can_dash = false
	dash_timer = 0.0

	# Set initial dash velocity
	velocity.x = dash_direction.x * dash_speed
	velocity.z = dash_direction.z * dash_speed

func get_dash_cooldown_progress() -> float:
	"""Returns the dash cooldown progress as a value between 0 and 1."""
	if can_dash:
		return 1.0
	return dash_timer / dash_cooldown
