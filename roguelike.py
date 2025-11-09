#!/usr/bin/env python3
"""
Simple Roguelike Game
A classic dungeon crawler with procedurally generated levels.
"""

import curses
import random
from dataclasses import dataclass
from typing import List, Tuple, Optional
from enum import Enum


class Tile(Enum):
    """Tile types in the dungeon"""
    WALL = '#'
    FLOOR = '.'
    EMPTY = ' '


@dataclass
class Position:
    """2D position in the dungeon"""
    x: int
    y: int

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))


class Entity:
    """Base class for all game entities"""
    def __init__(self, x: int, y: int, char: str, name: str, hp: int, attack: int):
        self.pos = Position(x, y)
        self.char = char
        self.name = name
        self.hp = hp
        self.max_hp = hp
        self.attack = attack

    def move(self, dx: int, dy: int):
        """Move the entity by offset"""
        self.pos.x += dx
        self.pos.y += dy

    def take_damage(self, damage: int) -> bool:
        """Take damage, return True if entity dies"""
        self.hp -= damage
        return self.hp <= 0


class Player(Entity):
    """Player character"""
    def __init__(self, x: int, y: int):
        super().__init__(x, y, '@', 'Player', hp=30, attack=5)
        self.level = 1

    def heal(self, amount: int):
        """Heal the player"""
        self.hp = min(self.hp + amount, self.max_hp)

    def power_up(self, amount: int):
        """Increase attack power"""
        self.attack += amount


class Enemy(Entity):
    """Enemy character"""
    def __init__(self, x: int, y: int, enemy_type: str = 'goblin'):
        if enemy_type == 'goblin':
            super().__init__(x, y, 'g', 'Goblin', hp=10, attack=3)
        elif enemy_type == 'orc':
            super().__init__(x, y, 'o', 'Orc', hp=15, attack=5)
        else:
            super().__init__(x, y, 'e', 'Enemy', hp=10, attack=3)


class Item:
    """Item that can be picked up"""
    def __init__(self, x: int, y: int, item_type: str):
        self.pos = Position(x, y)
        self.item_type = item_type

        if item_type == 'potion':
            self.char = '!'
            self.name = 'Health Potion'
        elif item_type == 'weapon':
            self.char = '+'
            self.name = 'Weapon'
        else:
            self.char = '?'
            self.name = 'Unknown Item'


