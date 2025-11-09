# Python Roguelike Game

A classic ASCII roguelike dungeon crawler built with Python's curses library.

## Features

- **Procedurally Generated Dungeons**: Each level features randomly generated rooms connected by corridors
- **Turn-Based Combat**: Bump into enemies to attack them
- **Enemies**: Face goblins (g) and orcs (o) that chase you through the dungeon
- **Items**:
  - Health Potions (!): Restore 10 HP
  - Weapons (+): Increase your attack damage
- **Character Progression**: Descend deeper into the dungeon through stairs (>)
- **Permadeath**: When your HP reaches 0, the game is over
- **Real-time UI**: Track your HP, attack power, and current dungeon level

## How to Play

### Running the Game

```bash
python3 roguelike.py
```

### Controls

- **Movement**:
  - Arrow keys (↑ ↓ ← →) or WASD
  - Move into an enemy to attack it
- **Quit**: Press `q` to exit the game

### Game Mechanics

1. **Combat**:
   - Walk into enemies to attack them
   - Enemies will attack you when adjacent
   - Damage is based on attack stat + small random variance

2. **Items**:
   - Walk over items to automatically pick them up
   - Health potions restore HP immediately
   - Weapons permanently increase your attack power

3. **Level Progression**:
   - Find the stairs (>) to descend to the next level
   - Each level gets progressively harder with more enemies
   - Your stats carry over between levels

4. **Death**:
   - Game ends when HP reaches 0 (permadeath)
   - Try to survive as many levels as possible!

## Game Symbols

- `@` - You (the player)
- `g` - Goblin (10 HP, 3 ATK)
- `o` - Orc (15 HP, 5 ATK)
- `!` - Health Potion
- `+` - Weapon
- `>` - Stairs to next level
- `#` - Wall
- `.` - Floor

## Starting Stats

- **HP**: 30
- **Attack**: 5

## Tips

- Health potions are precious - use them wisely!
- Weapons stack - collect multiple to become stronger
- Enemies get more numerous as you descend
- Sometimes retreating is better than fighting
- Use corridors to fight enemies one at a time

## Requirements

- Python 3.6+
- Unix-like system (Linux, macOS) or Windows with curses support

Enjoy your dungeon crawl!
