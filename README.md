# Godot 3D Player Controller

A complete 3D player controller system with enemy spawner for Godot 4.3.

## Features

### Player Controller
- **WASD Movement**: Smooth, physics-based movement with momentum
- **Dash Ability**: Press spacebar to dash in the current movement direction
  - Dash speed: 15 units/sec
  - Cooldown: 2 seconds
- **Movement Parameters**:
  - Max speed: 8 units/sec
  - Acceleration: 40 units/sec²
  - Friction: 20 units/sec²
- **Physics-based**: Uses CharacterBody3D with proper gravity and collision
- **Camera**: Third-person camera that follows the player

### Enemy Spawner
- **Automatic Spawning**: Enemies spawn every 2 seconds (default)
- **Dynamic Difficulty**: Spawn rate increases over time
- **Smart Positioning**: Enemies spawn in a circle around the player (10-20 units away)
- **Performance Cap**: Maximum 100 enemies on screen
- **Enemy Behavior**: Enemies automatically chase the player

## Project Structure

```
├── main.tscn                  # Main test scene
├── player.tscn                # Player scene (CharacterBody3D)
├── player_controller.gd       # Player controller script
├── enemy_spawner.gd           # Enemy spawner script
└── project.godot              # Godot project configuration
```

## Scene Hierarchy

### Player Scene
```
Player (CharacterBody3D)
├── MeshInstance3D (capsule mesh)
├── CollisionShape3D (capsule collision)
└── Camera3D (third-person view)
```

### Main Scene
```
Main (Node3D)
├── Ground (StaticBody3D with collision)
├── Player (instance of player.tscn)
├── DirectionalLight3D (with shadows)
├── EnemySpawner (spawns and manages enemies)
└── WorldEnvironment (ambient lighting)
```

## Controls

- **W/A/S/D**: Move forward/left/back/right
- **Spacebar**: Dash (2-second cooldown)

## How to Use

1. Open the project in Godot 4.3 or later
2. Run the main scene (F5) or press the Play button
3. Use WASD to move and Spacebar to dash
4. Enemies will spawn around you automatically

## Customization

### Player Controller (`player_controller.gd`)
All movement parameters are exported variables that can be adjusted in the Godot editor:
- `max_speed`: Maximum movement speed
- `acceleration`: How quickly the player reaches max speed
- `friction`: How quickly the player stops
- `dash_speed`: Speed during dash
- `dash_cooldown`: Cooldown time between dashes

### Enemy Spawner (`enemy_spawner.gd`)
Spawn behavior can be customized via exported variables:
- `spawn_interval`: Time between spawns
- `min_spawn_distance`: Minimum distance from player
- `max_spawn_distance`: Maximum distance from player
- `max_enemies`: Maximum number of enemies on screen
- `spawn_rate_increase`: Multiplier for increasing difficulty
- `enemy_scene`: Custom enemy scene (optional)

## Code Style

This project follows Godot GDScript best practices:
- **Files**: snake_case naming (e.g., `player_controller.gd`)
- **Classes**: PascalCase naming (e.g., `PlayerController`)
- **Scenes**: snake_case naming (e.g., `player.tscn`)
- **Type hints**: Used throughout for better performance and IDE support

## License

This project is provided as-is for educational purposes.