class Room:
    """Rectangular room in the dungeon"""
    def __init__(self, x: int, y: int, width: int, height: int):
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def center(self) -> Tuple[int, int]:
        """Get the center coordinates of the room"""
        return (self.x + self.width // 2, self.y + self.height // 2)

    def intersects(self, other: 'Room') -> bool:
        """Check if this room intersects with another"""
        return (self.x <= other.x + other.width and
                self.x + self.width >= other.x and
                self.y <= other.y + other.height and
                self.y + self.height >= other.y)


class Dungeon:
    """Procedurally generated dungeon"""
    def __init__(self, width: int = 80, height: int = 20, num_rooms: int = 10):
        self.width = width
        self.height = height
        self.tiles = [[Tile.WALL for _ in range(width)] for _ in range(height)]
        self.rooms: List[Room] = []
        self.generate(num_rooms)

    def generate(self, num_rooms: int):
        """Generate rooms and corridors"""
        for _ in range(num_rooms):
            # Random room size
            w = random.randint(4, 10)
            h = random.randint(3, 6)
            x = random.randint(1, self.width - w - 1)
            y = random.randint(1, self.height - h - 1)

            new_room = Room(x, y, w, h)

            # Check if room overlaps with existing rooms
            if not any(new_room.intersects(other) for other in self.rooms):
                self.create_room(new_room)

                # Connect to previous room with corridor
                if self.rooms:
                    prev_center = self.rooms[-1].center()
                    new_center = new_room.center()

                    # Randomly choose horizontal-first or vertical-first corridor
                    if random.random() < 0.5:
                        self.create_h_corridor(prev_center[0], new_center[0], prev_center[1])
                        self.create_v_corridor(prev_center[1], new_center[1], new_center[0])
                    else:
                        self.create_v_corridor(prev_center[1], new_center[1], prev_center[0])
                        self.create_h_corridor(prev_center[0], new_center[0], new_center[1])

                self.rooms.append(new_room)

    def create_room(self, room: Room):
        """Carve out a room"""
        for y in range(room.y, room.y + room.height):
            for x in range(room.x, room.x + room.width):
                if 0 <= x < self.width and 0 <= y < self.height:
                    self.tiles[y][x] = Tile.FLOOR

    def create_h_corridor(self, x1: int, x2: int, y: int):
        """Create horizontal corridor"""
        for x in range(min(x1, x2), max(x1, x2) + 1):
            if 0 <= x < self.width and 0 <= y < self.height:
                self.tiles[y][x] = Tile.FLOOR

    def create_v_corridor(self, y1: int, y2: int, x: int):
        """Create vertical corridor"""
        for y in range(min(y1, y2), max(y1, y2) + 1):
            if 0 <= x < self.width and 0 <= y < self.height:
                self.tiles[y][x] = Tile.FLOOR

    def is_walkable(self, x: int, y: int) -> bool:
        """Check if a position is walkable"""
        if 0 <= x < self.width and 0 <= y < self.height:
            return self.tiles[y][x] == Tile.FLOOR
        return False

    def get_random_floor_position(self) -> Tuple[int, int]:
        """Get a random walkable position"""
        while True:
            x = random.randint(0, self.width - 1)
            y = random.randint(0, self.height - 1)
            if self.is_walkable(x, y):
                return (x, y)


class Game:
    """Main game class"""
    def __init__(self, stdscr):
        self.stdscr = stdscr
        self.messages: List[str] = []
        self.dungeon_level = 1
        self.game_over = False

        # Initialize curses
        curses.curs_set(0)  # Hide cursor
        self.stdscr.clear()

        # Get screen dimensions
        self.screen_height, self.screen_width = stdscr.getmaxyx()

        # Message log area height
        self.msg_height = 5
        self.dungeon_height = self.screen_height - self.msg_height - 1

        # Initialize game state
        self.new_level()

    def new_level(self):
        """Generate a new dungeon level"""
        # Create dungeon
        self.dungeon = Dungeon(width=min(80, self.screen_width),
                              height=self.dungeon_height - 1)

        # Place player in first room
        if self.dungeon.rooms:
            px, py = self.dungeon.rooms[0].center()
            if not hasattr(self, 'player'):
                self.player = Player(px, py)
            else:
                self.player.pos.x = px
                self.player.pos.y = py

        # Place stairs in last room
        if len(self.dungeon.rooms) > 1:
            sx, sy = self.dungeon.rooms[-1].center()
            self.stairs_pos = Position(sx, sy)
        else:
            self.stairs_pos = Position(px + 5, py + 5)

        # Spawn enemies
        self.enemies: List[Enemy] = []
        num_enemies = 3 + self.dungeon_level
        for _ in range(num_enemies):
            ex, ey = self.dungeon.get_random_floor_position()
            # Avoid spawning on player
            if abs(ex - self.player.pos.x) > 5 or abs(ey - self.player.pos.y) > 5:
                enemy_type = random.choice(['goblin', 'goblin', 'orc'])
                self.enemies.append(Enemy(ex, ey, enemy_type))

        # Spawn items
        self.items: List[Item] = []
        num_items = 3 + random.randint(0, 2)
        for _ in range(num_items):
            ix, iy = self.dungeon.get_random_floor_position()
            item_type = random.choice(['potion', 'potion', 'weapon'])
            self.items.append(Item(ix, iy, item_type))

        self.add_message(f"You descend to level {self.dungeon_level}...")

    def add_message(self, msg: str):
        """Add a message to the log"""
        self.messages.append(msg)
        # Keep only recent messages
        if len(self.messages) > 100:
            self.messages = self.messages[-100:]

    def draw(self):
        """Draw the game screen"""
        self.stdscr.clear()

        # Draw dungeon
        for y in range(min(self.dungeon.height, self.dungeon_height)):
            for x in range(min(self.dungeon.width, self.screen_width)):
                char = self.dungeon.tiles[y][x].value
                try:
                    self.stdscr.addch(y, x, char)
                except curses.error:
                    pass

        # Draw stairs
        try:
            self.stdscr.addch(self.stairs_pos.y, self.stairs_pos.x, '>')
        except curses.error:
            pass

        # Draw items
        for item in self.items:
            try:
                self.stdscr.addch(item.pos.y, item.pos.x, item.char)
            except curses.error:
                pass

        # Draw enemies
        for enemy in self.enemies:
            try:
                self.stdscr.addch(enemy.pos.y, enemy.pos.x, enemy.char)
            except curses.error:
                pass

        # Draw player
        try:
            self.stdscr.addch(self.player.pos.y, self.player.pos.x, self.player.char)
        except curses.error:
            pass

        # Draw UI
        ui_y = self.dungeon_height
        status = f"HP: {self.player.hp}/{self.player.max_hp} | ATK: {self.player.attack} | Level: {self.dungeon_level}"
        try:
            self.stdscr.addstr(ui_y, 0, "=" * min(self.screen_width - 1, 80))
            self.stdscr.addstr(ui_y + 1, 0, status[:self.screen_width - 1])
        except curses.error:
            pass

        # Draw message log (last few messages)
        recent_messages = self.messages[-3:]
        for i, msg in enumerate(recent_messages):
            try:
                self.stdscr.addstr(ui_y + 2 + i, 0, msg[:self.screen_width - 1])
            except curses.error:
                pass

        self.stdscr.refresh()

    def handle_input(self) -> bool:
        """Handle player input, return False to quit"""
        key = self.stdscr.getch()

        dx, dy = 0, 0

        # Movement keys
        if key == ord('w') or key == curses.KEY_UP:
            dy = -1
        elif key == ord('s') or key == curses.KEY_DOWN:
            dy = 1
        elif key == ord('a') or key == curses.KEY_LEFT:
            dx = -1
        elif key == ord('d') or key == curses.KEY_RIGHT:
            dx = 1
        elif key == ord('q'):
            return False
        else:
            return True  # No valid move, skip turn

        # Try to move player
        new_x = self.player.pos.x + dx
        new_y = self.player.pos.y + dy

        # Check for enemy collision (attack)
        enemy_at_pos = None
        for enemy in self.enemies:
            if enemy.pos.x == new_x and enemy.pos.y == new_y:
                enemy_at_pos = enemy
                break

        if enemy_at_pos:
            # Attack enemy
            damage = self.player.attack + random.randint(0, 2)
            if enemy_at_pos.take_damage(damage):
                self.add_message(f"You killed the {enemy_at_pos.name}!")
                self.enemies.remove(enemy_at_pos)
            else:
                self.add_message(f"You hit the {enemy_at_pos.name} for {damage} damage!")
        elif self.dungeon.is_walkable(new_x, new_y):
            # Move player
            self.player.move(dx, dy)

            # Check for item pickup
            item_at_pos = None
            for item in self.items:
                if item.pos == self.player.pos:
                    item_at_pos = item
                    break

            if item_at_pos:
                self.pickup_item(item_at_pos)
                self.items.remove(item_at_pos)

            # Check for stairs
            if self.player.pos == self.stairs_pos:
                self.dungeon_level += 1
                self.new_level()
                return True

        # Enemy turn
        self.enemy_turn()

        return True

    def pickup_item(self, item: Item):
        """Handle item pickup"""
        if item.item_type == 'potion':
            heal_amount = 10
            self.player.heal(heal_amount)
            self.add_message(f"You drink a {item.name} and heal {heal_amount} HP!")
        elif item.item_type == 'weapon':
            power = random.randint(1, 3)
            self.player.power_up(power)
            self.add_message(f"You picked up a {item.name}! Attack +{power}!")

    def enemy_turn(self):
        """Process all enemy actions"""
        for enemy in self.enemies[:]:  # Copy list to avoid modification issues
            # Simple AI: move towards player
            dx = 0
            dy = 0

            if enemy.pos.x < self.player.pos.x:
                dx = 1
            elif enemy.pos.x > self.player.pos.x:
                dx = -1

            if enemy.pos.y < self.player.pos.y:
                dy = 1
            elif enemy.pos.y > self.player.pos.y:
                dy = -1

            # Randomly choose to move horizontally or vertically
            if dx != 0 and dy != 0:
                if random.random() < 0.5:
                    dy = 0
                else:
                    dx = 0

            new_x = enemy.pos.x + dx
            new_y = enemy.pos.y + dy

            # Check if moving into player (attack)
            if new_x == self.player.pos.x and new_y == self.player.pos.y:
                damage = enemy.attack + random.randint(0, 2)
                if self.player.take_damage(damage):
                    self.add_message(f"{enemy.name} killed you!")
                    self.game_over = True
                else:
                    self.add_message(f"{enemy.name} hits you for {damage} damage!")
            elif self.dungeon.is_walkable(new_x, new_y):
                # Check if another enemy is there
                occupied = any(e.pos.x == new_x and e.pos.y == new_y
                             for e in self.enemies if e != enemy)
                if not occupied:
                    enemy.move(dx, dy)

    def run(self):
        """Main game loop"""
        self.add_message("Welcome to the Dungeon! Use WASD or arrows to move.")
        self.add_message("Find the stairs (>) to descend deeper. Press 'q' to quit.")

        while not self.game_over:
            self.draw()
            if not self.handle_input():
                break

        # Game over screen
        if self.game_over:
            self.stdscr.clear()
            height, width = self.stdscr.getmaxyx()
            msg1 = "GAME OVER"
            msg2 = f"You survived {self.dungeon_level - 1} levels."
            msg3 = "Press any key to exit..."

            try:
                self.stdscr.addstr(height // 2 - 1, (width - len(msg1)) // 2, msg1)
                self.stdscr.addstr(height // 2, (width - len(msg2)) // 2, msg2)
                self.stdscr.addstr(height // 2 + 1, (width - len(msg3)) // 2, msg3)
            except curses.error:
                pass

            self.stdscr.refresh()
            self.stdscr.getch()


def main(stdscr):
    """Entry point for curses application"""
    game = Game(stdscr)
    game.run()


if __name__ == '__main__':
    curses.wrapper(main)
