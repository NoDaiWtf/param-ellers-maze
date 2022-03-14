# Parametrized Eller's Mazes

This project uses [Eller's Algorithm](http://www.neocomputer.org/projects/eller.html) to generate seeded random mazes.

You can pass query-string parameters to change the maze outcome:
 - **seed**: the seed to feed the random, in order to replicate the same maze.
 - **hProb**: the probability of horizontal walls. The higher this value, the less horizontal openings will be in the maze.
 - **vProb**: the probability of vertical walls. The higher this value, the less vetical openings will be in the maze.
 - **lProb**: the probability of loops. The higher the value, the more loops will spawn in the maze.
