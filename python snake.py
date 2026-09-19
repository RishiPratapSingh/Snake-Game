import os
import time
import random

# Initialize game settings
WIDTH, HEIGHT = 20, 20
SPEED = 0.1
SCORE = 0

# Initialize snake and food positions
snake = [(0, 0)]
food = (0, 0)

# Function to draw the game board
def draw_board():
    os.system('cls' if os.name == 'nt' else 'clear')
    for y in range(HEIGHT):
        for x in range(WIDTH):
            if (x, y) in snake:
                print('S', end=' ')
            elif (x, y) == food:
                print('F', end=' ')
            else:
                print('.', end=' ')
        print()

# Main game loop
while True:
    # Draw the game board
    draw_board()

    # Wait for user input
    user_input = input("Enter direction (W/A/S/D): ")

    # Move the snake
    if user_input == 'w' and (0, 1) not in snake[-1]:
        snake.append((snake[-1][0], snake[-1][1] + 1))
    elif user_input == 'a' and (1, 0) not in snake[-1]:
        snake.append((snake[-1][0] - 1, snake[-1][1]))
    elif user_input == 's' and (0, -1) not in snake[-1]:
        snake.append((snake[-1][0], snake[-1][1] - 1))
    elif user_input == 'd' and (1, 0) not in snake[-1]:
        snake.append((snake[-1][0] + 1, snake[-1][1]))

    # Check for food
    if snake[-1] == food:
        SCORE += 1
        food = (random.randint(0, WIDTH - 1), random.randint(0, HEIGHT - 1))
    else:
        snake.pop(0)

    # Check for boundary or collision
    if (snake[-1][0] < 0 or snake[-1][0] >= WIDTH or
        snake[-1][1] < 0 or snake[-1][1] >= HEIGHT):
        print("Game Over")
        break
    elif snake[-1] in snake[:-1]:
        print("Game Over")
        break

    # Wait for a short time before drawing again
    time.sleep(SPEED)

    