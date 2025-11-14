extends Node3D

class_name EnemySpawner

# Spawn parameters
@export var spawn_interval: float = 2.0
@export var min_spawn_distance: float = 10.0
@export var max_spawn_distance: float = 20.0
@export var max_enemies: int = 100
@export var spawn_rate_increase: float = 0.95  # Multiplier applied to spawn_interval over time
@export var min_spawn_interval: float = 0.5  # Minimum spawn interval
@export var difficulty_increase_interval: float = 10.0  # Increase difficulty every X seconds

# Enemy scene (to be set in the editor or via code)
@export var enemy_scene: PackedScene

# Internal state
var spawn_timer: float = 0.0
var difficulty_timer: float = 0.0
var current_enemy_count: int = 0
var player: Node3D = null
var enemies: Array[Node3D] = []

func _ready() -> void:
	# Find the player node
	player = get_tree().get_first_node_in_group("player")
	if player == null:
		push_warning("EnemySpawner: No player found in 'player' group!")

	# If no enemy scene is set, create a simple enemy
	if enemy_scene == null:
		push_warning("EnemySpawner: No enemy scene set. Using default enemy.")

func _process(delta: float) -> void:
	if player == null:
		return

	# Update spawn timer
	spawn_timer += delta
	difficulty_timer += delta

	# Increase difficulty over time
	if difficulty_timer >= difficulty_increase_interval:
		difficulty_timer = 0.0
		spawn_interval = max(min_spawn_interval, spawn_interval * spawn_rate_increase)

	# Spawn enemies
	if spawn_timer >= spawn_interval:
		spawn_timer = 0.0
		_spawn_enemy()

	# Clean up destroyed enemies
	_cleanup_enemies()

func _spawn_enemy() -> void:
	# Check if we've reached max enemies
	if current_enemy_count >= max_enemies:
		return

	# Calculate spawn position in a circle around the player
	var angle := randf() * TAU  # Random angle (0 to 2*PI)
	var distance := randf_range(min_spawn_distance, max_spawn_distance)

	var spawn_offset := Vector3(
		cos(angle) * distance,
		1.0,  # Spawn at y=1
		sin(angle) * distance
	)

	var spawn_position := player.global_position + spawn_offset

	# Create enemy
	var enemy: Node3D

	if enemy_scene != null:
		enemy = enemy_scene.instantiate()
	else:
		# Create a simple default enemy (sphere)
		enemy = _create_default_enemy()

	enemy.global_position = spawn_position
	add_child(enemy)
	enemies.append(enemy)
	current_enemy_count += 1

func _create_default_enemy() -> Node3D:
	"""Creates a simple default enemy with a sphere mesh."""
	var enemy := CharacterBody3D.new()
	enemy.name = "Enemy"

	# Add mesh
	var mesh_instance := MeshInstance3D.new()
	var sphere_mesh := SphereMesh.new()
	sphere_mesh.radius = 0.5
	sphere_mesh.height = 1.0
	mesh_instance.mesh = sphere_mesh

	# Create a simple material to make it red
	var material := StandardMaterial3D.new()
	material.albedo_color = Color.RED
	mesh_instance.material_override = material

	enemy.add_child(mesh_instance)

	# Add collision shape
	var collision_shape := CollisionShape3D.new()
	var sphere_shape := SphereShape3D.new()
	sphere_shape.radius = 0.5
	collision_shape.shape = sphere_shape
	enemy.add_child(collision_shape)

	# Add simple enemy behavior script
	var script := GDScript.new()
	script.source_code = """
extends CharacterBody3D

var player: Node3D = null
var move_speed: float = 3.0
var gravity: float = 9.8

func _ready() -> void:
	player = get_tree().get_first_node_in_group("player")

func _physics_process(delta: float) -> void:
	if player == null:
		return

	# Apply gravity
	if not is_on_floor():
		velocity.y -= gravity * delta
	else:
		velocity.y = -0.1

	# Move towards player
	var direction := (player.global_position - global_position).normalized()
	direction.y = 0  # Don't move vertically

	velocity.x = direction.x * move_speed
	velocity.z = direction.z * move_speed

	move_and_slide()
"""
	script.reload()
	enemy.set_script(script)

	return enemy

func _cleanup_enemies() -> void:
	"""Remove destroyed or invalid enemies from the list."""
	var i := enemies.size() - 1
	while i >= 0:
		if not is_instance_valid(enemies[i]) or enemies[i].is_queued_for_deletion():
			enemies.remove_at(i)
			current_enemy_count -= 1
		i -= 1

func get_spawn_rate() -> float:
	"""Returns the current spawn rate (enemies per second)."""
	return 1.0 / spawn_interval if spawn_interval > 0 else 0.0

func get_enemy_count() -> int:
	"""Returns the current number of active enemies."""
	return current_enemy_count
